import { Calendar, Minus, Plus } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters/currency';
import type { DepartureResponseDto } from '@/types/api';

function fmtDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

interface BookingStep1Props {
  departures: DepartureResponseDto[];
  selectedBatchId: string | null;
  setSelectedBatchId: (id: string) => void;
  travellers: number;
  setTravellers: (count: number) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function BookingStep1({
  departures,
  selectedBatchId,
  setSelectedBatchId,
  travellers,
  setTravellers,
  onContinue,
  onBack,
}: BookingStep1Props) {
  
  // Sort departures by date ascending
  const sortedDepartures = [...(departures || [])].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '24px',
      padding: '40px',
      boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0',
      fontFamily: "'Poppins', system-ui, sans-serif",
      minHeight: '520px',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: 700,
          color: '#0F172A',
          margin: '0 0 6px 0',
          fontFamily: "'Poppins', system-ui, sans-serif",
          lineHeight: 1.2,
        }}>
          Select Your Batch
        </h2>
        <p style={{ fontSize: '14px', color: '#64748B', margin: 0, fontFamily: "'Poppins', system-ui, sans-serif" }}>
          Choose a departure date that works for you.
        </p>
      </div>

      {/* Batch List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        {sortedDepartures.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#64748B', fontSize: '14px', background: '#F8FAFC', borderRadius: '12px' }}>
            No upcoming departures available for this trek.
          </div>
        ) : (
          sortedDepartures.map((batch) => {
            const isSelected = selectedBatchId === batch.id;
            const isFillingFast = batch.isFillingFast;
            const isSoldOut = batch.isSoldOut;
            const price = batch.discountPrice ?? batch.price;
            
            return (
              <button
                key={batch.id}
                onClick={() => !isSoldOut && setSelectedBatchId(batch.id)}
                disabled={isSoldOut}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  borderRadius: '14px',
                  border: `2px solid ${isSelected ? '#1F4D3A' : '#E2E8F0'}`,
                  background: isSelected ? '#F0FDF4' : isSoldOut ? '#F8FAFC' : '#ffffff',
                  cursor: isSoldOut ? 'not-allowed' : 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  width: '100%',
                  opacity: isSoldOut ? 0.6 : 1,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  {/* Radio */}
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: `2px solid ${isSelected ? '#1F4D3A' : '#CBD5E1'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    background: isSoldOut ? '#E2E8F0' : '#fff',
                  }}>
                    {isSelected && (
                      <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: '#1F4D3A',
                      }} />
                    )}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                      <Calendar style={{ width: '14px', height: '14px', color: '#64748B' }} />
                      <span style={{ fontWeight: 700, fontSize: '15px', color: '#0F172A', fontFamily: "'Poppins', system-ui, sans-serif" }}>
                        {fmtDate(batch.startDate)}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#94A3B8', fontFamily: "'Poppins', system-ui, sans-serif" }}>
                      {batch.availableSeats} seats remaining
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  {isSoldOut ? (
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', background: '#F1F5F9', padding: '3px 10px', borderRadius: '999px', fontFamily: "'Poppins', system-ui, sans-serif" }}>
                      Sold Out
                    </span>
                  ) : isFillingFast ? (
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#DC2626', background: '#FEF2F2', padding: '3px 10px', borderRadius: '999px', fontFamily: "'Poppins', system-ui, sans-serif" }}>
                      Filling Fast
                    </span>
                  ) : (
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#16A34A', background: '#F0FDF4', padding: '3px 10px', borderRadius: '999px', fontFamily: "'Poppins', system-ui, sans-serif" }}>
                      Available
                    </span>
                  )}
                  <span style={{ fontWeight: 700, fontSize: '15px', color: '#0F172A', fontFamily: "'Poppins', system-ui, sans-serif" }}>
                    {formatCurrency(price)}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Travellers */}
      <div style={{
        background: '#F8FAFC',
        borderRadius: '14px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '28px',
      }}>
        <span style={{ fontWeight: 600, fontSize: '14px', color: '#0F172A', fontFamily: "'Poppins', system-ui, sans-serif" }}>
          Number of Travellers
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            border: '1.5px solid #E2E8F0',
            borderRadius: '10px',
            background: '#fff',
            overflow: 'hidden',
          }}>
            <button
              onClick={() => setTravellers(Math.max(1, travellers - 1))}
              style={{
                width: '38px',
                height: '38px',
                border: 'none',
                borderRight: '1.5px solid #E2E8F0',
                background: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748B',
              }}
            >
              <Minus style={{ width: '14px', height: '14px' }} />
            </button>
            <span style={{
              width: '44px',
              textAlign: 'center',
              fontWeight: 700,
              fontSize: '15px',
              color: '#0F172A',
              fontFamily: "'Poppins', system-ui, sans-serif",
            }}>
              {travellers}
            </span>
            <button
              onClick={() => setTravellers(Math.min(12, travellers + 1))}
              style={{
                width: '38px',
                height: '38px',
                border: 'none',
                borderLeft: '1.5px solid #E2E8F0',
                background: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748B',
              }}
            >
              <Plus style={{ width: '14px', height: '14px' }} />
            </button>
          </div>
          <span style={{ fontSize: '12px', color: '#94A3B8', whiteSpace: 'nowrap', fontFamily: "'Poppins', system-ui, sans-serif" }}>
            Max 12 per batch
          </span>
        </div>
      </div>

      {/* Footer Buttons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '24px',
        borderTop: '1.5px solid #F1F5F9',
        marginTop: 'auto',
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#94A3B8',
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
          onClick={onContinue}
          disabled={!selectedBatchId}
          style={{
            background: selectedBatchId ? '#F59E0B' : '#D1D5DB',
            color: '#ffffff',
            border: 'none',
            borderRadius: '999px',
            padding: '12px 32px',
            fontWeight: 700,
            fontSize: '15px',
            cursor: selectedBatchId ? 'pointer' : 'not-allowed',
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
