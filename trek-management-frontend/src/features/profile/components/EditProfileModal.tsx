import { useState, type FormEvent } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import userService, { type UpdateProfileRequest } from '@/services/userService';

interface EditProfileModalProps {
  onClose: () => void;
}

export function EditProfileModal({ onClose }: EditProfileModalProps) {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<UpdateProfileRequest>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
    gender: user?.gender || '',
    emergencyContactName: user?.emergencyContactName || '',
    emergencyContactPhone: user?.emergencyContactPhone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    postalCode: user?.postalCode || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Sanitize payload: convert empty strings to undefined
    const payload = Object.fromEntries(
      Object.entries(formData).map(([k, v]) => [k, v === '' ? undefined : v])
    ) as UpdateProfileRequest;

    try {
      await userService.updateProfile(payload);
      await refreshUser();
      onClose();
    } catch (err: any) {
      if (err.errors && err.errors.length > 0) {
        const errorMessages = err.errors.map((e: any) => e.message).join(', ');
        setError(errorMessages);
      } else {
        setError(err.message || 'Failed to update profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
    }}>
      <div style={{
        background: '#fff', borderRadius: '24px', width: '100%', maxWidth: '600px',
        maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 32px', borderBottom: '1px solid #E5E7EB',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1C2B3A', margin: 0, fontFamily: 'inherit' }}>
            Edit Profile
          </h2>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6B7280', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div style={{ padding: '32px', overflowY: 'auto', flex: 1 }}>
          {error && (
            <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '12px 16px', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '24px', fontWeight: 600 }}>
              {error}
            </div>
          )}

          <form id="edit-profile-form" onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            
            {/* First Name */}
            <div>
              <label style={labelStyle}>First Name *</label>
              <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} style={inputStyle} />
            </div>

            {/* Last Name */}
            <div>
              <label style={labelStyle}>Last Name *</label>
              <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} style={inputStyle} />
            </div>

            {/* Phone */}
            <div>
              <label style={labelStyle}>Phone Number</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} />
            </div>

            {/* Date of Birth */}
            <div>
              <label style={labelStyle}>Date of Birth</label>
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} style={inputStyle} />
            </div>

            {/* Gender */}
            <div>
              <label style={labelStyle}>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} style={inputStyle}>
                <option value="">Select</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Emergency Contact Name */}
            <div>
              <label style={labelStyle}>Emergency Contact Name</label>
              <input type="text" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} style={inputStyle} />
            </div>

            {/* Emergency Contact Phone */}
            <div>
              <label style={labelStyle}>Emergency Contact Phone</label>
              <input type="text" name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleChange} style={inputStyle} />
            </div>

            {/* Address */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} style={inputStyle} />
            </div>

            {/* City */}
            <div>
              <label style={labelStyle}>City</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} style={inputStyle} />
            </div>

            {/* State */}
            <div>
              <label style={labelStyle}>State</label>
              <input type="text" name="state" value={formData.state} onChange={handleChange} style={inputStyle} />
            </div>

            {/* Country */}
            <div>
              <label style={labelStyle}>Country</label>
              <input type="text" name="country" value={formData.country} onChange={handleChange} style={inputStyle} />
            </div>

            {/* Postal Code */}
            <div>
              <label style={labelStyle}>Postal Code</label>
              <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} style={inputStyle} />
            </div>

          </form>
        </div>

        {/* Footer */}
        <div style={{
          padding: '20px 32px', borderTop: '1px solid #E5E7EB', background: '#F9FAFB',
          display: 'flex', justifyContent: 'flex-end', gap: '12px'
        }}>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={{
              padding: '12px 24px', background: '#fff', border: '1px solid #E5E7EB',
              color: '#4B5563', borderRadius: '12px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-profile-form"
            disabled={loading}
            style={{
              padding: '12px 28px', background: '#1F4D3A', border: 'none',
              color: '#fff', borderRadius: '12px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#4B5563',
  marginBottom: '6px', fontFamily: 'inherit'
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: '10px',
  border: '1px solid #E5E7EB', background: '#F9FAFB',
  fontSize: '0.9rem', color: '#1C2B3A', fontFamily: 'inherit',
  boxSizing: 'border-box'
};
