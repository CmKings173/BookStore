import { env } from '~/config/environment'
// Những domain được phép truy cập tới tài nguyên của server
export const WHITELIST_DOMAINS = [
  'http://localhost:5173'
]

export const BOARD_TYPES = {
  PUBLIC:'public',
  PRIVATE:'private'
}

export const WEBSITE_DOMAIN = (env.BUILD_MODE === 'production') ? env.WEBSITE_DOMAIN_PRODUCTION : env.WEBSITE_DOMAIN_DEVELOPMENT

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 12