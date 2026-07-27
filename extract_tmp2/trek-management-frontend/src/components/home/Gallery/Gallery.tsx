import { motion, useReducedMotion } from 'framer-motion';
import { GalleryImage } from './GalleryImage';
import { GALLERY_SECTION, GALLERY_IMAGES } from '@/constants/home';
import { getFadeInUp, getStaggerContainer } from '@/constants/motion';

export function Gallery() {
  const shouldReduceMotion = useReducedMotion();
  const staggerContainer = getStaggerContainer(shouldReduceMotion ?? false);
  const fadeInUp = getFadeInUp(shouldReduceMotion ?? false);

  return (
    <section className="py-24 bg-beige" aria-labelledby="gallery-title">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-10"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            variants={fadeInUp}
            className="text-accent text-[0.78rem] tracking-wider uppercase font-semibold mb-3"
          >
            {GALLERY_SECTION.label}
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            id="gallery-title"
            className="font-display text-4xl lg:text-5xl font-bold text-white"
          >
            {GALLERY_SECTION.title}
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-muted mt-3 text-[0.9rem]">
            {GALLERY_SECTION.description}
          </motion.p>
        </motion.div>

        {/*
          Grid: responsive, matching Figma's auto-fill minmax(180px, 1fr).
          2-col on 320px, 3-col on sm, 4-col on lg automatically.
        */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {GALLERY_IMAGES.map((img: { id: string; url: string; alt: string }) => (
            <GalleryImage key={img.id} image={img} />
          ))}
        </div>
      </div>
    </section>
  );
}
