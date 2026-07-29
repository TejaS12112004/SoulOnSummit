import { motion, useReducedMotion } from 'framer-motion';
import { FeatureCard } from './FeatureCard';
import { WHY_CHOOSE_US_SECTION, WHY_CHOOSE_US_FEATURES } from '@/constants/home';
import { getFadeInUp, getStaggerContainer } from '@/constants/motion';

export function WhyChooseUs() {
  const shouldReduceMotion = useReducedMotion();
  const staggerContainer = getStaggerContainer(shouldReduceMotion ?? false);
  const fadeInUp = getFadeInUp(shouldReduceMotion ?? false);

  return (
    <section
      style={{ background: '#1C1A0E', padding: '88px 24px 96px' }}
      aria-labelledby="why-choose-us-title"
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
            {WHY_CHOOSE_US_SECTION.label}
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            id="why-choose-us-title"
            style={{
              fontFamily: 'var(--font-display-custom)',
              fontSize: 'clamp(2.4rem, 4vw, 3.6rem)',
              fontWeight: 700,
              color: '#F0EBE0',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            {WHY_CHOOSE_US_SECTION.title}
          </motion.h2>
        </motion.div>

        {/* 3-col grid, 2 rows */}
        <motion.div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
          }}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {WHY_CHOOSE_US_FEATURES.map((feature) => (
            <motion.div key={feature.title} variants={fadeInUp}>
              <FeatureCard feature={feature} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
