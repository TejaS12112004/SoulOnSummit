/**
 * BookingSidebar — sticky booking summary and CTA.
 *
 * Shows departure info, price breakdown, GST note, secure indicator,
 * cancellation policy, and terms acceptance.
 *
 * Rules:
 * - No business logic. Purely presentational.
 * - All data flows in as props from BookingPage.
 * - Terms checkbox registration comes via useFormContext.
 */
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { ChevronDown, Loader2, Lock, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { TrekDetailViewModel, TrekDepartureViewModel } from '@/features/treks/types/trekDetail'
import type { BookingFormValues } from '../schemas/bookingSchema'

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

interface BookingSidebarProps {
  trek: TrekDetailViewModel
  departure: TrekDepartureViewModel
  travellerCount: number
  isSubmitting: boolean
  seatConflictError: string | null
}

export function BookingSidebar({
  trek,
  departure,
  travellerCount,
  isSubmitting,
  seatConflictError,
}: BookingSidebarProps) {
  const [policyOpen, setPolicyOpen] = useState(false)

  const {
    register,
    formState: { errors },
  } = useFormContext<BookingFormValues>()

  const pricePerPerson = departure.discountPrice ?? departure.price
  const subtotal = pricePerPerson * travellerCount
  const termsError = errors.termsAccepted?.message

  return (
    <Card className="p-6 space-y-6 sticky top-6 shadow-sm border-border/60">
      {/* Trek Summary */}
      <div>
        <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Trek</p>
        <p className="text-card-foreground font-display font-semibold text-base leading-snug">{trek.title}</p>
        <p className="text-muted-foreground text-xs mt-0.5">
          {trek.durationDays} Days · {trek.difficulty} · {trek.location}
        </p>
      </div>

      <div className="border-t border-border/50" />

      {/* Departure */}
      <div className="space-y-1.5">
        <p className="text-muted-foreground text-xs uppercase tracking-wider">Departure</p>
        <p className="text-foreground text-sm font-medium">
          {formatDate(departure.startDate)} → {formatDate(departure.endDate)}
        </p>
        <p className="text-muted-foreground text-xs">
          Registration closes {formatDate(departure.registrationDeadline)}
        </p>
        {departure.isSoldOut && (
          <p className="text-destructive text-xs font-medium">No seats available</p>
        )}
        {departure.isFillingFast && !departure.isSoldOut && (
          <p className="flex items-center gap-1.5 text-warning text-xs font-medium">
            <Zap className="w-3.5 h-3.5 fill-warning" />
            Only {departure.availableSeats} seats left!
          </p>
        )}
      </div>

      <div className="border-t border-border/50" />

      {/* Price Breakdown */}
      <div className="space-y-4 pt-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            ₹{pricePerPerson.toLocaleString('en-IN')} × {travellerCount} Traveller
            {travellerCount !== 1 ? 's' : ''}
          </span>
          <span className="font-medium text-foreground">₹{subtotal.toLocaleString('en-IN')}</span>
        </div>

        {departure.discountPrice && (
          <div className="flex justify-between text-sm">
            <span className="text-success">Discount applied</span>
            <span className="text-success">
              −₹
              {((departure.price - departure.discountPrice) * travellerCount).toLocaleString(
                'en-IN'
              )}
            </span>
          </div>
        )}

        {/* GST Note */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Taxes & Fees</span>
          <span className="text-muted-foreground">Calculated next</span>
        </div>
      </div>

      {/* Grand Total */}
      <div className="border-t border-border/40 mt-10 pt-8">
        <div className="flex justify-between items-baseline">
          <span className="text-foreground font-semibold text-lg tracking-tight">Grand Total</span>
          <span className="text-accent font-bold text-3xl font-display tracking-tight">
            ₹{subtotal.toLocaleString('en-IN')}
          </span>
        </div>
        <p className="text-right text-xs text-muted-foreground mt-1.5">Includes all taxes</p>
      </div>

      {/* Secure Checkout Badge */}
      <div className="flex items-center justify-center gap-2 py-2 px-3 bg-muted rounded-xl border border-border">
        <Lock className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-muted-foreground text-xs">Secure checkout — SSL encrypted</span>
      </div>

      {/* Cancellation Policy */}
      {trek.cancellationPolicy && (
        <div className="border-t border-border/40 pt-5">
          <button
            type="button"
            onClick={() => setPolicyOpen(!policyOpen)}
            className="flex items-center justify-between w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm group"
          >
            <span className="text-foreground text-sm font-medium">Cancellation Policy</span>
            <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform duration-[280ms] ease-out", policyOpen ? "rotate-180" : "")} />
          </button>
          <AnimatePresence initial={false}>
            {policyOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="overflow-hidden"
              >
                <div className="mt-3 text-muted-foreground text-sm leading-relaxed max-h-32 overflow-y-auto pr-2">
                  {trek.cancellationPolicy.split('\n').map((line, i) =>
                    line.trim() ? <p key={i} className="mb-2">{line.trim()}</p> : null
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Seat Conflict Error */}
      {seatConflictError && (
        <div className="bg-destructive/15 border border-destructive/30 rounded-xl px-4 py-3">
          <p className="text-destructive-foreground text-sm font-medium">{seatConflictError}</p>
        </div>
      )}

      {/* Terms Acceptance */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer group focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 rounded-sm">
          <input
            type="checkbox"
            {...register('termsAccepted')}
            id="termsAccepted"
            aria-required="true"
            aria-invalid={!!termsError}
            aria-describedby={termsError ? 'err-terms' : undefined}
            className="mt-0.5 w-4 h-4 rounded-sm border border-border bg-input accent-accent cursor-pointer shrink-0 focus-visible:outline-none"
          />
          <span className="text-muted-foreground text-xs leading-[1.8] group-hover:text-foreground transition-colors">
            I agree to the{' '}
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              terms & conditions
            </a>{' '}
            and confirm that all traveller details are accurate.
          </span>
        </label>
        {termsError && (
          <p id="err-terms" role="alert" className="text-destructive text-xs mt-1.5 ml-7">
            {termsError}
          </p>
        )}
      </div>

      {/* CTA */}
      <Button
        type="submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-lg shadow-accent/20 h-12 text-base transition-all active:scale-[0.98]"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Creating Booking…
          </>
        ) : (
          'Continue'
        )}
      </Button>
    </Card>
  )
}
