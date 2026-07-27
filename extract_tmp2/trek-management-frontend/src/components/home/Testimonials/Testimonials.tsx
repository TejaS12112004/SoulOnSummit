import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { TestimonialCard } from './TestimonialCard';
import { TESTIMONIALS_SECTION, TESTIMONIALS } from '@/constants/home';
import { getFadeInUp, getStaggerContainer } from '@/constants/motion';
import { cn } from '@/utils/cn';

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const staggerContainer = getStaggerContainer(shouldReduceMotion ?? false);
  const fadeInUp = getFadeInUp(shouldReduceMotion ?? false);

  return (
    <section className="py-24 px-6 bg-white" aria-labelledby="testimonials-title">
      <div className="max-w-[1100px] mx-auto">
        <motion.div
          className="text-center mb-14"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            variants={fadeInUp}
            className="text-accent text-[0.78rem] tracking-wider uppercase font-semibold mb-3"
          >
            {TESTIMONIALS_SECTION.label}
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            id="testimonials-title"
            className="font-display text-4xl lg:text-5xl font-bold text-white"
          >
            {TESTIMONIALS_SECTION.title}
          </motion.h2>
        </motion.div>

        {/* Card grid — active card highlighted with forest bg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((testimonial, i) => (
            <button
              key={testimonial.id}
              type="button"
              className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-card"
              onClick={() => setActiveIndex(i)}
              aria-pressed={i === activeIndex}
              aria-label={`View testimonial from ${testimonial.name}`}
            >
              <TestimonialCard testimonial={testimonial} isActive={i === activeIndex} />
            </button>
          ))}
        </div>

        {/* Dot pagination */}
        <div className="flex justify-center gap-2 mt-8" role="tablist" aria-label="Testimonial navigation">
          {TESTIMONIALS.map((t, i) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "h-2 rounded-full border-none transition-all duration-200 ease-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
                i === activeIndex ? "w-7 bg-forest" : "w-2 bg-image-placeholder"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
