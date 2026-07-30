import { Link, useLocation } from 'react-router-dom';
import { Home, Map, FileText, CalendarDays, KeyRound, User, Settings } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/cn';

const NAV_ITEMS = [
  { path: ROUTES.HOME, icon: Home, label: 'Home' },
  { path: ROUTES.TREKS, icon: Map, label: 'Treks' },
];

export function FloatingNav() {
  const location = useLocation();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <nav className="flex items-center gap-1 p-2 bg-background/80 backdrop-blur-md border border-border rounded-full shadow-lg">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path || 
                          (item.path !== '/' && location.pathname.startsWith(item.path));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.label}
              to={item.path}
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              title={item.label}
              aria-label={item.label}
            >
              <Icon className="w-5 h-5" />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
