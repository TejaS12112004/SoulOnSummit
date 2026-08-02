import { motion, useReducedMotion } from 'framer-motion';
import { Mountain, Compass, Heart, Users, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
};

const values = [
  {
    icon: Mountain,
    title: 'Summit is the Goal',
    desc: 'Every trek we plan is built around giving you the best shot at the top — safe, prepared, and confident.',
  },
  {
    icon: Compass,
    title: 'Deep Himalayan Expertise',
    desc: 'We live and breathe Uttarakhand trails. Our knowledge is earned through years of firsthand exploration, not just maps.',
  },
  {
    icon: Heart,
    title: 'Passion Over Profit',
    desc: 'Adventure is not a hobby, it\'s our work. Every route we curate comes from genuine love for the mountains.',
  },
  {
    icon: Users,
    title: 'Community First',
    desc: 'We\'re part of the Himalayan adventure community — sharing the journey, the culture, and the silence of high altitude together.',
  },
  {
    icon: Star,
    title: 'Curated Experiences',
    desc: 'No cookie-cutter itineraries. Every departure is thoughtfully designed for the right season, weather, and group.',
  },
  {
    icon: ArrowRight,
    title: 'Trek. Explore. Repeat.',
    desc: 'We believe one Himalayan trek changes you. After that, there\'s no going back to beach chairs.',
  },
];

const stats = [
  { number: '500+', label: 'Trekkers Guided' },
  { number: '30+', label: 'Himalayan Routes' },
  { number: '5+', label: 'Years of Experience' },
  { number: '4.9★', label: 'Average Rating' },
];

export default function AboutPage() {
  const shouldReduceMotion = useReducedMotion();
  const fade = shouldReduceMotion ? {} : fadeInUp;
  const staggerAnim = shouldReduceMotion ? {} : stagger;

  return (
    <div className="flex flex-col min-h-screen">

      {/* ── Hero ── */}
      <section
        className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
        aria-label="About Soul on Summit"
      >
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #0D2B1F 0%, #1F4D3A 40%, #0a1f16 100%)',
          }}
        />

        {/* Decorative mountain silhouette lines */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1440 600"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <path
            d="M0 600 L200 300 L350 420 L500 200 L700 380 L900 150 L1100 320 L1280 180 L1440 300 L1440 600 Z"
            fill="rgba(255,255,255,0.03)"
          />
          <path
            d="M0 600 L150 380 L300 470 L480 260 L650 400 L850 220 L1050 370 L1250 230 L1440 350 L1440 600 Z"
            fill="rgba(245,158,11,0.06)"
          />
        </svg>

        {/* Prayer flags decoration */}
        <div className="absolute top-12 left-0 right-0 flex justify-center gap-3 overflow-hidden opacity-20 pointer-events-none" aria-hidden="true">
          {['#EF4444','#3B82F6','#FFFFFF','#22C55E','#F59E0B','#EF4444','#3B82F6','#FFFFFF','#22C55E','#F59E0B','#EF4444','#3B82F6','#FFFFFF','#22C55E','#F59E0B'].map((c, i) => (
            <div key={i} className="w-8 h-12 rounded-sm flex-shrink-0" style={{ background: c }} />
          ))}
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            variants={staggerAnim}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={fade}
              style={{
                color: '#F59E0B',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-sans-custom)',
                marginBottom: '20px',
              }}
            >
              🏔️ Our Story
            </motion.div>

            <motion.h1
              variants={fade}
              style={{
                fontFamily: 'var(--font-display-custom)',
                fontSize: 'clamp(2.8rem, 6vw, 5rem)',
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                color: '#FFFFFF',
                marginBottom: '24px',
              }}
            >
              Beaches are better than{' '}
              <span style={{ color: '#F59E0B' }}>mountains?</span>
              <br />
              Said no one after this.
            </motion.h1>

            <motion.p
              variants={fade}
              style={{
                color: 'rgba(255,255,255,0.72)',
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                lineHeight: 1.7,
                maxWidth: '620px',
                margin: '0 auto 36px',
                fontFamily: 'var(--font-sans-custom)',
              }}
            >
              Soul on Summit is an Uttarakhand-based Himalayan trekking company
              built by mountain people, for mountain people. We don't just guide
              treks — we curate transformations.
            </motion.p>

            <motion.div variants={fade} className="flex items-center justify-center gap-4 flex-wrap">
              <Button
                asChild
                style={{
                  background: '#F59E0B',
                  color: '#1C2B3A',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  padding: '14px 32px',
                  borderRadius: '12px',
                  height: 'auto',
                }}
              >
                <Link to="/treks">Explore Our Treks</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                style={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  padding: '14px 32px',
                  borderRadius: '12px',
                  height: 'auto',
                  background: 'rgba(255,255,255,0.06)',
                }}
              >
                <Link to="/contact">Get In Touch</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section
        style={{ background: '#F59E0B', padding: '48px 24px' }}
        aria-label="Our achievements"
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerAnim}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fade}
                className="text-center"
              >
                <div
                  style={{
                    fontFamily: 'var(--font-display-custom)',
                    fontSize: 'clamp(2.2rem, 4vw, 3rem)',
                    fontWeight: 800,
                    color: '#1C2B3A',
                    lineHeight: 1,
                    marginBottom: '8px',
                  }}
                >
                  {stat.number}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-sans-custom)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'rgba(28,43,58,0.75)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Story ── */}
      <section
        style={{ background: 'var(--color-beige)', padding: '96px 24px' }}
        aria-labelledby="story-title"
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Image */}
            <motion.div
              variants={fade}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              style={{ position: 'relative' }}
            >
              <div
                style={{
                  borderRadius: '24px',
                  overflow: 'hidden',
                  aspectRatio: '4/3',
                  background: '#1F4D3A',
                  position: 'relative',
                }}
              >
                {/* Himalayan visual */}
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #0D2B1F 0%, #1F4D3A 50%, #2D6A4F 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg viewBox="0 0 400 300" className="w-full h-full" aria-hidden="true">
                    {/* Sky */}
                    <defs>
                      <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF9A3C" stopOpacity="0.6" />
                        <stop offset="50%" stopColor="#1F4D3A" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <rect width="400" height="300" fill="url(#skyGrad)" />
                    {/* Snow peaks */}
                    <polygon points="80,280 160,100 240,280" fill="rgba(255,255,255,0.15)" />
                    <polygon points="200,280 300,80 400,280" fill="rgba(255,255,255,0.12)" />
                    <polygon points="0,280 80,140 160,280" fill="rgba(255,255,255,0.1)" />
                    {/* Snow caps */}
                    <polygon points="150,120 160,100 170,120" fill="rgba(255,255,255,0.9)" />
                    <polygon points="290,100 300,80 310,100" fill="rgba(255,255,255,0.9)" />
                    {/* Sun */}
                    <circle cx="320" cy="60" r="28" fill="rgba(245,158,11,0.7)" />
                    {/* Valley */}
                    <ellipse cx="200" cy="300" rx="220" ry="50" fill="rgba(13,43,31,0.8)" />
                    {/* Trekker silhouette */}
                    <g transform="translate(180,195)">
                      <circle cx="10" cy="0" r="5" fill="rgba(245,158,11,0.9)" />
                      <line x1="10" y1="5" x2="10" y2="22" stroke="rgba(245,158,11,0.9)" strokeWidth="2.5" />
                      <line x1="10" y1="10" x2="3" y2="18" stroke="rgba(245,158,11,0.9)" strokeWidth="2" />
                      <line x1="10" y1="10" x2="17" y2="18" stroke="rgba(245,158,11,0.9)" strokeWidth="2" />
                      <line x1="10" y1="22" x2="5" y2="32" stroke="rgba(245,158,11,0.9)" strokeWidth="2.5" />
                      <line x1="10" y1="22" x2="15" y2="32" stroke="rgba(245,158,11,0.9)" strokeWidth="2.5" />
                      {/* Trekking pole */}
                      <line x1="3" y1="10" x2="-3" y2="32" stroke="rgba(245,158,11,0.7)" strokeWidth="1.5" />
                    </g>
                    {/* Prayer flags */}
                    <line x1="20" y1="60" x2="380" y2="40" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
                    {['#EF4444','#3B82F6','#FFFFFF','#22C55E','#F59E0B'].map((c, i) => (
                      <rect key={i} x={60 + i * 65} y={47 + Math.sin(i) * 4} width="20" height="14" fill={c} opacity="0.7" rx="1" />
                    ))}
                  </svg>
                </div>

                {/* Quote overlay */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '20px',
                    right: '20px',
                    background: 'rgba(0,0,0,0.65)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    borderLeft: '3px solid #F59E0B',
                  }}
                >
                  <p
                    style={{
                      color: '#FFFFFF',
                      fontFamily: 'var(--font-sans-custom)',
                      fontSize: '0.85rem',
                      fontStyle: 'italic',
                      lineHeight: 1.5,
                    }}
                  >
                    "Adventure is not a hobby, it's our work 🏔️"
                  </p>
                </div>
              </div>

              {/* Floating tag */}
              <div
                style={{
                  position: 'absolute',
                  top: '-16px',
                  right: '-16px',
                  background: '#F59E0B',
                  borderRadius: '16px',
                  padding: '12px 20px',
                  boxShadow: '0 8px 32px rgba(245,158,11,0.4)',
                }}
              >
                <p style={{ fontFamily: 'var(--font-sans-custom)', fontWeight: 700, fontSize: '0.8rem', color: '#1C2B3A' }}>
                  Trek | Explore | Repeat
                </p>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              variants={staggerAnim}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div
                variants={fade}
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
                Who We Are
              </motion.div>

              <motion.h2
                variants={fade}
                id="story-title"
                style={{
                  fontFamily: 'var(--font-display-custom)',
                  fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                  fontWeight: 700,
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  marginBottom: '24px',
                }}
                className="text-foreground"
              >
                Born From the{' '}
                <span style={{ color: '#1F4D3A' }}>Mountains,</span>
                <br />
                Built for the{' '}
                <span style={{ color: '#F59E0B' }}>Mountains</span>
              </motion.h2>

              <motion.div
                variants={fade}
                style={{
                  color: 'var(--color-foreground)',
                  fontSize: '1rem',
                  lineHeight: 1.8,
                  fontFamily: 'var(--font-sans-custom)',
                  opacity: 0.8,
                }}
                className="space-y-4"
              >
                <p>
                  Soul on Summit is an adventure travel community focused on Himalayan
                  trekking across the stunning landscapes of Uttarakhand, India. We
                  position mountain treks as the most rewarding, life-changing alternative
                  to the ordinary — because once you've stood on a Himalayan ridge at
                  sunrise, no beach will ever feel the same.
                </p>
                <p>
                  We share high-definition visuals of snow-capped peaks, sunrise ridges,
                  prayer flags, and quiet Himalayan villages — all paired with the calm,
                  contemplative vibe that only the mountains can offer. We market peace,
                  not just adventure.
                </p>
                <p>
                  We're proud to be part of the broader Indian adventure-travel community,
                  where creators and trekkers alike highlight Himalayan winter treks and
                  personal transformation through mountain journeys.
                </p>
              </motion.div>

              <motion.div
                variants={fade}
                style={{ marginTop: '32px' }}
                className="flex items-center gap-3"
              >
                <div
                  style={{
                    width: '48px',
                    height: '3px',
                    background: '#F59E0B',
                    borderRadius: '999px',
                  }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-sans-custom)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    color: '#1F4D3A',
                    letterSpacing: '0.05em',
                  }}
                >
                  #MountainPeople #HimalayanVibes
                </span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section
        style={{ background: '#0D2B1F', padding: '96px 24px' }}
        aria-labelledby="values-title"
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <motion.div
            style={{ textAlign: 'center', marginBottom: '64px' }}
            variants={staggerAnim}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              variants={fade}
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
              What We Stand For
            </motion.div>
            <motion.h2
              variants={fade}
              id="values-title"
              style={{
                fontFamily: 'var(--font-display-custom)',
                fontSize: 'clamp(2.4rem, 4vw, 3.2rem)',
                fontWeight: 700,
                lineHeight: 1.1,
                color: '#FFFFFF',
              }}
            >
              Our Values
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerAnim}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {values.map((val) => {
              const Icon = val.icon;
              return (
                <motion.div
                  key={val.title}
                  variants={fade}
                  className="group"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '20px',
                    padding: '32px',
                    transition: 'all 0.3s ease',
                  }}
                  whileHover={{
                    background: 'rgba(245,158,11,0.08)',
                    borderColor: 'rgba(245,158,11,0.3)',
                    y: -4,
                  }}
                >
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '14px',
                      background: 'rgba(245,158,11,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '20px',
                    }}
                  >
                    <Icon className="w-6 h-6" style={{ color: '#F59E0B' }} />
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display-custom)',
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      marginBottom: '10px',
                    }}
                  >
                    {val.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans-custom)',
                      fontSize: '0.9rem',
                      color: 'rgba(255,255,255,0.6)',
                      lineHeight: 1.7,
                    }}
                  >
                    {val.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1F4D3A 0%, #0D2B1F 100%)',
          padding: '96px 24px',
          textAlign: 'center',
        }}
        aria-labelledby="cta-title"
      >
        <motion.div
          style={{ maxWidth: '700px', margin: '0 auto' }}
          variants={staggerAnim}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            variants={fade}
            style={{
              fontSize: '3rem',
              marginBottom: '20px',
            }}
          >
            🏔️
          </motion.div>
          <motion.h2
            variants={fade}
            id="cta-title"
            style={{
              fontFamily: 'var(--font-display-custom)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.1,
              marginBottom: '20px',
            }}
          >
            Ready to Feel the Himalayas?
          </motion.h2>
          <motion.p
            variants={fade}
            style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '1.05rem',
              lineHeight: 1.7,
              marginBottom: '36px',
              fontFamily: 'var(--font-sans-custom)',
            }}
          >
            DM us, call us, or browse our upcoming treks. The mountains are waiting
            — and trust us, they're better than any beach.
          </motion.p>
          <motion.div variants={fade} className="flex items-center justify-center gap-4 flex-wrap">
            <Button
              asChild
              style={{
                background: '#F59E0B',
                color: '#1C2B3A',
                fontWeight: 700,
                fontSize: '1rem',
                padding: '16px 36px',
                borderRadius: '12px',
                height: 'auto',
              }}
            >
              <Link to="/treks">Browse Treks</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              style={{
                borderColor: 'rgba(255,255,255,0.3)',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '1rem',
                padding: '16px 36px',
                borderRadius: '12px',
                height: 'auto',
                background: 'rgba(255,255,255,0.06)',
              }}
            >
              <Link to="/contact">Contact Us</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

    </div>
  );
}
