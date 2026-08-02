import React from 'react';
import type { ParticipantResponseDto } from '@/types/api';

interface BookingStep3Props {
  primaryParticipant: ParticipantResponseDto;
  updatePrimaryParticipant: (field: string, value: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function BookingStep3({ primaryParticipant, updatePrimaryParticipant, onContinue, onBack }: BookingStep3Props) {
  const handleContinue = () => {
    if (!primaryParticipant.emergencyContactName || primaryParticipant.emergencyContactName.trim() === '') {
      alert("Please provide the Emergency Contact Person's Name.");
      return;
    }
    if (!primaryParticipant.emergencyContactPhone || primaryParticipant.emergencyContactPhone.trim() === '') {
      alert("Please provide the Emergency Contact Phone Number.");
      return;
    }
    onContinue();
  };

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
          Emergency Contact
        </h2>
        <p style={{ fontSize: '14px', color: '#64748B', margin: 0, fontFamily: "'Poppins', system-ui, sans-serif" }}>
          In case of an emergency, we'll contact this person on your behalf.
        </p>
      </div>

      {/* Form Fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
        <div>
          <label style={labelStyle}>Contact Person's Name</label>
          <input
            type="text"
            placeholder="Full name"
            style={inputStyle}
            value={primaryParticipant.emergencyContactName || ''}
            onChange={(e) => updatePrimaryParticipant('emergencyContactName', e.target.value)}
          />
        </div>
        <div>
          <label style={labelStyle}>Contact Phone Number</label>
          <input
            type="tel"
            placeholder="+91 XXXXX XXXXX"
            style={inputStyle}
            value={primaryParticipant.emergencyContactPhone || ''}
            onChange={(e) => updatePrimaryParticipant('emergencyContactPhone', e.target.value)}
          />
        </div>
        <div>
          <label style={labelStyle}>Relationship</label>
          <input
            type="text"
            placeholder="e.g. Father, Spouse, Friend"
            style={inputStyle}
            value={primaryParticipant.medicalConditions || ''} 
            onChange={(e) => updatePrimaryParticipant('medicalConditions', e.target.value)}
          />
          <span style={{ fontSize: '11px', color: '#94A3B8' }}>* Note: Storing relationship temporarily in medicalConditions due to DTO constraints</span>
        </div>
      </div>

      {/* Alert Box */}
      <div style={{
        background: '#FEF9C3',
        border: '1px solid #FDE047',
        borderRadius: '12px',
        padding: '16px',
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
        marginBottom: '32px',
      }}>
        <span style={{ fontSize: '16px', lineHeight: 1 }}>⚠️</span>
        <p style={{
          margin: 0,
          fontSize: '13px',
          color: '#854D0E',
          fontWeight: 500,
          fontFamily: "'Poppins', system-ui, sans-serif",
          lineHeight: 1.5,
        }}>
          <strong>This information is mandatory for your safety on the trek.</strong><br />
          Please ensure the contact person is reachable.
        </p>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Footer Buttons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '24px',
        marginTop: 'auto',
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
