/**
 * Category service — placeholder for future API integration.
 *
 * Will consume:
 *   GET /api/v1/categories         → ENDPOINTS.CATEGORIES.ALL
 *   GET /api/v1/categories/:slug   → ENDPOINTS.CATEGORIES.BY_SLUG(slug)
 */
import apiClient from '@/api/apiClient'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiResponse } from '@/types/api'
import type { Category } from '@/types/category'

const categoryService = {
  // TODO: implement — GET /api/v1/categories
  getAll: (): Promise<ApiResponse<Category[]>> =>
    apiClient.get<ApiResponse<Category[]>>(ENDPOINTS.CATEGORIES.ALL).then((r) => r.data),

  // TODO: implement — GET /api/v1/categories/:slug
  getBySlug: (slug: string): Promise<ApiResponse<Category>> =>
    apiClient.get<ApiResponse<Category>>(ENDPOINTS.CATEGORIES.BY_SLUG(slug)).then((r) => r.data),
}

export default categoryService
