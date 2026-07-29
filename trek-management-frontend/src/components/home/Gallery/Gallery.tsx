import { motion, useReducedMotion } from 'framer-motion';
import { GalleryImage } from './GalleryImage';
import { GALLERY_SECTION, GALLERY_IMAGES } from '@/constants/home';
import { getFadeInUp, getStaggerContainer } from '@/constants/motion';

export function Gallery() {
  const shouldReduceMotion = useReducedMotion();
  const staggerContainer = getStaggerContainer(shouldReduceMotion ?? false);
  const fadeInUp = getFadeInUp(shouldReduceMotion ?? false);

  return (
    <section
      style={{ background: '#0F0F0E', padding: '88px 24px 96px' }}
      aria-labelledby="gallery-title"
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          style={{ textAlign: 'center', marginBottom: '48px' }}
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
            {GALLERY_SECTION.label}
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            id="gallery-title"
            style={{
              fontFamily: 'var(--font-display-custom)',
              fontSize: 'clamp(2.4rem, 4vw, 3.6rem)',
              fontWeight: 700,
              color: '#F0EBE0',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: '12px',
            }}
          >
            {GALLERY_SECTION.title}
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            style={{
              color: 'rgba(240,235,224,0.45)',
              fontSize: '0.95rem',
              fontFamily: 'var(--font-sans-custom)',
            }}
          >
            {GALLERY_SECTION.description}
          </motion.p>
        </motion.div>

        {/* 6-image single-row horizontal grid */}
        <motion.div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '12px',
          }}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {GALLERY_IMAGES.map((img) => (
            <motion.div key={img.id} variants={fadeInUp}>
              <GalleryImage image={img} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
