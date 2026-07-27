// Standard backend API envelope
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

// Paginated response wrapper
export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
}

// Standard API error shape
export interface ApiError {
  success: false
  message: string
  errors?: Record<string, string>
  status?: number
}

// Sort direction
export type SortDir = 'asc' | 'desc'

// Pagination params
export interface PaginationParams {
  page?: number
  size?: number
  sortBy?: string
  sortDir?: SortDir
}
