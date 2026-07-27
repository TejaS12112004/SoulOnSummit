import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';

interface AuthButtonProps {
  isScrolled?: boolean;
  onClick?: () => void;
}

export function LoginButton({ isScrolled = true, onClick }: AuthButtonProps) {
  return (
    <Link 
      to="/login" 
      onClick={onClick}
      className={cn(
        "hidden lg:flex items-center justify-center font-sans font-medium text-[0.9rem] px-1 py-2 transition-colors duration-200",
        isScrolled ? "text-muted" : "text-white/90"
      )}
    >
      Login
    </Link>
  );
}

export function RegisterButton({ isScrolled = true, onClick }: AuthButtonProps) {
  return (
    <Link 
      to="/register" 
      onClick={onClick}
      className={cn(
        "hidden lg:flex items-center justify-center font-sans font-medium text-[0.9rem] px-4 py-2 rounded-lg border-2 transition-colors duration-200",
        isScrolled 
          ? "border-forest text-forest hover:bg-forest hover:text-white" 
          : "border-white/60 text-white/90 hover:bg-white hover:text-forest"
      )}
    >
      Register
    </Link>
  );
}
