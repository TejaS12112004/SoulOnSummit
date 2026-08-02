import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { TestimonialCard } from './TestimonialCard';
import { TESTIMONIALS_SECTION, TESTIMONIALS } from '@/constants/home';
import { getFadeInUp, getStaggerContainer } from '@/constants/motion';

// Show 3 per page
const PER_PAGE = 3;

export function Testimonials() {
  const [page, setPage] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const staggerContainer = getStaggerContainer(shouldReduceMotion ?? false);
  const fadeInUp = getFadeInUp(shouldReduceMotion ?? false);

  const totalPages = Math.ceil(TESTIMONIALS.length / PER_PAGE);
  const visible = TESTIMONIALS.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <section
      className="bg-muted"
      style={{ padding: '96px 24px' }}
      aria-labelledby="testimonials-title"
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          style={{ textAlign: 'center', marginBottom: '56px' }}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div
            variants={fadeInUp}
            style={{
              color: '#F59E0B',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-sans-custom)',
              marginBottom: '14px',
            }}
          >
            {TESTIMONIALS_SECTION.label}
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            id="testimonials-title"
            style={{
              fontFamily: 'var(--font-display-custom)',
              fontSize: 'clamp(2.4rem, 4vw, 3.6rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
            className="text-foreground"
          >
            {TESTIMONIALS_SECTION.title}
          </motion.h2>
        </motion.div>

        {/* 3-col grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginBottom: '40px',
          }}
        >
          {visible.map((testimonial, i) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              isActive={i === 1} // middle card highlighted
            />
          ))}
        </div>

        {/* Dot pagination */}
        {totalPages > 1 && (
          <div
            style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}
            role="tablist"
            aria-label="Testimonial pages"
          >
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === page}
                aria-label={`Page ${i + 1}`}
                onClick={() => setPage(i)}
                style={{
                  height: '8px',
                  width: i === page ? '28px' : '8px',
                  borderRadius: '9999px',
                  background: i === page ? '#1F4D3A' : 'hsl(var(--border))',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  padding: 0,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
