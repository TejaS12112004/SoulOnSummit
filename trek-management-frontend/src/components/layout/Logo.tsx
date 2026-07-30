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
      aria-label="The Soul On Summit Home"
    >
      <img 
        src="/logo.jpeg" 
        alt="The Soul On Summit Logo" 
        className="w-[42px] h-[42px] rounded-full object-cover shrink-0 border border-white/20 shadow-sm"
      />
      <div className="flex flex-col">
        <div
          className={cn(
            "font-display font-bold text-[1.2rem] leading-[1.1] tracking-[-0.01em] transition-colors duration-200 ease-out",
            isScrolled ? "text-forest" : "text-white"
          )}
        >
          The Soul On Summit
        </div>
        <div
          className={cn(
            "font-sans font-semibold uppercase text-[10px] tracking-[0.12em] transition-colors duration-200 ease-out",
            isScrolled ? "text-accent" : "text-white/90"
          )}
        >
          Adventure Trek
        </div>
      </div>
    </Link>
  );
}
