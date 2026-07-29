import { motion, useReducedMotion } from 'framer-motion';
import { DepartureCard } from './DepartureCard';
import { UPCOMING_DEPARTURES_SECTION, UPCOMING_DEPARTURES } from '@/constants/home';
import { getFadeInUp, getStaggerContainer } from '@/constants/motion';

export function UpcomingDepartures() {
  const shouldReduceMotion = useReducedMotion();
  const staggerContainer = getStaggerContainer(shouldReduceMotion ?? false);
  const fadeInUp = getFadeInUp(shouldReduceMotion ?? false);

  return (
    <section
      style={{ background: '#163629', padding: '88px 24px 96px' }}
      aria-labelledby="upcoming-departures-title"
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

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
            {UPCOMING_DEPARTURES_SECTION.label}
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            id="upcoming-departures-title"
            style={{
              fontFamily: 'var(--font-display-custom)',
              fontSize: 'clamp(2.4rem, 4vw, 3.6rem)',
              fontWeight: 700,
              color: '#F0EBE0',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            {UPCOMING_DEPARTURES_SECTION.title}
          </motion.h2>
        </motion.div>

        {/* Rows */}
        <motion.div
          style={{ display: 'flex', flexDirection: 'column', gap: '0' }}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {UPCOMING_DEPARTURES.map((dep, i) => (
            <motion.div key={dep.departureId} variants={fadeInUp}>
              <DepartureCard departure={dep} isLast={i === UPCOMING_DEPARTURES.length - 1} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
