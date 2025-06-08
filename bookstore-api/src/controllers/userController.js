import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'
import ms from 'ms'
import ApiError from '~/utils/ApiError'
const createNew = async (req, res, next) => {

  try {
    // Điều hướng dữ liệu sang tầng Service
    const createdUser = await userService.createNew(req.body)
    // Có kết quả thì trả về phía client
    res.status(StatusCodes.CREATED).json(createdUser)

  } catch (error) {next(error)}
}

const login = async (req, res, next) => {

  try {
    const result = await userService.login(req.body)

    // Xử lý trả về http only cookie cho trình duyệt
    // Thời gian sống của cookie khác với thời gian sống của token
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite:'none',
      maxAge: ms('14 days')
    })
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite:'none',
      maxAge: ms('14 days')
    })

    res.status(StatusCodes.CREATED).json(result)

  } catch (error) {next(error)}
}

const verifyAccount = async (req, res, next) => {

  try {
    // Điều hướng dữ liệu sang tầng Service
    const result = await userService.verifyAccount(req.body)
    // Có kết quả thì trả về phía client
    res.status(StatusCodes.CREATED).json(result)

  } catch (error) {next(error)}
}

const logout = async (req, res, next) => {
  try {
    // Xóa Cookie
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    res.status(StatusCodes.OK).json({ loggedOut: true })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const refreshToken = async (req, res, next) => {
  try {
    const result = await userService.refreshToken(req.cookies?.refreshToken)
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite:'none',
      maxAge: ms('14 days')
    })

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(new ApiError(StatusCodes.FORBIDDEN, 'Please Sign In! (Error from refresh Token)' ))
  }
}

const update = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const userAvatarFile = req.file
    // console.log('userAvatarFile: ', userAvatarFile)
    const updatedUser = await userService.update(userId, req.body, userAvatarFile)
    // console.log('updatedUser: ', updatedUser)
    res.status(StatusCodes.OK).json(updatedUser)
  } catch (error) { next(error)}
}


const getAllUsers = async (req, res, next) => {
  try {
    const { page, itemsPerPage } = req.query
    const result = await userService.getAllUsers( page, itemsPerPage)

    // Có kết quả thì trả về phía client
    res.status(StatusCodes.OK).json(result)

  } catch (error) {next(error)}
}

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id
    // Điều hướng dữ liệu sang tầng Service
    const result = await userService.deleteUser(userId)
    // Có kết quả thì trả về phía client
    res.status(StatusCodes.OK).json(result)

  } catch (error) {next(error)}
}

export const userController = {
  createNew,
  verifyAccount,
  login,
  logout,
  refreshToken,
  update,
  getAllUsers,
  deleteUser
}