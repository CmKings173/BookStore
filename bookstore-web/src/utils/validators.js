export const FIELD_REQUIRED_MESSAGE = 'This field is required'
export const EMAIL_RULE = /^\S+@\S+\.\S+$/
export const EMAIL_RULE_MESSAGE = 'Email is not valid. (example@gmail.com)'
export const PASSWORD_RULE = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,256}$/
export const PASSWORD_RULE_MESSAGE = 'Password must be at least 8 characters long and contain at least one letter and one number'
export const USERNAME_RULE = /^[a-zA-Z0-9_]{3,20}$/
export const USERNAME_RULE_MESSAGE =
  'Username must be 3-20 characters and only contain letters, numbers, or underscores.'
// Liên quan đến validate File
export const LIMIT_COMMON_FILE_SIZE = 10485760 // 10MB
export const ALLOW_COMMON_FILE_TYPES = ['image/png', 'image/jpeg', 'image/jpg']
export const singleFileValidator = (file) => {
  if (!file || !file.name || !file.size || !file.type) {
    return 'File cannot be blank.'
  }
  if (file.size > LIMIT_COMMON_FILE_SIZE) {
    return 'File size must be less than 10MB.'
  }
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.type)) {
    return 'File type is invalid. Only PNG, JPEG, JPG are allowed.'
  }
  return null
}