import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { NAV_ITEMS } from '@/constants/navigation';
import { Logo } from './Logo';
import { NavLink } from './NavLink';
import { LoginButton } from './AuthButtons';
import { useAuth } from '@/hooks/useAuth';
import { UserDropdown } from './UserDropdown';

interface MobileMenuProps {
  isScrolled?: boolean;
}

export function MobileMenu({ isScrolled = true }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();

  useEffect(() => {
    if (open) {
      setOpen(false);
    }
  }, [pathname, open]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "flex lg:hidden p-2 transition-colors duration-200",
              isScrolled ? "text-forest hover:bg-forest/10" : "text-white hover:bg-white/20"
            )} 
            aria-label="Open navigation menu"
          />
        }
      >
        <Menu className="w-6 h-6" />
      </SheetTrigger>
      
      {/* Right-side drawer as requested */}
      <SheetContent side="right" className="w-[300px] sm:w-[380px] flex flex-col pt-12 px-6 pb-6 bg-background border-l border-border">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

        <div className="flex justify-between items-center mb-8">
          <Logo onClick={() => setOpen(false)} isScrolled={true} />
        </div>

        <nav className="flex flex-col gap-6" aria-label="Mobile Navigation">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              onClick={() => setOpen(false)}
              className="text-lg"
              isScrolled={true}
            />
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-4">
          {isAuthenticated ? (
            <UserDropdown />
          ) : (
            <div className="flex flex-col gap-3 w-full">
              <LoginButton isScrolled={true} onClick={() => setOpen(false)} />
            </div>
          )}
          
          <Button 
            className="w-full py-6 text-base inline-flex items-center justify-center font-medium transition-colors bg-accent hover:bg-accent/90 text-primary-foreground rounded-xl"
            asChild
          >
            <Link to="/treks" onClick={() => setOpen(false)}>Book Now</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
