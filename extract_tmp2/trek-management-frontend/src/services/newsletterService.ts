/**
 * Newsletter service — placeholder for future API integration.
 *
 * Will consume:
 *   POST /api/v1/newsletter/subscribe    → ENDPOINTS.NEWSLETTER.SUBSCRIBE
 *   POST /api/v1/newsletter/unsubscribe  → ENDPOINTS.NEWSLETTER.UNSUBSCRIBE
 */
import apiClient from '@/api/apiClient'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiResponse } from '@/types/api'

export interface NewsletterSubscribeRequest {
  email: string
}

const newsletterService = {
  // TODO: implement — POST /api/v1/newsletter/subscribe
  subscribe: (data: NewsletterSubscribeRequest): Promise<ApiResponse<void>> =>
    apiClient.post<ApiResponse<void>>(ENDPOINTS.NEWSLETTER.SUBSCRIBE, data).then((r) => r.data),

  // TODO: implement — POST /api/v1/newsletter/unsubscribe
  unsubscribe: (data: NewsletterSubscribeRequest): Promise<ApiResponse<void>> =>
    apiClient.post<ApiResponse<void>>(ENDPOINTS.NEWSLETTER.UNSUBSCRIBE, data).then((r) => r.data),
}

export default newsletterService
