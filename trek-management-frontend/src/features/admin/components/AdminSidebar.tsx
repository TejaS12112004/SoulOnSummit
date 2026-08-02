import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Mountain, Ticket, Users, CreditCard, 
  Tag, Star, FileText, BarChart3, Settings, LogOut
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';

const MAIN_MENU = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Treks', href: '/admin/treks', icon: Mountain },
  { label: 'Bookings', href: '/admin/bookings', icon: Ticket },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Payments', href: '/admin/payments', icon: CreditCard },
  { label: 'Coupons', href: '/admin/coupons', icon: Tag },
  { label: 'Reviews', href: '/admin/reviews', icon: Star },
  { label: 'Blogs', href: '/admin/blogs', icon: FileText },
  { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px 20px' }}>
      
      {/* Brand / Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', padding: '0 12px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#25503b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Mountain style={{ width: 18, height: 18, color: '#FCD34D' }} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: 'var(--font-display)' }}>
            Soul On Summit
          </h1>
          <p style={{ fontSize: '0.65rem', color: '#FCD34D', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, fontWeight: 700 }}>
            Admin Panel
          </p>
        </div>
      </div>

      <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#5b7869', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', padding: '0 12px' }}>
        Main Menu
      </div>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        {MAIN_MENU.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === '/admin'}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '12px 16px', borderRadius: '12px',
                fontSize: '0.9rem', fontWeight: 600, fontFamily: 'inherit',
                textDecoration: 'none', transition: 'all 0.2s',
                background: isActive ? '#1F4D3A' : 'transparent',
                color: isActive ? '#fff' : '#a3b8ad',
                borderLeft: isActive ? '3px solid #F59E0B' : '3px solid transparent',
              })}
            >
              <Icon style={{ width: 18, height: 18, color: link.href === '/admin' ? '#FCD34D' : 'inherit' }} />
              {link.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Admin User / Logout (Bottom) */}
      <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
        <NavLink 
          to="/admin/profile"
          style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', marginBottom: '24px',
            textDecoration: 'none', borderRadius: '12px', transition: 'background 0.2s',
            background: isActive ? '#1F4D3A' : 'transparent',
          })}
          onMouseOver={(e) => { if (!e.currentTarget.style.background.includes('1F4D3A')) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
          onMouseOut={(e) => { if (!e.currentTarget.style.background.includes('1F4D3A')) e.currentTarget.style.background = 'transparent' }}
        >
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#25503b', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
            A
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Admin User
            </div>
            <div style={{ fontSize: '0.75rem', color: '#a3b8ad', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              admin@soulonsummit.in
            </div>
          </div>
        </NavLink>

        <button
          onClick={async () => {
            await logout();
            navigate(ROUTES.LOGIN);
          }}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '10px 12px', borderRadius: '10px',
            fontSize: '0.85rem', fontWeight: 600, fontFamily: 'inherit',
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: '#a3b8ad', transition: 'color 0.2s', width: '100%', textAlign: 'left'
          }}
          onMouseOver={(e) => e.currentTarget.style.color = '#EF4444'}
          onMouseOut={(e) => e.currentTarget.style.color = '#a3b8ad'}
        >
          <LogOut style={{ width: 16, height: 16 }} />
          Exit Admin
        </button>
      </div>
      
    </div>
  );
}
