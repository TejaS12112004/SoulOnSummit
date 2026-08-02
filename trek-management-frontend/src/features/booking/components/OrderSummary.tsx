import { Calendar, Lock } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters/currency';

interface OrderSummaryProps {
  trek: {
    title: string;
    image: string;
    basePrice: number;
    discount: number;
  };
  travellers: number;
  selectedBatchId: string | null;
}

export function OrderSummary({ trek, travellers, selectedBatchId }: OrderSummaryProps) {
  const getBatchDate = () => {
    switch (selectedBatchId) {
      case 'batch-1': return 'Jan 15, 2025';
      case 'batch-2': return 'Feb 2, 2025';
      case 'batch-3': return 'Feb 22, 2025';
      case 'batch-4': return 'Mar 8, 2025';
      default: return 'No date selected';
    }
  };

  const batchDate = getBatchDate();
  const subtotal = trek.basePrice * travellers;
  const totalDiscount = trek.discount * travellers;
  const finalTotal = subtotal - totalDiscount;

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '24px',
      padding: '28px',
      boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
      fontFamily: "'Poppins', system-ui, sans-serif",
      position: 'sticky',
      top: '24px',
      width: '100%',
    }}>
      {/* Title */}
      <h2 style={{
        fontSize: '20px',
        fontWeight: 700,
        color: '#0F172A',
        margin: '0 0 18px 0',
        fontFamily: "'Poppins', system-ui, sans-serif",
      }}>
        Order Summary
      </h2>

      {/* Trek Image */}
      <div style={{
        borderRadius: '16px',
        overflow: 'hidden',
        height: '155px',
        marginBottom: '18px',
        background: '#F1F5F9',
      }}>
        <img
          src={trek.image}
          alt={trek.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>

      {/* Trek Title */}
      <h3 style={{
        fontSize: '17px',
        fontWeight: 700,
        color: '#0F172A',
        margin: '0 0 8px 0',
        fontFamily: "'Poppins', system-ui, sans-serif",
      }}>
        {trek.title}
      </h3>

      {/* Date & Persons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '13px',
        color: '#64748B',
        paddingBottom: '16px',
        borderBottom: '1.5px solid #F1F5F9',
        marginBottom: '16px',
        fontFamily: "'Poppins', system-ui, sans-serif",
      }}>
        <Calendar style={{ width: '15px', height: '15px', color: '#A78BFA', flexShrink: 0 }} />
        <span>{batchDate} &middot; {travellers} {travellers === 1 ? 'person' : 'persons'}</span>
      </div>

      {/* Price breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span style={{ color: '#64748B', fontFamily: "'Poppins', system-ui, sans-serif" }}>
            {formatCurrency(trek.basePrice)} &times; {travellers}
          </span>
          <span style={{ color: '#334155', fontFamily: "'Poppins', system-ui, sans-serif" }}>
            {formatCurrency(subtotal)}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span style={{ color: '#64748B', fontFamily: "'Poppins', system-ui, sans-serif" }}>Discount</span>
          <span style={{ color: '#059669', fontWeight: 700, fontFamily: "'Poppins', system-ui, sans-serif" }}>
            -{formatCurrency(totalDiscount)}
          </span>
        </div>
      </div>

      {/* Total */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '16px',
        borderTop: '1.5px solid #F1F5F9',
        marginBottom: '18px',
      }}>
        <span style={{ fontWeight: 700, fontSize: '18px', color: '#0F172A', fontFamily: "'Poppins', system-ui, sans-serif" }}>
          Total
        </span>
        <span style={{ fontWeight: 700, fontSize: '18px', color: '#0F172A', fontFamily: "'Poppins', system-ui, sans-serif" }}>
          {formatCurrency(finalTotal)}
        </span>
      </div>

      {/* Secure payment badge */}
      <div style={{
        background: '#F0FDF4',
        borderRadius: '14px',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
      }}>
        <Lock style={{ width: '15px', height: '15px', color: '#F59E0B', flexShrink: 0, marginTop: '1px' }} />
        <p style={{
          fontSize: '13px',
          color: '#065F46',
          fontWeight: 600,
          margin: 0,
          lineHeight: 1.5,
          fontFamily: "'Poppins', system-ui, sans-serif",
        }}>
          Secure payment &middot; Free cancellation before {batchDate}
        </p>
      </div>
    </div>
  );
}
