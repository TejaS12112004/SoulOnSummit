import { motion } from 'framer-motion';

interface HeroScrollIndicatorProps {
  text?: string;
}

export function HeroScrollIndicator({ text = "SCROLL TO EXPLORE" }: HeroScrollIndicatorProps) {
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      style={{ bottom: '2.5rem' }}
      aria-hidden="true"
    >
      <span
        style={{
          color: 'rgba(255,255,255,0.75)',
          fontSize: '0.65rem',
          fontWeight: 600,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-sans-custom)',
        }}
      >
        {text.toUpperCase()}
      </span>
      {/* Animated line */}
      <div
        style={{
          width: '1px',
          height: '48px',
          background: 'rgba(245,158,11,0.25)',
          overflow: 'hidden',
          borderRadius: '1px',
        }}
      >
        <motion.div
          style={{
            width: '100%',
            height: '100%',
            background: '#F59E0B',
            boxShadow: '0 0 6px rgba(245,158,11,0.7)',
            transformOrigin: 'top',
          }}
          animate={{ scaleY: [0, 1, 0], translateY: ['-100%', '0%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
}
