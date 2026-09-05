import { Check } from 'lucide-react';

interface BookingHeaderProps {
  currentStep: number;
  trekTitle: string;
}

const STEPS = [
  { id: 1, label: 'Batch' },
  { id: 2, label: 'Details' },
  { id: 3, label: 'Emergency' },
  { id: 4, label: 'Payment' },
  { id: 5, label: 'Done!' },
];

export function BookingHeader({ currentStep, trekTitle }: BookingHeaderProps) {
  return (
    <div style={{
      background: '#1F4D3A',
      padding: 'clamp(16px, 4vw, 32px) 16px',
      width: '100%',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      fontFamily: "'Poppins', system-ui, sans-serif",
      boxSizing: 'border-box'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          color: '#D1FAE5',
          fontSize: 'clamp(11px, 2vw, 13px)',
          fontWeight: 500,
          marginBottom: 'clamp(16px, 3vw, 32px)',
          fontFamily: "'Poppins', system-ui, sans-serif",
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          Booking: <span style={{ color: '#ffffff', fontWeight: 700 }}>{trekTitle}</span>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
        }}>
          {/* Connector Line Behind */}
          <div style={{
            position: 'absolute',
            top: '18px',
            left: '10%',
            right: '10%',
            height: '2px',
            background: 'rgba(4, 120, 87, 0.5)',
            zIndex: 0
          }}></div>
          
          {STEPS.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            
            let circleBg = '#2A6650';
            let circleColor = '#D1FAE5';
            
            if (isCompleted) {
              circleBg = '#F59E0B';
              circleColor = '#ffffff';
            } else if (isCurrent) {
              circleBg = '#ffffff';
              circleColor = '#1F4D3A';
            }

            return (
              <div key={step.id} style={{
                position: 'relative',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                flex: 1,
              }}>
                <div style={{
                  width: 'clamp(28px, 5vw, 40px)',
                  height: 'clamp(28px, 5vw, 40px)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'clamp(11px, 2vw, 14px)',
                  fontWeight: 700,
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  background: circleBg,
                  color: circleColor,
                  border: '3px solid #1F4D3A',
                  boxSizing: 'border-box'
                }}>
                  {isCompleted ? <Check style={{ width: '14px', height: '14px' }} strokeWidth={3} /> : step.id}
                </div>
                
                <span style={{
                  fontSize: 'clamp(8px, 1.5vw, 11px)',
                  fontWeight: 600,
                  letterSpacing: '0.025em',
                  textAlign: 'center',
                  fontFamily: "'Poppins', system-ui, sans-serif",
                  color: (isCurrent || isCompleted) ? '#ffffff' : 'rgba(209, 250, 229, 0.7)',
                  lineHeight: 1.2,
                }}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
