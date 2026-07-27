import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { TrekFaqViewModel } from '../types/trekDetail'

interface TrekFAQProps {
  faqs: TrekFaqViewModel[]
}

export function TrekFAQ({ faqs }: TrekFAQProps) {
  const [openId, setOpenId] = useState<string | null>(null)

  if (faqs.length === 0) return null

  return (
    <section>
      <h2 className="text-2xl font-display font-bold text-white mb-4">
        Frequently Asked Questions
      </h2>
      <div className="space-y-3">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id
          return (
            <div
              key={faq.id}
              className="bg-white shadow-sm rounded-xl border border-white/10 overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left"
                onClick={() => setOpenId(isOpen ? null : faq.id)}
              >
                <span className="text-white font-medium text-sm pr-4">{faq.question}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-white/40 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-white/40 shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="px-5 pb-4 border-t border-white/10">
                  <p className="text-white/60 text-sm leading-relaxed mt-3">{faq.answer}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
