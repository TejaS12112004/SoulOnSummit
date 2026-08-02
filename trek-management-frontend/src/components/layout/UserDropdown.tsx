import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';

export function UserDropdown() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!user) return null;

  const initials = `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none transition-transform hover:scale-105"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User menu"
      >
        <div className="flex items-center justify-center w-[42px] h-[42px] rounded-full bg-[#1F4D3A] text-white font-semibold shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-[#1F4D3A]">
          {initials}
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full mt-3 w-[300px] bg-popover rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-border overflow-hidden z-50 origin-top-right ring-1 ring-black/5"
          >
            {/* Header Section */}
            <div className="px-6 py-8 flex items-center gap-5 bg-popover border-b border-border">
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl shadow-inner">
                {initials}
              </div>
              <div className="min-w-0 flex flex-col gap-1.5">
                <p className="text-base font-bold text-popover-foreground truncate font-sans tracking-tight">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-[14px] text-muted-foreground truncate font-medium">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Menu Links */}
            <div className="p-4">
              <Link
                to={isAdmin ? '/admin' : ROUTES.PROFILE}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-5 px-5 py-5 text-[15px] font-semibold text-foreground rounded-xl hover:bg-muted hover:text-primary transition-all duration-200 group"
              >
                <User className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                {isAdmin ? 'Admin Dashboard' : 'My Profile'}
              </Link>
              
              <div className="h-px bg-border my-8 mx-4" />
              
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="flex items-center w-full gap-5 px-5 py-5 text-[15px] font-semibold text-foreground rounded-xl hover:bg-destructive/10 hover:text-destructive transition-all duration-200 group"
              >
                <LogOut className="w-5 h-5 text-muted-foreground group-hover:text-destructive transition-colors" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
