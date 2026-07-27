import { useState } from 'react'
import { ChevronDown, ChevronUp, FileText, ShieldAlert, HeartPulse, Info } from 'lucide-react'
import type { BookingDetailViewModel } from '../types/booking'

interface PolicySectionProps {
  title: string
  content?: string | null
  icon: React.ElementType
}

function PolicySection({ title, content, icon: Icon }: PolicySectionProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!content) return null

  return (
    <div className="border-t border-white/10 pt-4 first:border-0 first:pt-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left py-2"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-white/40" />
          <span className="text-white/80 text-sm font-medium">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-white/40" />
        ) : (
          <ChevronDown className="w-4 h-4 text-white/40" />
        )}
      </button>
      {isOpen && (
        <div className="mt-3 text-white/50 text-sm leading-relaxed pl-6 max-h-48 overflow-y-auto pr-2">
          {content.split('\n').map((line, i) =>
            line.trim() ? (
              <p key={i} className="mb-2 last:mb-0">
                {line.trim()}
              </p>
            ) : null
          )}
        </div>
      )}
    </div>
  )
}

interface BookingPoliciesProps {
  booking: BookingDetailViewModel
}

export function BookingPolicies(_props: BookingPoliciesProps) {
  // As per Sprint 5.4 requirements, we conditionally render these sections.
  // In the future, these can be mapped from the backend if available in the BookingReviewResponse.
  
  const hasAnyPolicy = false // Currently none are mapped in BookingDetailViewModel TD-002

  if (!hasAnyPolicy) return null

  return (
    <div className="bg-white shadow-sm rounded-2xl border border-white/10 p-6 mb-6">
      <h2 className="text-xl font-display font-bold text-white mb-6">Policies & Guidelines</h2>
      <div className="space-y-2">
        <PolicySection 
          title="Cancellation Policy" 
          content={undefined} // Map from booking when available
          icon={FileText} 
        />
        <PolicySection 
          title="Refund Notes" 
          content={undefined}
          icon={Info} 
        />
        <PolicySection 
          title="Medical Disclaimer" 
          content={undefined}
          icon={HeartPulse} 
        />
        <PolicySection 
          title="Safety Guidelines" 
          content={undefined}
          icon={ShieldAlert} 
        />
      </div>
    </div>
  )
}
