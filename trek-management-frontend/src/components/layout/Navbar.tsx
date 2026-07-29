import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';
import { NavLink } from './NavLink';
import { MobileMenu } from './MobileMenu';
import { LoginButton, RegisterButton } from './AuthButtons';
import { UserDropdown } from './UserDropdown';
import { NAV_ITEMS } from '@/constants/navigation';
import { NAVBAR_SCROLL_THRESHOLD } from '@/constants/layout';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/cn';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();

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
        solid ? "bg-white shadow-sm h-navbar" : "h-[72px]"
      )}
      style={!solid ? {
        background: 'rgba(10, 16, 24, 0.35)',
        backdropFilter: 'blur(2px)',
      } : undefined}
      initial={false}
      role="banner"
    >
      {/* Full-width relative container for absolute centering trick */}
      <div className="w-full px-6 relative flex items-center justify-between h-full">

        {/* LEFT — Logo (natural flow) */}
        <Logo isScrolled={solid} />

        {/* CENTER — Nav links absolutely centered on the full bar width */}
        <nav
          className="hidden lg:flex items-center gap-6 absolute left-1/2 -translate-x-1/2"
          aria-label="Primary"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} isScrolled={solid} />
          ))}
        </nav>

        {/* RIGHT — Auth buttons pinned to the right */}
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <UserDropdown />
            ) : (
              <>
                <LoginButton isScrolled={solid} />
                <RegisterButton isScrolled={solid} />
              </>
            )}
            <Button
              asChild
              style={{
                background: '#F59E0B',
                color: '#1C2B3A',
                borderRadius: '10px',
                height: '38px',
                paddingLeft: '20px',
                paddingRight: '20px',
                fontSize: '0.875rem',
                fontWeight: 700,
                fontFamily: 'var(--font-sans-custom)',
                border: 'none',
              }}
            >
              <Link to="/treks">Book Now</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <MobileMenu isScrolled={solid} />
        </div>
      </div>
    </motion.header>
  );
}
