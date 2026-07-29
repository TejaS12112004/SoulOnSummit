import apiClient from '@/api/apiClient'
import { ENDPOINTS } from '@/api/endpoints'
import type { PageResponse, ApiResponse } from '@/types/api'
import type { 
  DashboardMetricsResponse, 
  DashboardChartsResponse,
  AdminTrekSummary,
  AdminTrekDetail,
  AdminDeparture,
  AdminBookingResponse,
  CreateDepartureRequest,
  AdminFilters,
  CreateTrekRequest,
  UpdateTrekRequest,
  UpdateBookingRequest
} from '../types'

const adminService = {
  // ── Dashboard ────────────────────────────────────────────────────────────

  getDashboardMetrics: async (): Promise<DashboardMetricsResponse> => {
    return apiClient
      .get<ApiResponse<DashboardMetricsResponse>>(ENDPOINTS.ADMIN.DASHBOARD.METRICS)
      .then(r => r.data.data)
  },

  getDashboardCharts: async (): Promise<DashboardChartsResponse> => {
    return apiClient
      .get<ApiResponse<DashboardChartsResponse>>(ENDPOINTS.ADMIN.DASHBOARD.CHARTS)
      .then(r => r.data.data)
  },

  // ── Treks ────────────────────────────────────────────────────────────────

  getTreks: async (params?: AdminFilters): Promise<PageResponse<AdminTrekSummary>> => {
    return apiClient
      .get<ApiResponse<PageResponse<AdminTrekSummary>>>(ENDPOINTS.ADMIN.TREKS.ALL, { params })
      .then(r => r.data.data)
  },

  getTrek: async (id: string): Promise<AdminTrekDetail> => {
    return apiClient
      .get<ApiResponse<AdminTrekDetail>>(ENDPOINTS.ADMIN.TREKS.BY_ID(id))
      .then(r => r.data.data)
  },

  createTrek: async (data: CreateTrekRequest): Promise<AdminTrekDetail> => {
    return apiClient
      .post<ApiResponse<AdminTrekDetail>>(ENDPOINTS.ADMIN.TREKS.CREATE, data)
      .then(r => r.data.data)
  },

  updateTrek: async (id: string, data: UpdateTrekRequest): Promise<AdminTrekDetail> => {
    return apiClient
      .put<ApiResponse<AdminTrekDetail>>(ENDPOINTS.ADMIN.TREKS.UPDATE(id), data)
      .then(r => r.data.data)
  },

  deleteTrek: async (id: string): Promise<void> => {
    return apiClient
      .delete<ApiResponse<void>>(ENDPOINTS.ADMIN.TREKS.DELETE(id))
      .then(() => undefined)
  },

  publishTrek: async (id: string): Promise<void> => {
    return apiClient
      .patch<ApiResponse<void>>(ENDPOINTS.ADMIN.TREKS.PUBLISH(id))
      .then(() => undefined)
  },

  unpublishTrek: async (id: string): Promise<void> => {
    return apiClient
      .patch<ApiResponse<void>>(ENDPOINTS.ADMIN.TREKS.UNPUBLISH(id))
      .then(() => undefined)
  },

  featureTrek: async (id: string): Promise<void> => {
    return apiClient
      .patch<ApiResponse<void>>(ENDPOINTS.ADMIN.TREKS.FEATURE(id))
      .then(() => undefined)
  },

  // ── Departures ───────────────────────────────────────────────────────────

  getDepartures: async (trekId: string): Promise<AdminDeparture[]> => {
    return apiClient
      .get<ApiResponse<AdminDeparture[]>>(ENDPOINTS.ADMIN.TREKS.DEPARTURES.ALL(trekId))
      .then(r => r.data.data)
  },

  getDeparture: async (trekId: string, depId: string): Promise<AdminDeparture> => {
    return apiClient
      .get<ApiResponse<AdminDeparture>>(ENDPOINTS.ADMIN.TREKS.DEPARTURES.BY_ID(trekId, depId))
      .then(r => r.data.data)
  },

  createDeparture: async (trekId: string, data: CreateDepartureRequest): Promise<AdminDeparture> => {
    return apiClient
      .post<ApiResponse<AdminDeparture>>(ENDPOINTS.ADMIN.TREKS.DEPARTURES.CREATE(trekId), data)
      .then(r => r.data.data)
  },

  updateDeparture: async (trekId: string, depId: string, data: Partial<CreateDepartureRequest>): Promise<AdminDeparture> => {
    return apiClient
      .put<ApiResponse<AdminDeparture>>(ENDPOINTS.ADMIN.TREKS.DEPARTURES.UPDATE(trekId, depId), data)
      .then(r => r.data.data)
  },

  deleteDeparture: async (trekId: string, depId: string): Promise<void> => {
    return apiClient
      .delete<ApiResponse<void>>(ENDPOINTS.ADMIN.TREKS.DEPARTURES.DELETE(trekId, depId))
      .then(() => undefined)
  },

  changeDepartureStatus: async (trekId: string, depId: string, status: string): Promise<AdminDeparture> => {
    return apiClient
      .patch<ApiResponse<AdminDeparture>>(ENDPOINTS.ADMIN.TREKS.DEPARTURES.STATUS(trekId, depId), { status })
      .then(r => r.data.data)
  },

  duplicateDeparture: async (trekId: string, depId: string): Promise<AdminDeparture> => {
    return apiClient
      .post<ApiResponse<AdminDeparture>>(ENDPOINTS.ADMIN.TREKS.DEPARTURES.DUPLICATE(trekId, depId))
      .then(r => r.data.data)
  },

  // ── Bookings ─────────────────────────────────────────────────────────────

  getBookings: async (params?: AdminFilters): Promise<PageResponse<AdminBookingResponse>> => {
    return apiClient
      .get<ApiResponse<PageResponse<AdminBookingResponse>>>(ENDPOINTS.ADMIN.BOOKINGS.ALL, { params })
      .then(r => r.data.data)
  },

  getBooking: async (id: string): Promise<AdminBookingResponse> => {
    return apiClient
      .get<ApiResponse<AdminBookingResponse>>(ENDPOINTS.ADMIN.BOOKINGS.BY_ID(id))
      .then(r => r.data.data)
  },

  updateBooking: async (id: string, data: UpdateBookingRequest): Promise<AdminBookingResponse> => {
    return apiClient
      .patch<ApiResponse<AdminBookingResponse>>(ENDPOINTS.ADMIN.BOOKINGS.UPDATE(id), data)
      .then(r => r.data.data)
  },
}

export default adminService
