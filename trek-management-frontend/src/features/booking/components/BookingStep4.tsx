import React, { useState } from 'react';
import { CreditCard, Landmark, Smartphone } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters/currency';
import type { CreateBookingResponseDto } from '@/types/api';

interface BookingStep4Props {
  totalPrice: number;
  onCreateBooking: () => Promise<CreateBookingResponseDto | undefined>;
  isPending: boolean;
  onSuccess: () => void;
  onBack: () => void;
}

export function BookingStep4({ totalPrice, onCreateBooking, isPending, onSuccess, onBack }: BookingStep4Props) {
  const [paymentType, setPaymentType] = useState<'full' | 'advance'>('full');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'netbanking' | 'upi'>('card');
  const [agreed, setAgreed] = useState(false);

  const advanceAmount = Math.round(totalPrice * 0.3);
  const amountToPay = paymentType === 'full' ? totalPrice : advanceAmount;

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

  const handlePay = async () => {
    if (!agreed) return;
    
    try {
      const res = await onCreateBooking();
      if (!res) return;

      // Load Razorpay script dynamically
      const scriptLoaded = await new Promise((resolve) => {
        if ((window as any).Razorpay) {
          resolve(true);
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });

      if (!scriptLoaded) {
        alert('Failed to load Razorpay SDK. Please check your internet connection.');
        return;
      }

      // Configure Razorpay Options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || '', // Fallback to empty string, it will throw an error from Razorpay if empty
        amount: amountToPay * 100, // Amount is in currency subunits (paise)
        currency: 'INR',
        name: 'Trek Management',
        description: `Booking for ${res.bookingReference}`,
        order_id: res.razorpayOrderId,
        handler: async function (response: any) {
          console.log('Payment success. Payment ID:', response.razorpay_payment_id);
          
          try {
            const bookingService = (await import('@/services/bookingService')).default;
            await bookingService.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });
            // Proceed to the success page!
            onSuccess();
          } catch (verifyError) {
            console.error('Payment verification failed on backend:', verifyError);
            alert('Your payment was captured by Razorpay, but verification failed on our server. Please contact support.');
          }
        },
        prefill: {
          name: 'Trekker Name',
          email: 'trekker@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#1F4D3A',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        console.error('Payment failed', response.error);
        alert('Payment failed. Reason: ' + response.error.description);
      });
      rzp.open();

    } catch (error: any) {
      console.error('Payment failed', error);
      
      let errorMsg = 'Failed to create booking. Please make sure you are logged in and all fields are filled correctly.';
      if (error?.message) {
        errorMsg = error.message;
      }
      if (error?.status === 401 || error?.status === 403) {
        errorMsg = 'You must be logged in to book a trek. Please log in and try again.';
      }
      
      alert(errorMsg);
    }
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
          Secure Payment
        </h2>
        <p style={{ fontSize: '14px', color: '#64748B', margin: 0, fontFamily: "'Poppins', system-ui, sans-serif" }}>
          Your payment is secured with 256-bit SSL encryption.
        </p>
      </div>

      {/* Payment Type Selection */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
        <div 
          onClick={() => setPaymentType('full')}
          style={{
            border: `2px solid ${paymentType === 'full' ? '#1F4D3A' : '#E2E8F0'}`,
            background: paymentType === 'full' ? '#F0FDF4' : '#ffffff',
            borderRadius: '16px',
            padding: '16px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{
              width: '18px', height: '18px', borderRadius: '50%',
              border: `2px solid ${paymentType === 'full' ? '#1F4D3A' : '#CBD5E1'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff'
            }}>
              {paymentType === 'full' && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1F4D3A' }} />}
            </div>
            <span style={{ fontWeight: 700, fontSize: '15px', color: '#0F172A' }}>
              Pay Full &mdash; {formatCurrency(totalPrice)}
            </span>
          </div>
          <p style={{ margin: '0 0 0 30px', fontSize: '12px', color: '#64748B' }}>
            Best value, no additional charges
          </p>
        </div>

        <div 
          onClick={() => setPaymentType('advance')}
          style={{
            border: `2px solid ${paymentType === 'advance' ? '#1F4D3A' : '#E2E8F0'}`,
            background: paymentType === 'advance' ? '#F0FDF4' : '#ffffff',
            borderRadius: '16px',
            padding: '16px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{
              width: '18px', height: '18px', borderRadius: '50%',
              border: `2px solid ${paymentType === 'advance' ? '#1F4D3A' : '#CBD5E1'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff'
            }}>
              {paymentType === 'advance' && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1F4D3A' }} />}
            </div>
            <span style={{ fontWeight: 700, fontSize: '15px', color: '#0F172A' }}>
              Pay Advance &mdash; {formatCurrency(advanceAmount)}
            </span>
          </div>
          <p style={{ margin: '0 0 0 30px', fontSize: '12px', color: '#64748B' }}>
            30% now, rest before trek
          </p>
        </div>
      </div>

      {/* Payment Methods */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <button
          onClick={() => setPaymentMethod('card')}
          style={{
            flex: 1, padding: '12px', borderRadius: '12px',
            border: `1.5px solid ${paymentMethod === 'card' ? '#3B82F6' : '#E2E8F0'}`,
            background: paymentMethod === 'card' ? '#EFF6FF' : '#ffffff',
            color: paymentMethod === 'card' ? '#1D4ED8' : '#64748B',
            fontWeight: 600, fontSize: '14px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            fontFamily: "'Poppins', system-ui, sans-serif", transition: 'all 0.2s ease'
          }}
        >
          <CreditCard style={{ width: '18px', height: '18px' }} /> Card
        </button>
        <button
          onClick={() => setPaymentMethod('netbanking')}
          style={{
            flex: 1, padding: '12px', borderRadius: '12px',
            border: `1.5px solid ${paymentMethod === 'netbanking' ? '#3B82F6' : '#E2E8F0'}`,
            background: paymentMethod === 'netbanking' ? '#EFF6FF' : '#ffffff',
            color: paymentMethod === 'netbanking' ? '#1D4ED8' : '#64748B',
            fontWeight: 600, fontSize: '14px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            fontFamily: "'Poppins', system-ui, sans-serif", transition: 'all 0.2s ease'
          }}
        >
          <Landmark style={{ width: '18px', height: '18px' }} /> Net Banking
        </button>
        <button
          onClick={() => setPaymentMethod('upi')}
          style={{
            flex: 1, padding: '12px', borderRadius: '12px',
            border: `1.5px solid ${paymentMethod === 'upi' ? '#3B82F6' : '#E2E8F0'}`,
            background: paymentMethod === 'upi' ? '#EFF6FF' : '#ffffff',
            color: paymentMethod === 'upi' ? '#1D4ED8' : '#64748B',
            fontWeight: 600, fontSize: '14px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            fontFamily: "'Poppins', system-ui, sans-serif", transition: 'all 0.2s ease'
          }}
        >
          <Smartphone style={{ width: '18px', height: '18px' }} /> UPI
        </button>
      </div>

      {/* Card Details Form (Design Facade - Razorpay will actually handle this) */}
      {paymentMethod === 'card' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px', opacity: 0.8 }}>
          <div>
            <label style={labelStyle}>Card Number</label>
            <input type="text" placeholder="1234 5678 9012 3456" style={inputStyle} readOnly />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Cardholder Name</label>
              <input type="text" placeholder="Name on card" style={inputStyle} readOnly />
            </div>
            <div>
              <label style={labelStyle}>Expiry Date</label>
              <input type="text" placeholder="MM / YY" style={inputStyle} readOnly />
            </div>
            <div>
              <label style={labelStyle}>CVV</label>
              <input type="password" placeholder="•••" style={inputStyle} readOnly />
            </div>
          </div>
        </div>
      )}

      {/* Terms & Conditions */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: '12px',
        paddingTop: '24px', borderTop: '1.5px solid #F1F5F9', marginBottom: '32px'
      }}>
        <input 
          type="checkbox" 
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          style={{
            marginTop: '3px',
            width: '18px', height: '18px',
            cursor: 'pointer'
          }} 
        />
        <p style={{ margin: 0, fontSize: '13px', color: '#64748B', lineHeight: 1.5, fontFamily: "'Poppins', system-ui, sans-serif" }}>
          I agree to the <span style={{ color: '#1F4D3A', fontWeight: 600 }}>Terms & Conditions</span>, <span style={{ color: '#1F4D3A', fontWeight: 600 }}>Cancellation Policy</span>, and confirm that all information provided is accurate.
        </p>
      </div>

      {/* Footer Buttons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
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
          onClick={handlePay}
          disabled={!agreed || isPending}
          style={{
            background: agreed ? '#F59E0B' : '#FCD34D',
            color: '#ffffff',
            border: 'none',
            borderRadius: '999px',
            padding: '12px 32px',
            fontWeight: 700,
            fontSize: '15px',
            cursor: (agreed && !isPending) ? 'pointer' : 'not-allowed',
            fontFamily: "'Poppins', system-ui, sans-serif",
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'background 0.15s ease',
            opacity: isPending ? 0.7 : 1,
          }}
        >
          {isPending ? 'Processing...' : `Pay ${formatCurrency(amountToPay)}`}
        </button>
      </div>
    </div>
  );
}
