// ===========================================
// API Response Types
// ===========================================

/**
 * Common API response wrapper
 */
export interface IApiResponse<T = any> {
  code: number
  message: string
  data: T
}

/**
 * Pagination parameters
 */
export interface IPaginationParams {
  page: number
  pageSize: number
  total?: number
}

/**
 * Paginated response
 */
export interface IPaginatedResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

/**
 * Table sort parameters
 */
export interface ISortParams {
  prop: string
  order: 'ascending' | 'descending' | null
}

/**
 * Table filter parameters
 */
export interface IFilterParams {
  [key: string]: string | string[] | null
}

/**
 * Request config extension
 */
export interface IRequestConfig {
  showLoading?: boolean
  loadingText?: string
  showError?: boolean
}
