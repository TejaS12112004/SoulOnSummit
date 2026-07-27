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
      variant={isScrolled ? "outline" : "default"}
      onClick={onClick}
      className={cn(
        "hidden lg:inline-flex",
        !isScrolled && "bg-white text-forest hover:bg-white/90 border-transparent shadow-none"
      )}
    >
      <Link to="/register">
        Register
      </Link>
    </Button>
  );
}
