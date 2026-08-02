import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { FaqResponseDto } from '@/types/api'

interface TrekFAQProps {
  faqs: FaqResponseDto[]
}

const cardClassName = "bg-card border border-border shadow-sm rounded-2xl p-7 md:p-8"

function FaqItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FaqResponseDto
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className={isOpen ? "bg-muted" : "bg-card"}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '14px 18px',
          border: 'none', cursor: 'pointer', textAlign: 'left', gap: '12px',
        }}
      >
        <span className="text-foreground" style={{ fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.5, fontFamily: 'inherit' }}>
          {item.question}
        </span>
        <ChevronDown
          className="text-muted-foreground"
          style={{
            width: 16, height: 16, flexShrink: 0,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        />
      </button>
      {isOpen && (
        <div className="text-muted-foreground bg-muted" style={{ padding: '0 18px 14px', fontSize: '0.88rem', lineHeight: 1.7, fontFamily: 'inherit' }}>
          {item.answer}
        </div>
      )}
    </div>
  )
}

export function TrekFAQ({ faqs }: TrekFAQProps) {
  const [openId, setOpenId] = useState<string | null>(faqs?.[0]?.id ?? null)

  return (
    <section className={cardClassName}>
      <h2 className="text-foreground" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px', fontFamily: 'inherit' }}>
        <span style={{ color: '#EF4444', fontWeight: 900 }}>?</span>
        Frequently Asked Questions
      </h2>

      {faqs && faqs.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {faqs.map((faq) => (
            <FaqItem
              key={faq.id}
              item={faq}
              isOpen={openId === faq.id}
              onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '28px 0', gap: '10px' }}>
          <span style={{ fontSize: '2rem' }}>❓</span>
          <p style={{ fontSize: '0.88rem', fontFamily: 'inherit', margin: 0 }}>FAQs coming soon</p>
        </div>
      )}
    </section>
  )
}
