import { motion, useReducedMotion } from 'framer-motion';
import { NewsletterForm } from './NewsletterForm';
import { NEWSLETTER_SECTION } from '@/constants/home';
import { getFadeInUp, getStaggerContainer } from '@/constants/motion';

export function Newsletter() {
  const shouldReduceMotion = useReducedMotion();
  const staggerContainer = getStaggerContainer(shouldReduceMotion ?? false);
  const fadeInUp = getFadeInUp(shouldReduceMotion ?? false);

  return (
    <section
      style={{
        background: '#163B2A',
        padding: '80px 24px 88px',
        position: 'relative',
        overflow: 'hidden',
      }}
      aria-labelledby="newsletter-title"
    >
      {/* Subtle orb top-right */}
      <div
        style={{
          position: 'absolute',
          top: '-80px',
          right: '-80px',
          width: '320px',
          height: '320px',
          borderRadius: '9999px',
          background: 'rgba(245,158,11,0.04)',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          {/* Email icon in white rounded box */}
          <motion.div
            variants={fadeInUp}
            style={{
              width: '52px',
              height: '52px',
              background: '#FFFFFF',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
              fontSize: '1.4rem',
            }}
            aria-hidden="true"
          >
            📧
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            id="newsletter-title"
            style={{
              fontFamily: 'var(--font-display-custom)',
              fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              fontWeight: 700,
              color: '#F0EBE0',
              lineHeight: 1.15,
              marginBottom: '14px',
              letterSpacing: '-0.01em',
            }}
          >
            {NEWSLETTER_SECTION.title}
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            style={{
              color: 'rgba(240,235,224,0.6)',
              fontSize: '0.97rem',
              lineHeight: 1.75,
              marginBottom: '36px',
              maxWidth: '480px',
              fontFamily: 'var(--font-sans-custom)',
            }}
          >
            {NEWSLETTER_SECTION.description}
          </motion.p>

          <motion.div variants={fadeInUp} style={{ width: '100%' }}>
            <NewsletterForm />
          </motion.div>

          <motion.p
            variants={fadeInUp}
            style={{
              color: 'rgba(240,235,224,0.35)',
              fontSize: '0.75rem',
              marginTop: '14px',
              fontFamily: 'var(--font-sans-custom)',
            }}
          >
            {NEWSLETTER_SECTION.finePrint}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
