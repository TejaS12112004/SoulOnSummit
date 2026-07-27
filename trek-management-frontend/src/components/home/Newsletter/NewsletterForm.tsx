import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { NEWSLETTER_SECTION } from '@/constants/home';
import { cn } from '@/utils/cn';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    // Placeholder — will connect to POST /api/v1/newsletter/subscribe
    setEmail('');          // reset field before showing success
    setSubscribed(true);
  };

  if (subscribed) {
    return (
      <div className="bg-accent/15 border border-accent/30 rounded-xl px-6 py-4 text-accent font-semibold text-center">
        ✓ {NEWSLETTER_SECTION.successMessage}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Newsletter subscription form"
    >
      <div className="flex gap-3 max-w-[460px] mx-auto flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <Input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
            placeholder={NEWSLETTER_SECTION.placeholder}
            aria-label="Email address"
            aria-describedby={error ? "newsletter-error" : undefined}
            aria-invalid={!!error}
            className={cn(
              "h-12 rounded-xl border-white/10 bg-white/10 text-white placeholder:text-white/45",
              "focus-visible:border-accent/60 focus-visible:ring-accent/30 focus-visible:ring-2 focus-visible:outline-none",
              "text-base px-4"
            )}
          />
          {error && (
            <p
              id="newsletter-error"
              role="alert"
              className="text-accent text-[0.78rem] mt-1.5 text-left"
            >
              {error}
            </p>
          )}
        </div>
        <Button
          type="submit"
          className="btn-primary px-7 py-3 h-auto rounded-xl shrink-0 text-base"
        >
          {NEWSLETTER_SECTION.submitLabel}
        </Button>
      </div>
    </form>
  );
}
