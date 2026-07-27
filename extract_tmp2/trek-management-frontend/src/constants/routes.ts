export const ROUTES = {
  // Public
  HOME: '/',
  TREKS: '/treks',
  TREK_DETAIL: '/treks/:id',

  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',

  // User (authenticated)
  PROFILE: '/profile',
  BOOKINGS: '/bookings',
  BOOKING_NEW: '/bookings/new',
  BOOKING_SUMMARY: '/bookings/:id/summary',

  // Admin
  ADMIN: '/admin',
  ADMIN_TREKS: '/admin/treks',
  ADMIN_TREK_DETAIL: '/admin/treks/:id',
  ADMIN_DEPARTURES: '/admin/departures',
  ADMIN_BOOKINGS: '/admin/bookings',
  ADMIN_BOOKING_DETAIL: '/admin/bookings/:id',
} as const

// Helpers for dynamic segments
export const toTrekDetail = (id: string) => `/treks/${id}`
export const toBookingNew = () => ROUTES.BOOKING_NEW
export const toBookingSummary = (id: string) => ROUTES.BOOKING_SUMMARY.replace(':id', id)
export const toAdminTrekDetail = (id: string) => `/admin/treks/${id}`
export const toAdminBookingDetail = (id: string) => `/admin/bookings/${id}`
