import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';
import { NavLink } from './NavLink';
import { MobileMenu } from './MobileMenu';
import { LoginButton } from './AuthButtons';
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
        background: 'transparent',
      } : undefined}
      initial={false}
      role="banner"
    >
      {/* Container aligned with the page max-width */}
      <div className="max-w-[1300px] w-full mx-auto px-6 lg:px-12 flex items-center justify-between h-full gap-8">

        {/* LEFT — Logo (natural flow) */}
        <div className="shrink-0">
          <Logo isScrolled={solid} />
        </div>

        {/* CENTER — Nav links centered with flex-1 */}
        <nav
          className="hidden lg:flex flex-1 justify-center items-center gap-8"
          aria-label="Primary"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} isScrolled={solid} />
          ))}
        </nav>

        {/* RIGHT — Auth buttons pinned to the right */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <UserDropdown />
            ) : (
              <>
                <LoginButton isScrolled={solid} />
              </>
            )}
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
