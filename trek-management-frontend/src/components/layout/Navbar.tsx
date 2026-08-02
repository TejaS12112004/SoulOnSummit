import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';
import { NavLink } from './NavLink';
import { MobileMenu } from './MobileMenu';
import { LoginButton } from './AuthButtons';
import { UserDropdown } from './UserDropdown';
import { usePublicSettings } from '@/contexts/PublicSettingsContext';
import { NAV_ITEMS } from '@/constants/navigation';
import { NAVBAR_SCROLL_THRESHOLD } from '@/constants/layout';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/cn';
import { ROUTES } from '@/constants/routes';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();
  const { settings } = usePublicSettings();
  const supportPhone = settings?.supportPhone || '+1 (555) 123-4567';

  const isHero = pathname === '/' || pathname === '/home';

  useMotionValueEvent(scrollY, "change", (latest) => {
    const isPastThreshold = latest > NAVBAR_SCROLL_THRESHOLD;
    if (isPastThreshold !== isScrolled) {
      setIsScrolled(isPastThreshold);
    }
  });

  const solid = isScrolled || !isHero;

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 flex items-center",
        solid ? "bg-background/95 backdrop-blur shadow-sm h-navbar" : "h-[72px]"
      )}
      style={!solid ? {
        background: 'transparent',
      } : undefined}
      initial={false}
      role="banner"
    >
      <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-12 flex items-center justify-between h-full gap-8">

        <div className="shrink-0">
          <Logo isScrolled={solid} />
        </div>

        <nav
          className="hidden lg:flex flex-1 justify-center items-center gap-8"
          aria-label="Primary"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} isScrolled={solid} />
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-6">
            <div className={cn("flex items-center gap-1.5 font-medium transition-colors", solid ? "text-foreground" : "text-white/90")}>
              <Phone className="w-4 h-4 text-accent" />
              <a href={`tel:${supportPhone}`} className="hover:text-accent transition-colors text-sm font-sans tracking-wide">
                {supportPhone}
              </a>
            </div>

            <Button
              asChild
              style={{
                background: '#F59E0B',
                color: '#1C2B3A',
                borderRadius: '10px',
                height: '42px',
                paddingLeft: '24px',
                paddingRight: '24px',
                fontSize: '0.875rem',
                fontWeight: 700,
                fontFamily: 'var(--font-sans-custom)',
                border: 'none',
              }}
            >
              <Link to={isAuthenticated ? "/treks" : ROUTES.LOGIN}>Book Now</Link>
            </Button>
            {isAuthenticated ? (
              <UserDropdown />
            ) : (
              <>
                <LoginButton isScrolled={solid} />
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <MobileMenu isScrolled={solid} />
        </div>
      </div>
    </motion.header>
  );
}
