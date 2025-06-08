/* eslint-disable no-useless-catch */
import { userModel } from '../models/userModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/formatter'
import { WEBSITE_DOMAIN } from '~/utils/constants'
import { BrevoProvider } from '~/providers/BrevoProvider'
import { env } from '~/config/environment'
import { JwtProvider } from '~/providers/JwtProvider'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider'
import { cartModel } from '~/models/cartModel'
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '~/utils/constants'

const createNew = async (reqBody) => {
  try {
  //Kiểm tra email đã tồn tại trong hệ thống hay chưa
    const existUser = await userModel.findOneByEmail(reqBody.email)
    if (existUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already exists!')
    }

    // Tạo data để lưu vào DB
    // const name = reqBody.name || reqBody.email.split('@')[0]
    // Lấy name từ email (chuhongminh@gmail.com => chuhongminh)
    const nameFromEmail = reqBody.email.split('@')[0]
    const newUserData = {
      email: reqBody.email,
      password: bcryptjs.hashSync(reqBody.password, 8), // Mã hóa password - tham số thứ 2 là độ phức tạp của password, giá trị càng cao thì băm càng lâu
      username: nameFromEmail,
      displayName: nameFromEmail, // Mặc định để giống username khi user đăng kí mới, về sau làm tính năng update cho user
      verifyToken: uuidv4()
    }
    // Thực hiện lưu thông tin user vào DB
    const createdUser = await userModel.createNew(newUserData)
    const getNewUser = await userModel.findOneById(createdUser.insertedId)

    // Gửi email cho người dùng xác thực tài khoản
    const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`
    const customSubject = 'Please verify your email before using our service!'
    const htmlContent = `
       <h3>Here is your verification link:</h3>
       <h3>${verificationLink}</h3> 
       <h3>Sincerely,<br/>- Chu Hong Minh -</h3> 
    `

    // Gọi tới Provider để gửi mail
    await BrevoProvider.sendEmail(getNewUser.email, customSubject, htmlContent)
    // Tạo cart cho user mới
    await cartModel.createNew({ 
      userId: typeof getNewUser._id === 'object' ? getNewUser._id.toString() : getNewUser._id,
      items: []
    })
    // Return trả về dữ liệu cho tầng Controller
    return pickUser(getNewUser)
  } catch (error) { throw error }
}

const verifyAccount = async (reqBody) => {
  try {
    // Query user trong DB
    const existUser = await userModel.findOneByEmail(reqBody.email)

    // Các bước kiểm tra cần thiết
    if (!existUser) throw new ApiError( StatusCodes.NOT_FOUND, 'Account not found!')
    if (existUser.isActive) throw new ApiError( StatusCodes.NOT_ACCEPTABLE, 'Your account is already active!')
    if (reqBody.token !== existUser.verifyToken) throw new ApiError( StatusCodes.NOT_ACCEPTABLE, 'Token is invalid')

    // Nếu mọi thứ Ok ==> update thông tin user để verify account
    const updateData = {
      isActive: true,
      verifyToken: null
    }
    const updatedUser = await userModel.update(existUser._id, updateData)
    // Trả về dữ liệu cho FE
    return pickUser(updatedUser)

  } catch (error) { throw error }
}

const login = async (reqBody) => {
  try {
    // Query user trong DB
    const existUser = await userModel.findOneByEmail(reqBody.email)

    // Các bước kiểm tra cần thiết
    if (!existUser) throw new ApiError( StatusCodes.NOT_FOUND, 'Account not found!')
    if (!existUser.isActive) throw new ApiError( StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')
    // Kiểm tra mật khẩu (TH error)
    if (!bcryptjs.compareSync(reqBody.password, existUser.password)) {
      throw new ApiError( StatusCodes.NOT_ACCEPTABLE, 'Your Email or Password is incorrect!')
    }

    // Nếu mọi thứ ok => tạo token đăng nhập để trả cho phía FE
    // Tạo Thông tin để đính kèm trong JWT Token bao gồm _id và email của user
    const userInfo = {
      _id:existUser._id,
      email:existUser.email
    }
    // Tạo ra 2 loại token là accessToken và refreshToken để trả cho phía FE
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    )

    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      env.REFRESH_TOKEN_LIFE)
    //Trả về thông tin user kèm theo hai cái token vừa được tạo ra
    return { accessToken, refreshToken, ...pickUser(existUser) }
  } catch (error) { throw error }
}

const refreshToken = async (clientRefreshToken) => {
  try {
    //Verify / Giải mã và xác thực refresh Token có hợp lệ hay không
    const refreshTokenDecoded = await JwtProvider.verifyToken(
      clientRefreshToken,
      env.REFRESH_TOKEN_SECRET_SIGNATURE
    )
    // Đoạn này vì chúng ta chỉ lưu thông tin unique và cố định của user trong token rồi, vì vậy có thể lấy luôn từ decoded ra, tiết kiệm query vào DB để lấy data mới
    // tạo accessToken mới
    const userinfo = {
      _id: refreshTokenDecoded._id,
      email: refreshTokenDecoded.email
    }

    const accessToken = await JwtProvider.generateToken(
      userinfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
      // 5
    )
    return { accessToken }
  } catch (error) { throw error }
}

const update = async (userId, reqBody, userAvatarFile) => {
  try {
    // Query user trong DB
    const existUser = await userModel.findOneById(userId)
    if (!existUser) throw new ApiError( StatusCodes.NOT_FOUND, 'Account not found!')
    if (!existUser.isActive) throw new ApiError( StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')
    // Nếu mọi thứ ok => update displayName
    let updatedUser = {}
    // TH change password
    if (reqBody.current_password && reqBody.new_password) {
      // Kiểm tra mật khẩu cũ
      if (!bcryptjs.compareSync(reqBody.current_password, existUser.password)) {
        throw new ApiError( StatusCodes.NOT_ACCEPTABLE, 'Your current password is incorrect!')
      }
      // Nếu mật khẩu cũ đúng thì mới cho phép update mật khẩu mới
      updatedUser = await userModel.update(userId, {
        password: bcryptjs.hashSync(reqBody.new_password, 8)
      })

    } else if (userAvatarFile) {
      // TH upload file lên cloud storage (cloudinary)
      const uploadResult = await CloudinaryProvider.streamUpload(userAvatarFile.buffer, 'user_avatar')
      console.log('🚀 ~ update ~ uploadResult:', uploadResult)

      // Lưu lại url (secure_url) của file ảnh vào DB
      updatedUser = await userModel.update(userId, {
        avatar: uploadResult.secure_url
      })

    } else {
      // TH update các thông tin chung như displayName
      updatedUser = await userModel.update(userId, reqBody)
    }
    // Trả về dữ liệu cho FE
    return pickUser(updatedUser)

  } catch (error) { throw error }
}

const getAllUsers = async (page, itemsPerPage ) => {
  try {
    // Nếu không có giá trị page hoặc itemsPerPage được truyền từ FE, gán giá trị mặc định
    if (!page) page = DEFAULT_PAGE
    if (!itemsPerPage) itemsPerPage = DEFAULT_ITEMS_PER_PAGE

    const results = await userModel.getAllUsers(parseInt(page, 10), parseInt(itemsPerPage, 10))

    return results
  } catch (error) { throw error }
}

const findCartByUserId = async (userid) => {
  try {
    const result = await cartModel.findOneByUserId(userid)
    return result
  } catch (error) {
    throw error
  }
}

const deleteUser = async (userId) => {
  try {
    const cart = await findCartByUserId(userId)
    if (cart) {
      await cartModel.deleteOneById(cart._id)
    }
    const result = await userModel.deleteOneById(userId)
    return result
  } catch (error) {
    throw error
  }
}
export const userService = {
  createNew,
  login,
  verifyAccount,
  refreshToken,
  update,
  getAllUsers,
  findCartByUserId,
  deleteUser
}