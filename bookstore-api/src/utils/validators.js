export const OBJECT_ID_RULE = /^[0-9a-fA-F]{24}$/
export const OBJECT_ID_RULE_MESSAGE = 'Your string fails to match the Object Id pattern!'

export const FIELD_REQUIRED_MESSAGE = 'This field is required'
export const EMAIL_RULE = /^\S+@\S+\.\S+$/
export const EMAIL_RULE_MESSAGE = 'Email is not valid. (example@gmail.com)'
export const PASSWORD_RULE = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,256}$/
export const PASSWORD_RULE_MESSAGE = 'Password must be at least 8 characters long and contain at least one letter and one number'
export const USERNAME_RULE = /^[a-zA-Z0-9_]{3,20}$/
export const USERNAME_RULE_MESSAGE =
  'Username must be 3-20 characters and only contain letters, numbers, or underscores.'
export const LIMIT_COMMON_FILE_SIZE = 10485760 // 10MB
export const ALLOW_COMMON_FILE_TYPES = ['image/png', 'image/jpeg', 'image/jpg']
