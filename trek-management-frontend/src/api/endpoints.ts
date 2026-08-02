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

  USERS: {
    ME:             '/users/me',
    PASSWORD:       '/users/me/password',
  },

  HOME: {
    FEATURED_TREKS:       '/treks/featured',
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
    UPCOMING:        '/treks/upcoming-departures',
    UPCOMING_PUBLIC: '/treks/departures/upcoming',
    BY_TREK:         (trekId: string) => `/treks/${trekId}/departures`,
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

  PAYMENTS: {
    VERIFY: '/payments/verify',
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

  ADMIN: {
    DASHBOARD: {
      METRICS: '/admin/dashboard',
      CHARTS: '/admin/dashboard/charts',
    },
    TREKS: {
      ALL: '/admin/treks',
      BY_ID: (id: string) => `/admin/treks/${id}`,
      CREATE: '/admin/treks',
      UPDATE: (id: string) => `/admin/treks/${id}`,
      DELETE: (id: string) => `/admin/treks/${id}`,
      PUBLISH: (id: string) => `/admin/treks/${id}/publish`,
      UNPUBLISH: (id: string) => `/admin/treks/${id}/unpublish`,
      FEATURE: (id: string) => `/admin/treks/${id}/feature`,
      DEPARTURES: {
        ALL: (trekId: string) => `/admin/treks/${trekId}/departures`,
        BY_ID: (trekId: string, depId: string) => `/admin/treks/${trekId}/departures/${depId}`,
        CREATE: (trekId: string) => `/admin/treks/${trekId}/departures`,
        UPDATE: (trekId: string, depId: string) => `/admin/treks/${trekId}/departures/${depId}`,
        DELETE: (trekId: string, depId: string) => `/admin/treks/${trekId}/departures/${depId}`,
        STATUS: (trekId: string, depId: string) => `/admin/treks/${trekId}/departures/${depId}/status`,
        DUPLICATE: (trekId: string, depId: string) => `/admin/treks/${trekId}/departures/${depId}/duplicate`,
      }
    },
    BOOKINGS: {
      ALL: '/admin/bookings',
      BY_ID: (id: string) => `/admin/bookings/${id}`,
      UPDATE: (id: string) => `/admin/bookings/${id}`,
    }
  }
} as const
