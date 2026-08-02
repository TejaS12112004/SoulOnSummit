import React from 'react';
import type { ParticipantResponseDto } from '@/types/api';

interface BookingStep2Props {
  participants: ParticipantResponseDto[];
  updateParticipant: (index: number, field: string, value: string | number) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function BookingStep2({ participants, updateParticipant, onContinue, onBack }: BookingStep2Props) {
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1.5px solid #E2E8F0',
    fontSize: '14px',
    color: '#0F172A',
    fontFamily: "'Poppins', system-ui, sans-serif",
    outline: 'none',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 700,
    color: '#334155',
    marginBottom: '8px',
    fontFamily: "'Poppins', system-ui, sans-serif",
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  };

  // Basic validation before continuing
  const handleContinue = () => {
    for (let i = 0; i < participants.length; i++) {
      const p = participants[i];
      if (!p.fullName || p.fullName.trim() === '') {
        alert(`Please provide the full name for Traveller ${i + 1}.`);
        return;
      }
      if (!p.age || p.age < 5) {
        alert(`Traveller ${i + 1} must be at least 5 years old.`);
        return;
      }
      if (i === 0 && (!p.email || !p.email.includes('@'))) {
        alert("Please provide a valid email address for the Primary Traveller.");
        return;
      }
    }
    onContinue();
  };

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '24px',
      padding: '40px',
      boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Poppins', system-ui, sans-serif",
      minHeight: '520px',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: 700,
          color: '#0F172A',
          margin: '0 0 6px 0',
          fontFamily: "'Poppins', system-ui, sans-serif",
          lineHeight: 1.2,
        }}>
          Traveller Details
        </h2>
        <p style={{ fontSize: '14px', color: '#64748B', margin: 0, fontFamily: "'Poppins', system-ui, sans-serif" }}>
          Please provide accurate information as it appears on your ID.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginBottom: '32px' }}>
        {participants.map((p, index) => (
          <div key={index} style={{
            background: '#F8FAFC',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #E2E8F0',
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 700,
              color: '#0F172A',
              margin: '0 0 20px 0',
              fontFamily: "'Poppins', system-ui, sans-serif",
            }}>
              Traveller {index + 1} {index === 0 && <span style={{ color: '#64748B', fontSize: '14px', fontWeight: 500 }}>(Primary)</span>}
            </h3>

            {/* Form Grid */}
            <div style={gridStyle}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input
                  type="text"
                  placeholder="As on government ID"
                  style={inputStyle}
                  value={p.fullName}
                  onChange={(e) => updateParticipant(index, 'fullName', e.target.value)}
                />
              </div>
              <div>
                <label style={labelStyle}>Mobile Number {index === 0 && '*'}</label>
                <input
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  style={inputStyle}
                  value={p.phone || ''}
                  onChange={(e) => updateParticipant(index, 'phone', e.target.value)}
                />
              </div>
              <div>
                <label style={labelStyle}>Email Address {index === 0 && '*'}</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  style={inputStyle}
                  value={p.email || ''}
                  onChange={(e) => updateParticipant(index, 'email', e.target.value)}
                />
              </div>
              <div>
                <label style={labelStyle}>Age</label>
                <input
                  type="number"
                  placeholder="Years"
                  style={inputStyle}
                  value={p.age || ''}
                  onChange={(e) => updateParticipant(index, 'age', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <label style={labelStyle}>Gender</label>
                <select 
                  style={{ ...inputStyle, appearance: 'none', background: 'transparent url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E") no-repeat right 16px top 50%', backgroundSize: '10px auto' }}
                  value={p.gender || ''}
                  onChange={(e) => updateParticipant(index, 'gender', e.target.value)}
                >
                  <option value="">Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Spacer to push buttons to the bottom */}
      <div style={{ flex: 1 }} />

      {/* Footer Buttons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '24px',
        marginTop: '16px',
        borderTop: '1.5px solid #F1F5F9',
      }}>
        <button
          onClick={onBack}
          style={{
            background: '#ffffff',
            border: '1.5px solid #E2E8F0',
            borderRadius: '999px',
            padding: '12px 28px',
            cursor: 'pointer',
            color: '#64748B',
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: "'Poppins', system-ui, sans-serif",
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          ← Back
        </button>
        <button
          onClick={handleContinue}
          style={{
            background: '#F59E0B',
            color: '#ffffff',
            border: 'none',
            borderRadius: '999px',
            padding: '12px 32px',
            fontWeight: 700,
            fontSize: '15px',
            cursor: 'pointer',
            fontFamily: "'Poppins', system-ui, sans-serif",
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'background 0.15s ease',
          }}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
