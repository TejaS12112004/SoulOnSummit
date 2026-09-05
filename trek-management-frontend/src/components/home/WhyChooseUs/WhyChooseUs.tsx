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
      className="bg-background"
      style={{ padding: 'clamp(48px, 8vw, 96px) clamp(16px, 4vw, 24px)' }}
      aria-labelledby="why-choose-us-title"
    >
      <div className="max-w-[1100px] mx-auto">

        {/* Header */}
        <motion.div
          className="text-center mb-10 md:mb-14"
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
              fontSize: 'clamp(1.8rem, 5vw, 3.6rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
            className="text-foreground"
          >
            {WHY_CHOOSE_US_SECTION.title}
          </motion.h2>
        </motion.div>

        {/* Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
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
