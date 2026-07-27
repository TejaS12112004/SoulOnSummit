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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-200 h-navbar flex items-center",
        solid ? "bg-white shadow-[0_2px_24px_rgba(28,43,58,0.08)]" : "bg-transparent"
      )}
      initial={false}
      role="banner"
    >
      <div className="container mx-auto px-6 flex items-center justify-between h-full">
        {/* Left side: Logo */}
        <Logo isScrolled={solid} />

        {/* Center: Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} isScrolled={solid} />
          ))}
        </nav>

        {/* Right side: Auth & CTA & Mobile Trigger */}
        <div className="flex items-center gap-3">
          {/* Desktop Auth / Action Buttons */}
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
              className="btn-primary rounded-full px-[22px] py-[10px] text-[0.88rem]"
              asChild
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
