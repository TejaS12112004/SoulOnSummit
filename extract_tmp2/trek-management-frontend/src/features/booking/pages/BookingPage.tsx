/**
 * BookingPage — Sprint 5.3
 *
 * Collects traveller details and submits a booking creation request.
 *
 * Preconditions:
 *   - Accessed via /bookings/new
 *   - Router state must contain { departureId: string, trekId: string }
 *   - If state is missing, redirects to /treks
 *
 * Architecture:
 *   - Owns the RHF form with zodResolver
 *   - Passes FormProvider to children (no prop drilling)
 *   - No business logic in child components
 *   - Seat conflict (409) surfaces as a field error, not a toast
 *   - useBlocker + useBeforeUnload prevent accidental data loss
 */
import { useCallback, useMemo, useState } from 'react'
import {
  useNavigate,
  useLocation,
  Navigate,
  useBeforeUnload,
  useBlocker,
} from 'react-router-dom'
import { useForm, FormProvider, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { ROUTES, toBookingSummary, toTrekDetail } from '@/constants/routes'
import { queryKeys } from '@/api/queryKeys'
import { useCreateBooking } from '../hooks/useCreateBooking'
import { useBookingDraft } from '../hooks/useBookingDraft'
import { createBookingSchema } from '../schemas/bookingSchema'
import type { BookingFormValues } from '../schemas/bookingSchema'
import { BookingHeader } from '../components/BookingHeader'
import { BookingPageSkeleton } from '../components/BookingPageSkeleton'
import { TravellerDetailsForm } from '../components/TravellerDetailsForm'
import { BookingSidebar } from '../components/BookingSidebar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'

// ── Router state type ────────────────────────────────────────────────────────
interface BookingRouterState {
  departureId?: string
  trekId?: string
}

// ── Skeleton is now in BookingPageSkeleton.tsx (layout-accurate)
// ── Unsaved changes modal ─────────────────────────────────────────────────────
interface UnsavedChangesModalProps {
  onStay: () => void
  onLeave: () => void
}

function UnsavedChangesModal({ onStay, onLeave }: UnsavedChangesModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <Card className="p-7 max-w-md w-full shadow-dialog">
        <h2 className="text-xl font-display font-bold text-card-foreground mb-2">Leave this page?</h2>
        <p className="text-muted-foreground text-sm mb-6">
          You have unsaved traveller details. If you leave now, your information will be lost.
        </p>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onLeave}
            className="flex-1"
          >
            Leave anyway
          </Button>
          <Button
            onClick={onStay}
            className="flex-1"
          >
            Stay on page
          </Button>
        </div>
      </Card>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function BookingPage() {
  const location = useLocation()
  const state = location.state as BookingRouterState | null

  const departureId = state?.departureId
  const trekId = state?.trekId

  // Redirect if router state is missing
  if (!departureId || !trekId) {
    return <Navigate to={ROUTES.TREKS} replace />
  }

  return <BookingPageInner departureId={departureId} trekId={trekId} />
}

// Split into inner component so hooks always run after the guard
function BookingPageInner({ departureId, trekId }: { departureId: string; trekId: string }) {
  const navigate = useNavigate()
  const { trek, departure, isLoading, isError, error, isReady } = useBookingDraft(trekId, departureId)
  const createBooking = useCreateBooking()
  const queryClient = useQueryClient()

  // ── Seat conflict error state ────────────────────────────────────────────
  const [seatConflictError, setSeatConflictError] = useState<string | null>(null)

  // ── Zod schema — re-created if availableSeats changes ────────────────────
  const schema = useMemo(
    () => createBookingSchema(departure?.availableSeats ?? 1),
    [departure?.availableSeats]
  )

  // ── Form ─────────────────────────────────────────────────────────────────
  const draftTravellers = queryClient.getQueryData<BookingFormValues['travellers']>(['bookingFormDraft', departureId])
  
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(schema) as Resolver<BookingFormValues>,
    defaultValues: {
      travellers: draftTravellers || [
        {
          fullName: '',
          age: 0,
          gender: '' as 'MALE',
          phone: '',
          email: '',
          emergencyContactName: '',
          emergencyContactPhone: '',
          medicalConditions: '',
          previousTrekExperience: '',
        },
      ],
      specialRequests: '',
      // false at runtime — Zod z.literal(true) rejects it on submit, forcing acceptance
      termsAccepted: false as unknown as true,
    },
    mode: 'onBlur',
  })

  const { watch, formState } = form
  const travellerCount = watch('travellers')?.length ?? 1

  // ── Unsaved changes — browser unload ────────────────────────────────────
  useBeforeUnload(
    useCallback(
      (e: BeforeUnloadEvent) => {
        if (formState.isDirty && !createBooking.isSuccess) {
          e.preventDefault()
        }
      },
      [formState.isDirty, createBooking.isSuccess]
    )
  )

  // ── Unsaved changes — in-app navigation ─────────────────────────────────
  const blocker = useBlocker(
    useCallback(
      ({ currentLocation, nextLocation }: { currentLocation: { pathname: string }; nextLocation: { pathname: string } }) =>
        formState.isDirty &&
        !createBooking.isSuccess &&
        currentLocation.pathname !== nextLocation.pathname,
      [formState.isDirty, createBooking.isSuccess]
    )
  )

  // ── Submit handler ───────────────────────────────────────────────────────
  const onSubmit = async (values: BookingFormValues) => {
    setSeatConflictError(null)

    try {
      const result = await createBooking.mutateAsync({
        departureId,
        participants: values.travellers.map((t) => ({
          fullName: t.fullName,
          age: t.age,
          gender: t.gender,
          phone: t.phone || undefined,
          email: t.email || undefined,
          emergencyContactName: t.emergencyContactName,
          emergencyContactPhone: t.emergencyContactPhone,
          medicalConditions: t.medicalConditions || undefined,
          previousTrekExperience: t.previousTrekExperience || undefined,
        })),
        specialRequests: values.specialRequests || undefined,
      })

      navigate(toBookingSummary(result.bookingId), { replace: true })
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>
      const status = axiosErr.response?.status
      const message = axiosErr.response?.data?.message ?? 'Something went wrong. Please try again.'

      if (status === 409) {
        // Seat availability changed — force re-fetch of trek detail so
        // departure.availableSeats and the counter cap update immediately.
        void queryClient.invalidateQueries({
          queryKey: queryKeys.treks.byId(trekId),
        })
        setSeatConflictError(
          'These seats are no longer available. The page has been refreshed with the latest availability — please reduce the traveller count.'
        )
        form.setError('travellers', { message: 'Seat availability has changed' })
      } else {
        setSeatConflictError(message)
      }
    }
  }

  // ── Loading / error states ───────────────────────────────────────────────
  if (isLoading) return <BookingPageSkeleton />

  if (isError || !isReady || !trek || !departure) {
    let friendlyMessage = 'The selected departure is no longer available.'
    if (isError && error) {
      const axiosErr = error as AxiosError<{ message: string }>
      const status = axiosErr.response?.status
      if (status === 404 || status === 410 || status === 422) {
        friendlyMessage = 'This departure is no longer available for booking. It may have been cancelled or registration has closed.'
      }
    } else if (trek && !departure) {
      friendlyMessage = 'We couldn\'t find the departure you selected. It may have been removed.'
    }

    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-display font-bold text-foreground mb-3">
            Departure Unavailable
          </h2>
          <p className="text-muted-foreground text-sm mb-5">
            {friendlyMessage}
          </p>
          <Button
            onClick={() => navigate(toTrekDetail(trekId))}
          >
            Back to Trek Detail
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Unsaved changes modal */}
      {blocker.state === 'blocked' && (
        <UnsavedChangesModal
          onStay={() => blocker.reset?.()}
          onLeave={() => blocker.proceed?.()}
        />
      )}

      <div className="min-h-screen bg-background">
        {/* Header */}
        <BookingHeader trekId={trekId} trekTitle={trek.title} currentStep={0} />

        {/* Content */}
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className="max-w-7xl mx-auto px-6 py-10 lg:py-14 pb-[160px] lg:pb-14"
          >
            <div className="flex flex-col lg:flex-row gap-12">
              {/* ── Left Column — Traveller Forms ── */}
              <div className="flex-1 min-w-0 space-y-8">
                <TravellerDetailsForm availableSeats={departure.availableSeats} />

                {/* Special Requests */}
                <Card className="overflow-hidden shadow-sm">
                  <div className="px-6 py-5">
                    <label
                      htmlFor="specialRequests"
                      className="block text-base font-semibold text-foreground mb-1"
                    >
                      Special Requests{' '}
                      <span className="text-muted-foreground text-sm font-normal">(optional)</span>
                    </label>
                    <p className="text-muted-foreground text-sm">
                      Dietary needs, accessibility requirements, or any other requests.
                    </p>
                  </div>
                  <div className="px-6 pb-6 pt-5 border-t border-border/50">
                    <Textarea
                      id="specialRequests"
                      {...form.register('specialRequests')}
                      rows={3}
                      className="resize-none"
                      placeholder="e.g. Vegetarian meals, wheelchair access required…"
                    />
                  </div>
                </Card>

                {/* Mobile Sidebar */}
                <div className="lg:hidden">
                  <BookingSidebar
                    trek={trek}
                    departure={departure}
                    travellerCount={travellerCount}
                    isSubmitting={createBooking.isPending}
                    seatConflictError={seatConflictError}
                  />
                </div>
              </div>

              {/* ── Right Column — Sticky Sidebar (Desktop) ── */}
              <div className="hidden lg:block lg:w-[380px] shrink-0">
                <BookingSidebar
                  trek={trek}
                  departure={departure}
                  travellerCount={travellerCount}
                  isSubmitting={createBooking.isPending}
                  seatConflictError={seatConflictError}
                />
              </div>
            </div>

            {/* Mobile Sticky Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border/50 pt-4 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-16px_32px_-16px_rgba(0,0,0,0.1)] lg:hidden z-40">
              <div className="flex items-center justify-between max-w-7xl mx-auto">
                <div>
                  <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-wider mb-0.5">
                    {travellerCount} Traveller{travellerCount !== 1 ? 's' : ''}
                  </p>
                  <p className="text-foreground font-bold text-xl font-display leading-none">
                    ₹{((departure.discountPrice ?? departure.price) * travellerCount).toLocaleString('en-IN')}
                  </p>
                </div>
                <Button
                  type="submit"
                  disabled={createBooking.isPending}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 h-12 shadow-md shadow-accent/20 active:scale-[0.98] transition-all"
                >
                  {createBooking.isPending ? 'Creating…' : 'Continue'}
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </>
  )
}
