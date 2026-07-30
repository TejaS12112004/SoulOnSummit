import { Star } from 'lucide-react';
import type { Testimonial } from '@/types/testimonial';

interface TestimonialCardProps {
  testimonial: Testimonial;
  isActive: boolean;
}

export function TestimonialCard({ testimonial, isActive }: TestimonialCardProps) {
  // Reference: middle (active) = dark forest green, others = light bg-card
  const bg = isActive ? '#1F4D3A' : 'hsl(var(--card))';
  const borderColor = isActive ? 'rgba(46,102,80,0.6)' : 'hsl(var(--border))';

  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${borderColor}`,
        borderRadius: '16px',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'transform 0.2s ease',
      }}
    >
      {/* Stars */}
      <div
        style={{ display: 'flex', gap: '3px', marginBottom: '18px' }}
        aria-label={`${testimonial.rating} out of 5 stars`}
      >
        {Array.from({ length: testimonial.rating }).map((_, idx) => (
          <Star
            key={idx}
            style={{ width: '16px', height: '16px', fill: '#F59E0B', color: '#F59E0B' }}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Quote */}
      <p
        style={{
          fontSize: '0.9rem',
          lineHeight: 1.75,
          fontStyle: 'italic',
          color: isActive ? 'rgba(240,235,224,0.88)' : 'hsl(var(--muted-foreground))',
          fontFamily: 'var(--font-sans-custom)',
          flexGrow: 1,
          marginBottom: '22px',
        }}
      >
        &ldquo;{testimonial.text}&rdquo;
      </p>

      {/* Avatar + name + location */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          loading="lazy"
          decoding="async"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '9999px',
            objectFit: 'cover',
            border: '2px solid rgba(245,158,11,0.5)',
            flexShrink: 0,
          }}
        />
        <div>
          <div style={{
            fontWeight: 700,
            fontSize: '0.9rem',
            color: isActive ? '#F0EBE0' : 'hsl(var(--foreground))',
            fontFamily: 'var(--font-sans-custom)',
            marginBottom: '2px',
          }}>
            {testimonial.name}
          </div>
          <div style={{
            fontSize: '0.78rem',
            color: isActive ? 'rgba(240,235,224,0.55)' : 'hsl(var(--muted-foreground))',
            fontFamily: 'var(--font-sans-custom)',
          }}>
            {testimonial.location} · {testimonial.date}
          </div>
        </div>
      </div>

      {/* Divider + trek */}
      <div style={{
        borderTop: `1px solid ${isActive ? 'rgba(240,235,224,0.15)' : 'hsl(var(--border))'}`,
        paddingTop: '14px',
        fontSize: '0.75rem',
        color: isActive ? 'rgba(240,235,224,0.5)' : 'hsl(var(--muted-foreground))',
        fontFamily: 'var(--font-sans-custom)',
      }}>
        Trekked: {testimonial.trek}
      </div>
    </div>
  );
}
