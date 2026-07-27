import { Mail } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { NewsletterForm } from './NewsletterForm';
import { NEWSLETTER_SECTION } from '@/constants/home';
import { getFadeInUp, getStaggerContainer } from '@/constants/motion';

export function Newsletter() {
  const shouldReduceMotion = useReducedMotion();
  const staggerContainer = getStaggerContainer(shouldReduceMotion ?? false);
  const fadeInUp = getFadeInUp(shouldReduceMotion ?? false);

  return (
    <section className="bg-gradient-newsletter py-24 relative overflow-hidden" aria-labelledby="newsletter-title">
      {/* Decorative accent circle — matches Figma top-right orb */}
      <div
        className="absolute -top-[60px] -right-[60px] w-[300px] h-[300px] rounded-full bg-accent/[0.06] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 text-center relative">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col items-center"
        >
          <motion.div variants={fadeInUp} aria-hidden="true">
            <Mail className="w-10 h-10 text-accent mb-4" />
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            id="newsletter-title"
            className="font-display text-[2rem] font-bold text-white mb-3"
          >
            {NEWSLETTER_SECTION.title}
          </motion.h2>

          <motion.p variants={fadeInUp} className="text-white/65 mb-8 leading-[1.7]">
            {NEWSLETTER_SECTION.description}
          </motion.p>

          <motion.div variants={fadeInUp} className="w-full">
            <NewsletterForm />
          </motion.div>

          <motion.p variants={fadeInUp} className="text-white/35 text-[0.78rem] mt-4">
            {NEWSLETTER_SECTION.finePrint}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
