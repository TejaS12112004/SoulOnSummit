import apiClient from '@/api/apiClient'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiResponse, HomeFeaturedTrekResponse, HomeUpcomingDepartureResponse } from '@/types/api'

const homeService = {
  getFeaturedTreks: (): Promise<HomeFeaturedTrekResponse[]> =>
    apiClient.get<ApiResponse<HomeFeaturedTrekResponse[]>>(ENDPOINTS.HOME.FEATURED_TREKS).then((r) => r.data.data),

  getUpcomingDepartures: (): Promise<HomeUpcomingDepartureResponse[]> =>
    apiClient.get<ApiResponse<HomeUpcomingDepartureResponse[]>>(ENDPOINTS.HOME.UPCOMING_DEPARTURES).then((r) => r.data.data),
}

export default homeService
