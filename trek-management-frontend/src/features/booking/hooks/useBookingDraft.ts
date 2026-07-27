/**
 * useBookingDraft — pure composition hook.
 *
 * Composes existing hooks; it does NOT make any direct API calls itself.
 *
 * Data flow:
 *   BookingPage receives { departureId, trekId } from router state.
 *   This hook calls useTrekDetail(trekId) — an existing hook that owns
 *   its own React Query configuration, caching, and fetching strategy.
 *   The matching departure is found from the trek's embedded departures array.
 *
 * After a 409 seat conflict, BookingPage invalidates queryKeys.treks.byId(trekId)
 * which causes useTrekDetail to re-fetch, automatically updating departure
 * availableSeats without any manual fetch call here.
 *
 * TD-001: trekId in router state is temporary. When backend adds
 *   GET /api/v1/departures/{id}, trekId can be derived from the departure
 *   response and removed from router state entirely.
 */
import { useMemo } from 'react'
import { useTrekDetail } from '@/features/treks/hooks/useTrekDetail'
import type { TrekDetailViewModel, TrekDepartureViewModel } from '@/features/treks/types/trekDetail'

export interface BookingDraftData {
  trek: TrekDetailViewModel
  departure: TrekDepartureViewModel
}

export function useBookingDraft(trekId: string | undefined, departureId: string | undefined) {
  const { data: trek, isLoading, isError, error } = useTrekDetail(trekId, { refetchOnMount: 'always' })

  const departure = useMemo(() => {
    if (!trek || !departureId) return null
    return trek.departures.find((d) => d.id === departureId) ?? null
  }, [trek, departureId])

  return {
    trek: trek ?? null,
    departure,
    isLoading,
    isError,
    error,
    /** True when we have all data needed to render the booking form */
    isReady: !!trek && !!departure,
  }
}
