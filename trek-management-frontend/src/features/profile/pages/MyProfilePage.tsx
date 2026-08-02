import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { EditProfileModal } from '../components/EditProfileModal';
import { ProfileImageUploadModal } from '../components/ProfileImageUploadModal';
import { format } from 'date-fns';

export function MyProfilePage() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const fullName = user ? `${user.firstName} ${user.lastName}` : 'Guest User';
  const email = user?.email || 'N/A';
  
  // Format Date of Birth
  const formattedDob = user?.dateOfBirth ? format(new Date(user.dateOfBirth), 'MMMM d, yyyy') : 'N/A';
  
  // Format Member Since
  const memberSince = user?.createdAt ? format(new Date(user.createdAt), 'MMMM yyyy') : 'N/A';
  
  // For now, reward points are hardcoded or can be derived in dashboard
  // We'll show a placeholder here or derive from a context later.
  const rewardPoints = 0; // Replace with derived value if needed

  return (
    <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
      
      {/* Left Column: Avatar & Summary Card */}
      <div className="bg-card text-card-foreground border border-border shadow-sm" style={{
        borderRadius: '20px',
        padding: '32px 24px',
        width: '100%',
        maxWidth: '320px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        flexShrink: 0
      }}>
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', border: '3px solid #E5E7EB' }}>
            <img 
              src={user?.profileImageUrl || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200"} 
              alt={fullName}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <button 
            onClick={() => setIsImageModalOpen(true)}
            style={{
              position: 'absolute', bottom: '0', right: '0',
              width: '24px', height: '24px', background: '#F59E0B',
              border: '2px solid #fff', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', padding: 0
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
          </button>
        </div>

        <h2 className="text-foreground" style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px', fontFamily: 'inherit' }}>
          {fullName}
        </h2>
        <p className="text-muted-foreground" style={{ fontSize: '0.85rem', margin: '0 0 24px', fontFamily: 'inherit' }}>
          Trekker since {user?.createdAt ? new Date(user.createdAt).getFullYear() : 'N/A'}
        </p>

        <div className="bg-muted text-muted-foreground" style={{
          borderRadius: '12px',
          padding: '16px',
          width: '100%',
          marginBottom: '24px'
        }}>
          <div className="text-primary" style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1, marginBottom: '6px' }}>
            {rewardPoints}
          </div>
          <div className="text-primary" style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Reward Points
          </div>
        </div>

        <p className="text-muted-foreground" style={{ fontSize: '0.8rem', margin: 0, fontFamily: 'inherit' }}>
          Member since {memberSince}
        </p>
      </div>

      {/* Right Column: Personal Information Card */}
      <div className="bg-card text-card-foreground border border-border shadow-sm" style={{
        borderRadius: '20px',
        padding: '40px',
        flex: 1,
        minWidth: '350px'
      }}>
        <h3 className="text-foreground" style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 32px', fontFamily: 'inherit' }}>
          Personal Information
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '40px' }}>
          <div>
            <div className="text-muted-foreground" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              Full Name
            </div>
            <div className="text-foreground" style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'inherit' }}>
              {fullName}
            </div>
          </div>
          
          <div>
            <div className="text-muted-foreground" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              Phone
            </div>
            <div className="text-foreground" style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'inherit' }}>
              {user?.phone || 'N/A'}
            </div>
          </div>

          <div>
            <div className="text-muted-foreground" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              Email
            </div>
            <div className="text-foreground" style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'inherit' }}>
              {email}
            </div>
          </div>

          <div>
            <div className="text-muted-foreground" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              Date Of Birth
            </div>
            <div className="text-foreground" style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'inherit' }}>
              {formattedDob}
            </div>
          </div>

          <div>
            <div className="text-muted-foreground" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              City
            </div>
            <div className="text-foreground" style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'inherit' }}>
              {user?.city ? `${user.city}${user.state ? `, ${user.state}` : ''}` : 'N/A'}
            </div>
          </div>

          <div>
            <div className="text-muted-foreground" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              Emergency Contact
            </div>
            <div className="text-foreground" style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'inherit' }}>
              {user?.emergencyContactPhone || 'N/A'} {user?.emergencyContactName ? `(${user.emergencyContactName})` : ''}
            </div>
          </div>
        </div>

        <button style={{
          background: '#1F4D3A', border: 'none', color: '#fff',
          padding: '12px 28px', borderRadius: '12px', fontSize: '0.9rem',
          fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          transition: 'background 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.background = '#163A28'}
        onMouseOut={(e) => e.currentTarget.style.background = '#1F4D3A'}
        onClick={() => setIsModalOpen(true)}
        >
          Edit Profile
        </button>
      </div>

      {isModalOpen && <EditProfileModal onClose={() => setIsModalOpen(false)} />}
      {isImageModalOpen && <ProfileImageUploadModal onClose={() => setIsImageModalOpen(false)} />}
    </div>
  );
}

