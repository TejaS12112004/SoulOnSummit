import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

interface AuthButtonProps {
  isScrolled?: boolean;
  onClick?: () => void;
}

export function LoginButton({ isScrolled = true, onClick }: AuthButtonProps) {
  return (
    <Button
      asChild
      variant="ghost"
      onClick={onClick}
      className={cn(
        "hidden lg:inline-flex",
        isScrolled ? "text-muted hover:text-foreground" : "text-white/90 hover:text-white hover:bg-white/10"
      )}
    >
      <Link to="/login">
        Login
      </Link>
    </Button>
  );
}

export function RegisterButton({ isScrolled = true, onClick }: AuthButtonProps) {
  return (
    <Button
      asChild
      variant="outline"
      onClick={onClick}
      className={cn(
        "hidden lg:inline-flex rounded-full bg-transparent transition-colors",
        isScrolled ? "border-forest/30 text-forest hover:bg-forest/5" : "border-white/30 text-white hover:bg-white/10 hover:text-white"
      )}
    >
      <Link to="/register">
        Register
      </Link>
    </Button>
  );
}
