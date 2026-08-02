import React from 'react';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/utils/formatters/currency';

interface BookingStep5Props {
  trekTitle: string;
  amountPaid: number;
  travellers: number;
  bookingId: string;
}

export function BookingStep5({ trekTitle, amountPaid, travellers, bookingId }: BookingStep5Props) {
  const navigate = useNavigate();

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    fontSize: '14px',
    color: '#334155',
    fontFamily: "'Poppins', system-ui, sans-serif",
  };

  const labelStyle: React.CSSProperties = {
    color: '#64748B',
  };

  const valueStyle: React.CSSProperties = {
    fontWeight: 700,
    color: '#0F172A',
  };

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '24px',
      padding: '40px',
      boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: "'Poppins', system-ui, sans-serif",
      textAlign: 'center',
    }}>
      {/* Success Icon */}
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: '#1F4D3A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px',
        boxShadow: '0 10px 25px -5px rgba(31, 77, 58, 0.4)',
      }}>
        <Check style={{ width: '40px', height: '40px', color: '#ffffff' }} strokeWidth={2.5} />
      </div>

      {/* Header */}
      <h2 style={{
        fontSize: '32px',
        fontWeight: 700,
        color: '#1F4D3A',
        margin: '0 0 12px 0',
        fontFamily: "'Poppins', system-ui, sans-serif",
        lineHeight: 1.2,
      }}>
        Booking Confirmed!
      </h2>
      <p style={{ 
        fontSize: '15px', 
        color: '#64748B', 
        margin: '0 0 32px 0', 
        fontFamily: "'Poppins', system-ui, sans-serif",
        maxWidth: '400px',
        lineHeight: 1.5,
      }}>
        Your adventure is officially booked. A confirmation email has been sent to <strong>your email</strong>.
      </p>

      {/* Booking Summary Box */}
      <div style={{
        background: '#F8FAFC',
        borderRadius: '16px',
        padding: '24px',
        width: '100%',
        textAlign: 'left',
        marginBottom: '32px',
      }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: 700,
          color: '#0F172A',
          margin: '0 0 16px 0',
          fontFamily: "'Poppins', system-ui, sans-serif",
        }}>
          Booking Summary
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={rowStyle}>
            <span style={labelStyle}>Trek</span>
            <span style={valueStyle}>{trekTitle}</span>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Departure</span>
            <span style={valueStyle}>Jan 15, 2025</span>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Travellers</span>
            <span style={valueStyle}>{travellers} {travellers === 1 ? 'person' : 'people'}</span>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Amount Paid</span>
            <span style={valueStyle}>{formatCurrency(amountPaid)}</span>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Booking ID</span>
            <span style={valueStyle}>{bookingId}</span>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        width: '100%',
      }}>
        <button
          onClick={() => navigate('/bookings')} // Placeholder
          style={{
            background: '#1F4D3A',
            color: '#ffffff',
            border: 'none',
            borderRadius: '999px',
            padding: '14px 32px',
            fontWeight: 700,
            fontSize: '15px',
            cursor: 'pointer',
            fontFamily: "'Poppins', system-ui, sans-serif",
            transition: 'opacity 0.2s ease',
          }}
        >
          View My Bookings
        </button>
        <button
          onClick={() => navigate('/')}
          style={{
            background: '#F59E0B',
            color: '#ffffff',
            border: 'none',
            borderRadius: '999px',
            padding: '14px 32px',
            fontWeight: 700,
            fontSize: '15px',
            cursor: 'pointer',
            fontFamily: "'Poppins', system-ui, sans-serif",
            transition: 'opacity 0.2s ease',
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
