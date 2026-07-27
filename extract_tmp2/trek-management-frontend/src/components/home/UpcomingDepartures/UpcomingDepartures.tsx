import { motion, useReducedMotion } from 'framer-motion';
import { DepartureCard } from './DepartureCard';
import { UPCOMING_DEPARTURES_SECTION, UPCOMING_DEPARTURES } from '@/constants/home';
import { getFadeInUp, getStaggerContainer } from '@/constants/motion';

export function UpcomingDepartures() {
  const shouldReduceMotion = useReducedMotion();
  const staggerContainer = getStaggerContainer(shouldReduceMotion ?? false);
  const fadeInUp = getFadeInUp(shouldReduceMotion ?? false);

  return (
    <section className="py-24 px-6 bg-forest" aria-labelledby="upcoming-departures-title">
      {/* max-w-[1100px] intentional — matches Figma layout narrower than PageContainer */}
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
            className="text-accent text-[0.78rem] tracking-[0.15em] uppercase font-semibold mb-3"
          >
            {UPCOMING_DEPARTURES_SECTION.label}
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            id="upcoming-departures-title"
            className="font-display text-[clamp(2rem,4vw,3rem)] font-bold text-white leading-[1.2]"
          >
            {UPCOMING_DEPARTURES_SECTION.title}
          </motion.h2>
        </motion.div>

        <motion.div
          className="flex flex-col gap-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {UPCOMING_DEPARTURES.map((dep) => (
            <motion.div key={dep.departureId} variants={fadeInUp}>
              <DepartureCard departure={dep} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
