import multer from 'multer'
import {LIMIT_COMMON_FILE_SIZE, ALLOW_COMMON_FILE_TYPES} from '~/utils/validators'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
// Func kiểm tra loại file nào được chấp nhận


const customsFileFilter = (req, file, callback) => {
  console.log('Multer file: ', file)
  // Kiểm tra kiểu file - mimetype
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.mimetype)) {
    const errMessage = 'File type is invalid. Only accept jpg, jpeg and png'
    return callback(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errMessage), null)
  }

  // // Kiểm tra kích thước file
  // if (file.size > LIMIT_COMMON_FILE_SIZE) {
  //   const errMessage = 'File size is too large. Maximum allowed size is 10MB'
  //   return callback(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errMessage), null)
  // }
  // Nếu như kiểu file hợp lệ
  callback(null, true)
}

// Khởi tạo func upload được bọc bởi multer

const upload = multer({
  // storage: multer.memoryStorage(),
  limits: {
    fileSize: LIMIT_COMMON_FILE_SIZE
  },
  fileFilter: customsFileFilter
})

export const multerUploadMiddleware = { upload }