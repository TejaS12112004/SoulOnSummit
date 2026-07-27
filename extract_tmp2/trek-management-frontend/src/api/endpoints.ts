/**
 * Central registry of all API endpoint paths.
 *
 * Rules:
 * - Every service must import from here — no hardcoded strings in service files.
 * - Dynamic segments use a function pattern: (id: string) => `/path/${id}`.
 * - Group by resource domain to match the backend controller structure.
 */

export const ENDPOINTS = {
  AUTH: {
    REGISTER:             '/auth/register',
    LOGIN:                '/auth/login',
    LOGOUT:               '/auth/logout',
    REFRESH:              '/auth/refresh',
    VERIFY_EMAIL:         '/auth/verify',
    RESEND_VERIFICATION:  '/auth/resend-verification',
    FORGOT_PASSWORD:      '/auth/forgot-password',
    RESET_PASSWORD:       '/auth/reset-password',
    PROFILE:              '/auth/profile',
  },

  HOME: {
    FEATURED_TREKS:       '/home/featured-treks',
    UPCOMING_DEPARTURES:  '/home/upcoming-departures',
  },

  TREKS: {
    LIST_PUBLIC:          '/treks',
    ALL:        '/treks',
    FEATURED:   '/treks/featured',
    SEARCH:     '/treks/search',
    BY_ID:      (id: string) => `/treks/${id}`,
    REVIEWS:    (id: string) => `/treks/${id}/reviews`,
  },

  DEPARTURES: {
    UPCOMING:   '/treks/upcoming-departures',
    BY_TREK:    (trekId: string) => `/treks/${trekId}/departures`,
  },

  CATEGORIES: {
    ALL:        '/categories',
    BY_SLUG:    (slug: string) => `/categories/${slug}`,
  },

  BOOKINGS: {
    CREATE:      '/bookings',
    MY_BOOKINGS: '/bookings',
    BY_ID:       (id: string) => `/bookings/${id}`,
    CANCEL:      (id: string) => `/bookings/${id}/cancel`,
  },

  GALLERY: {
    ALL:        '/gallery',
  },

  NEWSLETTER: {
    SUBSCRIBE:  '/newsletter/subscribe',
    UNSUBSCRIBE:'/newsletter/unsubscribe',
  },

  REVIEWS: {
    CREATE:     '/reviews',
    BY_TREK:    (trekId: string) => `/treks/${trekId}/reviews`,
  },
} as const
