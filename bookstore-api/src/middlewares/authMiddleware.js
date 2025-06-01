import { JwtProvider } from '~/providers/JwtProvider'
import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import ApiError from '~/utils/ApiError'

// Middeware này sẽ đảm nhiệm việc quan trọng : lấy và xác thực cái JWT accessToken nhận được từ phía FE có hợp lệ hay không

const isAuthorized = async (req, res, next) => {
  // Lấy accessToken nằm trong request cookies phia client - withCredentials trong file authorizeAxios và Credentials trong CORS
  const clientAccessToken = req.cookies?.accessToken
  // Nếu clientAccessToken không tồn tại => trả về lỗi
  if (!clientAccessToken) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized! (Token not found)'))
    return
  }

  try {
    // b1: thực hiện giải mã token có hợp lệ hay không
    const accessTokenDecoded = await JwtProvider.verifyToken(
      clientAccessToken,
      env.ACCESS_TOKEN_SECRET_SIGNATURE
    )
    // console.log('accessTokenDecoded: ', accessTokenDecoded)

    // b2: nếu cái token hợp lệ thì sẽ cần phải lưu thông tin giải mã vào req.jwtDecoded, để sử dụng cho các tầng xử lý ở phía sau
    req.jwtDecoded = accessTokenDecoded
    // console.log(req.jwtDecoded)

    //b3: Cho phép các request đi tiếp
    next()
  } catch (error) {
    // console.log('Error from authMiddleware: ', error)

    // TH1: nếu accessToken bị hết hạn (expired) thì cần trả về lỗi GONE - 410 cho phía FE để gọi api refreshToken
    if (error.message?.includes('jwt expired')) {
      next(new ApiError(StatusCodes.GONE, 'Need to refresh token'))
      return
    }

    // TH2: Nếu như cái accessToken nó không hợp lệ do bất kỳ điều gì khác vụ hết hạn thì chúng ta cứ thẳng tay trả về 401 cho phía FE xử lý logout / hoặc gọi api logout tùy trường hợp
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized! Please login'))

  }
}
export const authMiddleware = {
  isAuthorized
}
