import { Link, useNavigate } from 'react-router-dom';
import { Mountain, Play } from 'lucide-react';
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
    <div
      className="relative text-center px-6 w-full max-w-[1000px] mx-auto z-10"
      style={{ marginTop: '0px' }}
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center"
      >
        {/* Label */}
        {label && (
          <motion.div
            variants={fadeInUp}
            className="mb-5 flex items-center gap-2"
            style={{
              color: '#F59E0B',
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-sans-custom)',
            }}
          >
            <span style={{ fontSize: '0.55rem' }}>✦</span>
            {label}
            <span style={{ fontSize: '0.55rem' }}>✦</span>
          </motion.div>
        )}

        {/* Main headline — sized to fit one line at normal desktop widths */}
        <motion.h1
          variants={fadeInUp}
          style={{
            fontFamily: 'var(--font-display-custom)',
            fontSize: 'clamp(2rem, 4.2vw, 4rem)',
            fontWeight: 800,
            color: '#FFFFFF',
            lineHeight: 1.08,
            letterSpacing: '-0.02em',
            marginBottom: titleHighlight ? '0' : '0.6em',
          }}
        >
          {title}
          {titleHighlight && (
            <span
              style={{
                display: 'block',
                fontStyle: 'italic',
                color: '#F59E0B',
                fontSize: 'clamp(1.8rem, 3.8vw, 3.6rem)',
                fontWeight: 700,
                lineHeight: 1.12,
                marginTop: '0.04em',
                marginBottom: '0.45em',
              }}
            >
              {titleHighlight}
            </span>
          )}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeInUp}
          style={{
            fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)',
            color: 'rgba(255,255,255,0.88)',
            marginBottom: '2.2rem',
            maxWidth: '580px',
            lineHeight: 1.75,
            fontWeight: 400,
            fontFamily: 'var(--font-sans-custom)',
          }}
        >
          {subtitle}
        </motion.p>

        {/* Search bar */}
        <motion.div
          variants={fadeInUp}
          style={{ marginBottom: '1.4rem', display: 'flex', justifyContent: 'center', width: '100%' }}
        >
          <HeroSearch placeholder={searchPlaceholder} onSearch={handleSearch} />
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeInUp}
          className="flex gap-4 justify-center flex-wrap items-center"
          style={{ marginTop: '0.4rem' }}
        >
          <Button
            asChild
            style={{
              background: '#F59E0B',
              color: '#1C2B3A',
              borderRadius: '10px',
              height: '52px',
              minWidth: '182px',
              fontSize: '0.95rem',
              fontWeight: 700,
              fontFamily: 'var(--font-sans-custom)',
              border: 'none',
              boxShadow: '0 4px 20px rgba(245,158,11,0.35)',
              gap: '10px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              paddingLeft: '26px',
              paddingRight: '26px',
            }}
          >
            <Link to={primaryCTA.href}>
              <span className="text-[16px] mr-1 opacity-90">⛰️</span>
              {primaryCTA.label}
            </Link>
          </Button>

          {secondaryCTA && (
            <Button
              asChild
              style={{
                background: 'rgba(255,255,255,0.04)',
                color: '#FFFFFF',
                borderRadius: '10px',
                height: '52px',
                minWidth: '182px',
                fontSize: '0.95rem',
                fontWeight: 700,
                fontFamily: 'var(--font-sans-custom)',
                border: '1.5px solid rgba(255,255,255,0.3)',
                gap: '10px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingLeft: '26px',
                paddingRight: '26px',
                backdropFilter: 'blur(4px)',
              }}
            >
              <Link to={secondaryCTA.href}>
                <span className="text-[12px] mr-1">▶</span>
                {secondaryCTA.label}
              </Link>
            </Button>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
