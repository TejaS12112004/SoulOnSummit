import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { HeroSearch } from './HeroSearch';
import { getFadeInUp, getStaggerContainer } from '@/constants/motion';
import type { HeroProps } from './Hero';

type HeroContentProps = Omit<HeroProps, 'backgroundImage' | 'imageAlt'>;

export function HeroContent({
  label,
  title,
  titleHighlight,
  subtitle,
  searchPlaceholder,
  primaryCTA,
  secondaryCTA
}: HeroContentProps) {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/treks?search=${encodeURIComponent(query)}`);
    } else {
      navigate('/treks');
    }
  };

  const fadeInUp = getFadeInUp(shouldReduceMotion ?? false);
  const staggerContainer = getStaggerContainer(shouldReduceMotion ?? false);

  return (
    <div className="relative text-center px-6 w-full max-w-[900px] mx-auto z-10">
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center"
      >
        {label && (
          <motion.div variants={fadeInUp} className="text-accent mb-6 text-[0.78rem] font-semibold">
            {label}
          </motion.div>
        )}
        
        <motion.h1 
          variants={fadeInUp} 
          className="font-display text-[clamp(2.4rem,6vw,4.5rem)] font-bold text-white leading-[1.15] mb-6 tracking-[-0.02em]"
        >
          {title}
          {titleHighlight && (
            <>
              <br />
              <span className="italic text-accent">{titleHighlight}</span>
            </>
          )}
        </motion.h1>
        
        <motion.p 
          variants={fadeInUp} 
          className="text-[clamp(1rem,2vw,1.2rem)] text-white/75 mb-10 max-w-[560px] mx-auto leading-[1.7]"
        >
          {subtitle}
        </motion.p>

        <motion.div variants={fadeInUp} className="w-full mb-8">
          <HeroSearch 
            placeholder={searchPlaceholder} 
            onSearch={handleSearch} 
          />
        </motion.div>

        {/* CTA Buttons */}
        <motion.div variants={fadeInUp} className="flex gap-4 justify-center flex-wrap">
          <Button asChild className="btn-primary px-8 py-[14px] text-base h-auto rounded-xl">
            <Link to={primaryCTA.href}>{primaryCTA.label}</Link>
          </Button>
          {secondaryCTA && (
            <Button 
              asChild 
              variant="ghost" 
              className="text-white hover:bg-white/10 hover:text-white px-8 py-[14px] text-base h-auto rounded-xl"
            >
              <Link to={secondaryCTA.href}>{secondaryCTA.label}</Link>
            </Button>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
