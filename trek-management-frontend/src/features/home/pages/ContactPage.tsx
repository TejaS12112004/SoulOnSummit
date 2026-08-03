import { motion, useReducedMotion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, MessageCircle, Clock, ExternalLink } from 'lucide-react';
import { usePublicSettings } from '@/contexts/PublicSettingsContext';

const Instagram = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const Facebook = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const Youtube = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

const Twitter = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
  </svg>
);

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const INSTAGRAM_URL = 'https://www.instagram.com/thesoulonsummit/';

export default function ContactPage() {
  const { settings } = usePublicSettings();
  const shouldReduceMotion = useReducedMotion();
  const fade = shouldReduceMotion ? {} : fadeInUp;
  const staggerAnim = shouldReduceMotion ? {} : stagger;

  const phone = settings?.supportPhone || '+91 90582 90383';
  const email = settings?.supportEmail || 'thesoulonsummit@gmail.com';
  const address = settings?.businessAddress || 'Uttarakhand, India';
  const instagramUrl = settings?.instagramUrl || INSTAGRAM_URL;
  const facebookUrl = settings?.facebookUrl;
  const youtubeUrl = settings?.youtubeUrl;
  const twitterUrl = settings?.twitterUrl;

  const socialLinks = [
    instagramUrl && {
      icon: Instagram,
      label: 'Instagram',
      href: instagramUrl,
      handle: '@soulonsummit',
      color: '#E1306C',
      bg: 'rgba(225,48,108,0.1)',
      border: 'rgba(225,48,108,0.25)',
      desc: 'Follow for daily Himalayan visuals',
    },
    facebookUrl && {
      icon: Facebook,
      label: 'Facebook',
      href: facebookUrl,
      handle: 'Soul on Summit',
      color: '#1877F2',
      bg: 'rgba(24,119,242,0.1)',
      border: 'rgba(24,119,242,0.25)',
      desc: 'Updates, trek stories & community',
    },
    youtubeUrl && {
      icon: Youtube,
      label: 'YouTube',
      href: youtubeUrl,
      handle: 'Soul on Summit',
      color: '#FF0000',
      bg: 'rgba(255,0,0,0.08)',
      border: 'rgba(255,0,0,0.22)',
      desc: 'Trek vlogs & Himalayan journeys',
    },
    twitterUrl && {
      icon: Twitter,
      label: 'Twitter / X',
      href: twitterUrl,
      handle: '@soulonsummit',
      color: '#1DA1F2',
      bg: 'rgba(29,161,242,0.08)',
      border: 'rgba(29,161,242,0.22)',
      desc: 'Quick updates & mountain thoughts',
    },
  ].filter(Boolean) as {
    icon: React.ElementType;
    label: string;
    href: string;
    handle: string;
    color: string;
    bg: string;
    border: string;
    desc: string;
  }[];

  return (
    <div className="flex flex-col min-h-screen">

      {/* ── Hero ── */}
      <section
        className="relative flex items-center justify-center overflow-hidden"
        style={{ minHeight: '52vh', background: 'linear-gradient(135deg, #0D2B1F 0%, #1F4D3A 60%, #0a1f16 100%)' }}
        aria-label="Contact Soul on Summit"
      >
        {/* Decorative SVG */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <path d="M0 500 L180 280 L320 380 L480 180 L660 340 L880 140 L1060 290 L1240 170 L1440 260 L1440 500 Z" fill="rgba(255,255,255,0.025)" />
          <path d="M0 500 L120 330 L280 430 L450 220 L640 380 L850 200 L1050 350 L1260 220 L1440 320 L1440 500 Z" fill="rgba(245,158,11,0.04)" />
          <circle cx="80%" cy="25%" r="200" fill="rgba(245,158,11,0.04)" />
        </svg>

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto py-20">
          <motion.div variants={staggerAnim} initial="hidden" animate="visible">
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
              📱 Enquire Now
            </motion.div>

            <motion.h1
              variants={fade}
              style={{
                fontFamily: 'var(--font-display-custom)',
                fontSize: 'clamp(2.6rem, 5.5vw, 4.5rem)',
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                color: '#FFFFFF',
                marginBottom: '20px',
              }}
            >
              The Summit Awaits —<br />
              <span style={{ color: '#F59E0B' }}>Let's Talk Treks</span>
            </motion.h1>

            <motion.p
              variants={fade}
              style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
                lineHeight: 1.7,
                fontFamily: 'var(--font-sans-custom)',
              }}
            >
              Have questions about a trek? Want to join a batch? Just want to talk
              mountains? We're always here. Reach out through any channel below.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Main Contact Content ── */}
      <section
        style={{ background: 'var(--color-beige)', padding: '80px 24px' }}
        aria-labelledby="contact-info-title"
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Left: Contact Cards ── */}
            <div className="lg:col-span-1 flex flex-col gap-5">
              <motion.div
                variants={staggerAnim}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex flex-col gap-5"
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
                    marginBottom: '4px',
                  }}
                >
                  Direct Reach
                </motion.div>
                <motion.h2
                  id="contact-info-title"
                  variants={fade}
                  style={{
                    fontFamily: 'var(--font-display-custom)',
                    fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                    fontWeight: 700,
                    lineHeight: 1.1,
                    marginBottom: '8px',
                  }}
                  className="text-foreground"
                >
                  Get In Touch
                </motion.h2>

                {/* Phone */}
                <motion.a
                  variants={fade}
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  className="group block"
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid rgba(0,0,0,0.07)',
                    borderRadius: '18px',
                    padding: '24px',
                    textDecoration: 'none',
                    transition: 'all 0.25s ease',
                    boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
                  }}
                  whileHover={{ y: -3, boxShadow: '0 8px 32px rgba(31,77,58,0.12)' }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '14px',
                        background: 'rgba(31,77,58,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Phone className="w-5 h-5" style={{ color: '#1F4D3A' }} />
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: 'var(--font-sans-custom)',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          color: '#1F4D3A',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          marginBottom: '4px',
                        }}
                      >
                        Call Us
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-display-custom)',
                          fontSize: '1.05rem',
                          fontWeight: 700,
                          color: '#0D2B1F',
                        }}
                      >
                        {phone}
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-sans-custom)',
                          fontSize: '0.8rem',
                          color: 'rgba(0,0,0,0.5)',
                          marginTop: '2px',
                        }}
                      >
                        Tap to call directly
                      </div>
                    </div>
                  </div>
                </motion.a>

                {/* Email */}
                <motion.a
                  variants={fade}
                  href={`mailto:${email}`}
                  className="group block"
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid rgba(0,0,0,0.07)',
                    borderRadius: '18px',
                    padding: '24px',
                    textDecoration: 'none',
                    transition: 'all 0.25s ease',
                    boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
                  }}
                  whileHover={{ y: -3, boxShadow: '0 8px 32px rgba(31,77,58,0.12)' }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '14px',
                        background: 'rgba(245,158,11,0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Mail className="w-5 h-5" style={{ color: '#F59E0B' }} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: 'var(--font-sans-custom)',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          color: '#1F4D3A',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          marginBottom: '4px',
                        }}
                      >
                        Email Us
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-display-custom)',
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          color: '#0D2B1F',
                          wordBreak: 'break-all',
                        }}
                      >
                        {email}
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-sans-custom)',
                          fontSize: '0.8rem',
                          color: 'rgba(0,0,0,0.5)',
                          marginTop: '2px',
                        }}
                      >
                        We reply within 24 hours
                      </div>
                    </div>
                  </div>
                </motion.a>

                {/* Address */}
                {address && (
                  <motion.div
                    variants={fade}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid rgba(0,0,0,0.07)',
                      borderRadius: '18px',
                      padding: '24px',
                      boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '14px',
                          background: 'rgba(31,77,58,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <MapPin className="w-5 h-5" style={{ color: '#1F4D3A' }} />
                      </div>
                      <div>
                        <div
                          style={{
                            fontFamily: 'var(--font-sans-custom)',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            color: '#1F4D3A',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            marginBottom: '4px',
                          }}
                        >
                          Based In
                        </div>
                        <div
                          style={{
                            fontFamily: 'var(--font-display-custom)',
                            fontSize: '1rem',
                            fontWeight: 700,
                            color: '#0D2B1F',
                          }}
                        >
                          {address}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Response Time */}
                <motion.div
                  variants={fade}
                  style={{
                    background: 'linear-gradient(135deg, #1F4D3A, #0D2B1F)',
                    borderRadius: '18px',
                    padding: '24px',
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="w-5 h-5" style={{ color: '#F59E0B' }} />
                    <span
                      style={{
                        fontFamily: 'var(--font-sans-custom)',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        fontSize: '0.9rem',
                      }}
                    >
                      Response Times
                    </span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: 'WhatsApp / Call', time: 'Usually within 2 hours' },
                      { label: 'Email', time: 'Within 24 hours' },
                      { label: 'DM (Instagram)', time: 'Within 24 hours' },
                    ].map(({ label, time }) => (
                      <div key={label} className="flex justify-between items-center">
                        <span style={{ fontFamily: 'var(--font-sans-custom)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>{label}</span>
                        <span style={{ fontFamily: 'var(--font-sans-custom)', fontSize: '0.8rem', fontWeight: 600, color: '#F59E0B' }}>{time}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* ── Right: WhatsApp + Enquiry Panel ── */}
            <div className="lg:col-span-2 flex flex-col gap-6">

              {/* WhatsApp CTA */}
              <motion.a
                variants={fade}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                  borderRadius: '20px',
                  padding: '28px 32px',
                  textDecoration: 'none',
                  boxShadow: '0 8px 32px rgba(37,211,102,0.25)',
                }}
                whileHover={{ scale: 1.015, boxShadow: '0 12px 40px rgba(37,211,102,0.35)' }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-5">
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      background: 'rgba(255,255,255,0.15)',
                      borderRadius: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div
                      style={{
                        fontFamily: 'var(--font-display-custom)',
                        fontSize: '1.3rem',
                        fontWeight: 800,
                        color: '#FFFFFF',
                        marginBottom: '4px',
                      }}
                    >
                      Chat on WhatsApp
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-sans-custom)',
                        fontSize: '0.9rem',
                        color: 'rgba(255,255,255,0.85)',
                      }}
                    >
                      Fastest way to enquire — ask us anything about upcoming batches, pricing, or gear
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-white opacity-70 flex-shrink-0" />
                </div>
              </motion.a>

              {/* Instagram DM CTA */}
              <motion.a
                variants={fade}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  background: 'linear-gradient(135deg, #833AB4 0%, #C13584 50%, #E1306C 100%)',
                  borderRadius: '20px',
                  padding: '28px 32px',
                  textDecoration: 'none',
                  boxShadow: '0 8px 32px rgba(225,48,108,0.2)',
                }}
                whileHover={{ scale: 1.015, boxShadow: '0 12px 40px rgba(225,48,108,0.3)' }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-5">
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      background: 'rgba(255,255,255,0.15)',
                      borderRadius: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Instagram className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div
                      style={{
                        fontFamily: 'var(--font-display-custom)',
                        fontSize: '1.3rem',
                        fontWeight: 800,
                        color: '#FFFFFF',
                        marginBottom: '4px',
                      }}
                    >
                      DM on Instagram
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-sans-custom)',
                        fontSize: '0.9rem',
                        color: 'rgba(255,255,255,0.85)',
                      }}
                    >
                      Follow <strong>@soulonsummit</strong> for Himalayan visuals &amp; DM us for trek enquiries
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-white opacity-70 flex-shrink-0" />
                </div>
              </motion.a>

              {/* Email CTA block */}
              <motion.a
                variants={fade}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                href={`mailto:${email}`}
                style={{
                  display: 'block',
                  background: '#FFFFFF',
                  border: '1.5px solid rgba(31,77,58,0.15)',
                  borderRadius: '20px',
                  padding: '28px 32px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                }}
                whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(31,77,58,0.1)', borderColor: 'rgba(31,77,58,0.3)' }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-5">
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      background: 'rgba(245,158,11,0.12)',
                      borderRadius: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Send className="w-7 h-7" style={{ color: '#F59E0B' }} />
                  </div>
                  <div className="flex-1">
                    <div
                      style={{
                        fontFamily: 'var(--font-display-custom)',
                        fontSize: '1.3rem',
                        fontWeight: 800,
                        color: '#0D2B1F',
                        marginBottom: '4px',
                      }}
                    >
                      Send an Email
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-sans-custom)',
                        fontSize: '0.9rem',
                        color: 'rgba(0,0,0,0.6)',
                      }}
                    >
                      {email} — for detailed trek queries, bookings &amp; partnerships
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 opacity-40 flex-shrink-0" />
                </div>
              </motion.a>

              {/* Social Links Grid */}
              {socialLinks.length > 0 && (
                <motion.div
                  variants={staggerAnim}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-sans-custom)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#1F4D3A',
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      marginBottom: '16px',
                    }}
                  >
                    Follow Our Journey
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {socialLinks.map((social) => {
                      const Icon = social.icon;
                      return (
                        <motion.a
                          key={social.label}
                          variants={fade}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px',
                            background: '#FFFFFF',
                            border: `1.5px solid ${social.border}`,
                            borderRadius: '16px',
                            padding: '18px 20px',
                            textDecoration: 'none',
                            transition: 'all 0.2s ease',
                          }}
                          whileHover={{
                            y: -3,
                            boxShadow: `0 8px 24px ${social.bg.replace('0.1)', '0.25)')}`,
                            background: social.bg,
                          }}
                        >
                          <div
                            style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '12px',
                              background: social.bg,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <Icon className="w-5 h-5" style={{ color: social.color }} />
                          </div>
                          <div>
                            <div
                              style={{
                                fontFamily: 'var(--font-sans-custom)',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                color: '#0D2B1F',
                              }}
                            >
                              {social.label}
                            </div>
                            <div
                              style={{
                                fontFamily: 'var(--font-sans-custom)',
                                fontSize: '0.78rem',
                                color: 'rgba(0,0,0,0.5)',
                              }}
                            >
                              {social.desc}
                            </div>
                          </div>
                        </motion.a>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Map / Location Banner ── */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0D2B1F 0%, #1F4D3A 100%)',
          padding: '64px 24px',
          textAlign: 'center',
        }}
        aria-label="Our location"
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
            style={{ fontSize: '3rem', marginBottom: '16px' }}
          >
            🏔️
          </motion.div>
          <motion.h2
            variants={fade}
            style={{
              fontFamily: 'var(--font-display-custom)',
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              fontWeight: 700,
              color: '#FFFFFF',
              marginBottom: '16px',
            }}
          >
            Find Us in the Himalayas
          </motion.h2>
          <motion.p
            variants={fade}
            style={{
              color: 'rgba(255,255,255,0.65)',
              fontSize: '1rem',
              lineHeight: 1.7,
              fontFamily: 'var(--font-sans-custom)',
              marginBottom: '12px',
            }}
          >
            {address}
          </motion.p>
          <motion.p
            variants={fade}
            style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: '0.9rem',
              fontFamily: 'var(--font-sans-custom)',
              fontStyle: 'italic',
            }}
          >
            "The mountains are calling and I must go." — John Muir
          </motion.p>
        </motion.div>
      </section>

    </div>
  );
}
