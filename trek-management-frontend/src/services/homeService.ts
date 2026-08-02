import apiClient from '@/api/apiClient'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiResponse, TrekSummaryResponse, HomeUpcomingDepartureResponse } from '@/types/api'

const homeService = {
  getFeaturedTreks: (): Promise<TrekSummaryResponse[]> =>
    apiClient.get<ApiResponse<TrekSummaryResponse[]>>(ENDPOINTS.HOME.FEATURED_TREKS).then((r) => r.data.data),

  getUpcomingDepartures: (): Promise<HomeUpcomingDepartureResponse[]> =>
    apiClient.get<ApiResponse<HomeUpcomingDepartureResponse[]>>(ENDPOINTS.HOME.UPCOMING_DEPARTURES).then((r) => r.data.data),
}

export default homeService
