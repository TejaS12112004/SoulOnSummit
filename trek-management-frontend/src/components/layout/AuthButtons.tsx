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
        "hidden lg:inline-flex rounded-[12px] font-bold text-[16px] px-8 h-[46px]",
        isScrolled ? "text-gray-900 hover:bg-gray-100" : "text-white hover:text-white hover:bg-white/10"
      )}
    >
      <Link to="/login">
        Login
      </Link>
    </Button>
  );
}

