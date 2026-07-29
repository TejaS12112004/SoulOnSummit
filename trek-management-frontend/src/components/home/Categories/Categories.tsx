import { motion, useReducedMotion } from 'framer-motion';
import { CategoryCard } from './CategoryCard';
import { CATEGORIES_SECTION, CATEGORIES } from '@/constants/home';
import { getFadeInUp, getStaggerContainer } from '@/constants/motion';

export function Categories() {
  const shouldReduceMotion = useReducedMotion();
  const staggerContainer = getStaggerContainer(shouldReduceMotion ?? false);
  const fadeInUp = getFadeInUp(shouldReduceMotion ?? false);

  return (
    <section
      style={{ background: '#111110', padding: '88px 24px 96px' }}
      aria-labelledby="categories-title"
    >
      <div className="container mx-auto">

        {/* Header */}
        <motion.div
          style={{ textAlign: 'center', marginBottom: '52px' }}
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
            {CATEGORIES_SECTION.label}
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            id="categories-title"
            style={{
              fontFamily: 'var(--font-display-custom)',
              fontSize: 'clamp(2.4rem, 4vw, 3.6rem)',
              fontWeight: 700,
              color: '#F0EBE0',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            {CATEGORIES_SECTION.title}
          </motion.h2>
        </motion.div>

        {/* 5-column landscape grid */}
        <motion.div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '16px',
          }}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {CATEGORIES.map((cat) => (
            <motion.div key={cat.href} variants={fadeInUp}>
              <CategoryCard category={cat} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
