import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';

interface LogoProps {
  onClick?: () => void;
  className?: string;
  isScrolled?: boolean;
}

export function Logo({ onClick, className, isScrolled = true }: LogoProps) {
  return (
    <Link 
      to="/" 
      onClick={onClick} 
      className={cn("flex items-center gap-[10px] rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:opacity-90 transition-opacity duration-200", className)} 
      aria-label="Soul On Summit Home"
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-gradient-forest">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M2 16L8 6l4 6 3-4 3 4H2z" fill="white" opacity="0.9" />
          <circle cx="10" cy="3" r="2" className="fill-accent" />
        </svg>
      </div>
      <div className="flex flex-col">
        <div
          className={cn(
            "font-display font-bold text-lg leading-[1.1] tracking-[-0.01em] transition-colors duration-200 ease-out",
            isScrolled ? "text-forest" : "text-white"
          )}
        >
          Soul On Summit
        </div>
        <div
          className={cn(
            "font-sans font-semibold uppercase text-[10px] tracking-[0.12em] transition-colors duration-200 ease-out",
            isScrolled ? "text-accent" : "text-white/90"
          )}
        >
          Adventure Travel
        </div>
      </div>
    </Link>
  );
}
