import { Link } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { toTrekDetail } from '@/constants/routes'

interface BookingHeaderProps {
  trekId: string
  trekTitle: string
  /** 0-indexed active step: 0 = Traveller Details, 1 = Summary, 2 = Payment */
  currentStep?: number
}

const STEPS = [
  { label: 'Traveller Details', href: null },
  { label: 'Summary', href: null },
  { label: 'Payment', href: null },
] as const

export function BookingHeader({ trekId, trekTitle, currentStep = 0 }: BookingHeaderProps) {
  return (
    <div className="bg-white shadow-sm border-b border-white/10 px-6 py-5">
      <div className="max-w-7xl mx-auto">
        {/* Back link */}
        <Link
          to={toTrekDetail(trekId)}
          className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {trekTitle}
        </Link>

        {/* Title */}
        <h1 className="text-2xl font-display font-bold text-white mb-5">Book Your Trek</h1>

        {/* Progress steps */}
        <nav aria-label="Booking progress" className="flex items-center gap-3">
          {STEPS.map((step, i) => {
            const isCompleted = i < currentStep
            const isActive = i === currentStep
            const isFuture = i > currentStep

            // Completed steps can be navigated to; future steps are inert
            const stepLabel = isCompleted
              ? `${step.label} (completed)`
              : isActive
                ? `${step.label} (current step)`
                : `${step.label} (not yet available)`

            return (
              <div key={step.label} className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {/* Step circle */}
                  <div
                    role="status"
                    aria-label={stepLabel}
                    aria-current={isActive ? 'step' : undefined}
                    className={[
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors',
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isActive
                          ? 'bg-accent text-white'
                          : 'bg-white/8 text-white/25',
                    ].join(' ')}
                  >
                    {isCompleted ? (
                      <Check className="w-3 h-3" strokeWidth={3} />
                    ) : (
                      <span>{i + 1}</span>
                    )}
                  </div>

                  {/* Step label */}
                  <span
                    className={[
                      'text-sm font-medium hidden sm:block',
                      isCompleted ? 'text-green-400' : isActive ? 'text-white' : 'text-white/25',
                    ].join(' ')}
                    aria-hidden={isFuture}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div
                    className={[
                      'w-8 h-px hidden sm:block transition-colors',
                      isCompleted ? 'bg-green-500/40' : 'bg-white/8',
                    ].join(' ')}
                  />
                )}
              </div>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
