/**
 * Central registry of all React Query cache keys.
 *
 * Rules:
 * - All useQuery / useInfiniteQuery calls must import keys from here.
 * - Keys are structured as arrays so React Query can match on prefix:
 *   e.g. invalidating treks.all() also invalidates treks.featured().
 * - Factory functions accept params so filtered/paginated queries get
 *   unique keys without manual string concatenation.
 */

import type { TrekFilterParams } from '@/types/api'

export const queryKeys = {
  // ── Auth ──────────────────────────────────────────────────────────
  auth: {
    all:     () => ['auth'] as const,
    profile: () => ['auth', 'profile'] as const,
  },

  // ── Home ──────────────────────────────────────────────────────────
  home: {
    all:                () => ['home'] as const,
    featuredTreks:      () => ['home', 'featured-treks'] as const,
    upcomingDepartures: () => ['home', 'upcoming-departures'] as const,
  },

  // ── Treks ─────────────────────────────────────────────────────────
  treks: {
    all:      ['treks', 'all'] as const,
    list:     (filters: TrekFilterParams) => ['treks', 'list', filters] as const,
    featured: ['treks', 'featured'] as const,
    search:   (query: string) => ['treks', 'search', { query }] as const,
    byId:     (id: string) => ['treks', 'detail', id] as const,
    reviews:  (id: string)    => ['treks', id, 'reviews'] as const,
  },

  // ── Departures ────────────────────────────────────────────────────
  departures: {
    all:      () => ['departures'] as const,
    upcoming: () => ['departures', 'upcoming'] as const,
    byTrek:   (trekId: string) => ['departures', 'trek', trekId] as const,
  },

  // ── Categories ────────────────────────────────────────────────────
  categories: {
    all:    () => ['categories'] as const,
    bySlug: (slug: string) => ['categories', slug] as const,
  },

  // ── Bookings ──────────────────────────────────────────────────────
  bookings: {
    all:  () => ['bookings'] as const,
    user: () => ['bookings', 'user'] as const,
    byId: (id: string) => ['bookings', id] as const,
  },

  // ── Gallery ───────────────────────────────────────────────────────
  gallery: {
    all: () => ['gallery'] as const,
  },
} as const
