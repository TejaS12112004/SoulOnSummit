import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Ticket, Map, Heart, CreditCard, 
  Award, User as UserIcon, Settings, LogOut
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';

const SIDEBAR_LINKS = [
  { label: 'Dashboard', href: ROUTES.PROFILE, icon: LayoutDashboard },
  { label: 'My Bookings', href: '/bookings', icon: Ticket },
  { label: 'Upcoming Treks', href: '/upcoming-treks', icon: Map },
  { label: 'Wishlist', href: '/wishlist', icon: Heart },
  { label: 'Payments', href: '/payments', icon: CreditCard },
  { label: 'Certificates', href: '/certificates', icon: Award },
  { label: 'Profile', href: '/my-profile', icon: UserIcon },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function ProfileSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  const initials = `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* User Info Card */}
      <div className="bg-card rounded-2xl p-4 flex items-center gap-3 border border-border shadow-sm">
        <div style={{ 
          width: '42px', height: '42px', borderRadius: '50%', 
          background: '#1F4D3A', color: '#fff', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          fontWeight: 700, fontSize: '1rem', flexShrink: 0 
        }}>
          {initials}
        </div>
        <div className="min-w-0">
          <h3 className="text-[0.95rem] font-bold text-foreground mb-0.5 truncate font-sans">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-[0.75rem] text-muted-foreground m-0 font-sans">
            4 treks completed
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {SIDEBAR_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === ROUTES.PROFILE}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 rounded-xl text-[0.9rem] font-semibold transition-all ${
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon style={{ width: 16, height: 16 }} />
              {link.label}
            </NavLink>
          );
        })}
        
        {/* Logout Button */}
        <button
          onClick={async () => {
            await logout();
            navigate(ROUTES.LOGIN);
          }}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl mt-6 text-[0.9rem] font-semibold text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all text-left w-full"
        >
          <LogOut style={{ width: 16, height: 16 }} />
          Logout
        </button>
      </nav>
    </div>
  );
}
