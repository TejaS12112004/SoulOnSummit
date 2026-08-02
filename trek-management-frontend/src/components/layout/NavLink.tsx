import { NavLink as RouterNavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface NavLinkProps {
  href: string;
  label: string;
  onClick?: () => void;
  className?: string;
  isScrolled?: boolean;
}

export function NavLink({ href, label, onClick, className, isScrolled = true }: NavLinkProps) {
  return (
    <RouterNavLink
      to={href}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'relative px-2 py-1 font-sans text-[14px] font-bold transition-colors duration-200 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          isActive
            ? (isScrolled ? 'text-[#1F4D3A] dark:text-white' : 'text-white')
            : (isScrolled ? 'text-gray-600 dark:text-gray-300 hover:text-[#1F4D3A] dark:hover:text-white' : 'text-white/90 hover:text-white'),
          className
        )
      }
    >
      {({ isActive }) => (
        <>
          {label}
          {isActive && (
            <motion.div
              layoutId="nav-active-indicator"
              className={cn("absolute -bottom-1 left-0 right-0 h-[2px] rounded-full", isScrolled ? "bg-forest dark:bg-white" : "bg-white")}
              initial={false}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 30,
              }}
            />
          )}
        </>
      )}
    </RouterNavLink>
  );
}
