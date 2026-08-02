import { useAuth } from '@/hooks/useAuth';
import { Mail, Phone, MapPin, Shield, Edit, Key } from 'lucide-react';

export function AdminProfilePage() {
  const { user } = useAuth();
  const fullName = user ? `${user.firstName} ${user.lastName}` : 'Admin User';
  const email = user?.email || 'admin@soulonsummit.in';

  return (
    <div style={{ maxWidth: '1000px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1C2B3A', margin: '0 0 4px', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
          Admin Profile
        </h1>
        <p style={{ color: '#9CA3AF', fontSize: '0.85rem', margin: 0, fontFamily: 'inherit' }}>
          Manage your administrative account settings and preferences.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '32px' }}>
        
        {/* Left Column: Avatar & Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '32px 24px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <div style={{ 
              width: '120px', height: '120px', borderRadius: '50%', background: '#FCD34D', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px',
              fontSize: '3rem', fontWeight: 800, color: '#1F4D3A'
            }}>
              {fullName.charAt(0)}
            </div>
            
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1C2B3A', margin: '0 0 4px', fontFamily: 'inherit' }}>
              {fullName}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10B981', fontSize: '0.8rem', fontWeight: 700, marginBottom: '24px' }}>
              <Shield style={{ width: 14, height: 14 }} />
              Super Admin
            </div>

            <button style={{
              width: '100%', background: '#F3F4F6', border: 'none', color: '#4B5563',
              padding: '10px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = '#E5E7EB'; e.currentTarget.style.color = '#1C2B3A'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = '#F3F4F6'; e.currentTarget.style.color = '#4B5563'; }}
            >
              <Edit style={{ width: 16, height: 16 }} />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Right Column: Detailed Info & Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1C2B3A', margin: '0 0 24px', fontFamily: 'inherit' }}>
              Contact Information
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  Email Address
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 700, color: '#374151', fontFamily: 'inherit' }}>
                  <Mail style={{ width: 16, height: 16, color: '#9CA3AF' }} />
                  {email}
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  Phone Number
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 700, color: '#374151', fontFamily: 'inherit' }}>
                  <Phone style={{ width: 16, height: 16, color: '#9CA3AF' }} />
                  +91 98765 43210
                </div>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  Location
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 700, color: '#374151', fontFamily: 'inherit' }}>
                  <MapPin style={{ width: 16, height: 16, color: '#9CA3AF' }} />
                  Headquarters - Dehradun, Uttarakhand
                </div>
              </div>
            </div>
          </div>

          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1C2B3A', margin: '0 0 24px', fontFamily: 'inherit' }}>
              Security Settings
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '20px', borderBottom: '1px solid #F3F4F6' }}>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#374151', fontFamily: 'inherit', marginBottom: '4px' }}>
                  Password
                </div>
                <div style={{ fontSize: '0.8rem', color: '#9CA3AF', fontFamily: 'inherit' }}>
                  Last changed 3 months ago
                </div>
              </div>
              <button style={{
                background: '#fff', border: '1px solid #E5E7EB', color: '#374151',
                padding: '8px 16px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => { e.currentTarget.style.border = '1px solid #1F4D3A'; e.currentTarget.style.color = '#1F4D3A'; }}
              onMouseOut={(e) => { e.currentTarget.style.border = '1px solid #E5E7EB'; e.currentTarget.style.color = '#374151'; }}
              >
                <Key style={{ width: 14, height: 14 }} />
                Update
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
