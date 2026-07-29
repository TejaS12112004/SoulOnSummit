import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FeaturedTrekCard } from './FeaturedTrekCard';
import { FEATURED_TREKS_SECTION, FEATURED_TREKS } from '@/constants/home';
import { getStaggerContainer, getFadeInUp } from '@/constants/motion';
import { motion, useReducedMotion } from 'framer-motion';

const SECTION_BG = '#1A1A0F';

export function FeaturedTreks() {
  const shouldReduceMotion = useReducedMotion();
  const staggerContainer = getStaggerContainer(shouldReduceMotion ?? false);
  const fadeInUp = getFadeInUp(shouldReduceMotion ?? false);

  return (
    <section
      style={{ background: SECTION_BG, padding: '88px 24px 0' }}
      aria-labelledby="featured-treks-title"
    >
      <div className="container mx-auto">

        {/* Section header — fully centered */}
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
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-sans-custom)',
              marginBottom: '16px',
            }}
          >
            {FEATURED_TREKS_SECTION.label}
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            id="featured-treks-title"
            style={{
              fontFamily: 'var(--font-display-custom)',
              fontSize: 'clamp(2.6rem, 5vw, 4rem)',
              fontWeight: 800,
              color: '#F0EBE0',
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
              marginBottom: '20px',
            }}
          >
            {FEATURED_TREKS_SECTION.title}
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            style={{
              color: 'rgba(240,235,224,0.5)',
              fontSize: '1.05rem',
              maxWidth: '500px',
              margin: '0 auto',
              lineHeight: 1.7,
              fontFamily: 'var(--font-sans-custom)',
            }}
          >
            {FEATURED_TREKS_SECTION.description}
          </motion.p>
        </motion.div>

        {/* Cards grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px',
          }}
        >
          {FEATURED_TREKS.map((trek) => (
            <FeaturedTrekCard key={trek.id} trek={trek} />
          ))}
        </div>

        {/* Gap + View All button */}
        <div style={{ textAlign: 'center', padding: '56px 0 88px' }}>
          <Button
            asChild
            style={{
              background: '#1F4D3A',
              color: '#F0EBE0',
              borderRadius: '9999px',
              height: '52px',
              paddingLeft: '44px',
              paddingRight: '44px',
              fontSize: '1rem',
              fontWeight: 600,
              fontFamily: 'var(--font-sans-custom)',
              border: 'none',
            }}
          >
            <Link to={FEATURED_TREKS_SECTION.viewAllLink}>
              {FEATURED_TREKS_SECTION.viewAllText}
            </Link>
          </Button>
        </div>

      </div>
    </section>
  );
}
