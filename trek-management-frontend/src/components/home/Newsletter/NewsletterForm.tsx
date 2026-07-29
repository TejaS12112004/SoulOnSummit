import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { NEWSLETTER_SECTION } from '@/constants/home';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (!validateEmail(email)) { setError('Please enter a valid email address.'); return; }
    setError('');
    setEmail('');
    setSubscribed(true);
  };

  if (subscribed) {
    return (
      <div style={{
        background: 'rgba(110,231,183,0.12)',
        border: '1px solid rgba(110,231,183,0.3)',
        borderRadius: '12px',
        padding: '16px 24px',
        color: '#6EE7B7',
        fontWeight: 600,
        textAlign: 'center',
        fontFamily: 'var(--font-sans-custom)',
      }}>
        ✓ {NEWSLETTER_SECTION.successMessage}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Newsletter subscription form">
      {/* Email input and Subscribe button side by side */}
      <div style={{
        display: 'flex',
        gap: '12px',
        maxWidth: '520px',
        margin: '0 auto',
      }}>
        <div style={{ flex: 1 }}>
          <Input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
            placeholder={NEWSLETTER_SECTION.placeholder}
            aria-label="Email address"
            aria-describedby={error ? 'newsletter-error' : undefined}
            aria-invalid={!!error}
            style={{
              height: '52px',
              borderRadius: '12px',
              border: '1px solid rgba(240,235,224,0.12)',
              background: 'rgba(240,235,224,0.06)',
              color: '#F0EBE0',
              fontSize: '0.95rem',
              fontFamily: 'var(--font-sans-custom)',
              padding: '0 18px',
              width: '100%',
            }}
            className="placeholder:text-white/40 focus-visible:ring-0 focus-visible:border-white/25"
          />
          {error && (
            <p
              id="newsletter-error"
              role="alert"
              style={{
                color: '#FCA5A5',
                fontSize: '0.78rem',
                marginTop: '6px',
                textAlign: 'left',
                fontFamily: 'var(--font-sans-custom)',
              }}
            >
              {error}
            </p>
          )}
        </div>
        <Button
          type="submit"
          style={{
            background: '#F59E0B',
            color: '#1C2B3A',
            borderRadius: '12px',
            height: '52px',
            paddingLeft: '28px',
            paddingRight: '28px',
            fontSize: '0.95rem',
            fontWeight: 700,
            fontFamily: 'var(--font-sans-custom)',
            border: 'none',
            flexShrink: 0,
            cursor: 'pointer',
          }}
        >
          {NEWSLETTER_SECTION.submitLabel}
        </Button>
      </div>
    </form>
  );
}
