import apiClient from '@/api/apiClient'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiResponse, TrekSummaryResponse, UpcomingBatchResponse } from '@/types/api'

const homeService = {
  getFeaturedTreks: (): Promise<TrekSummaryResponse[]> =>
    apiClient.get<ApiResponse<TrekSummaryResponse[]>>(ENDPOINTS.HOME.FEATURED_TREKS).then((r) => r.data.data),

  getUpcomingDepartures: (): Promise<UpcomingBatchResponse[]> =>
    apiClient.get<ApiResponse<{ content: UpcomingBatchResponse[] }>>(ENDPOINTS.HOME.UPCOMING_DEPARTURES).then((r) => r.data.data.content),
}

export default homeService
