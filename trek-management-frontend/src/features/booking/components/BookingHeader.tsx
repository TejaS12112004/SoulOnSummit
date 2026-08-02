import { Check } from 'lucide-react';

interface BookingHeaderProps {
  currentStep: number;
  trekTitle: string;
}

const STEPS = [
  { id: 1, label: 'Select Batch' },
  { id: 2, label: 'Traveller Details' },
  { id: 3, label: 'Emergency Contact' },
  { id: 4, label: 'Payment' },
  { id: 5, label: 'Confirmed!' },
];

export function BookingHeader({ currentStep, trekTitle }: BookingHeaderProps) {
  return (
    <div style={{
      background: '#1F4D3A',
      padding: '32px 16px',
      width: '100%',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      fontFamily: "'Poppins', system-ui, sans-serif",
      boxSizing: 'border-box'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          color: '#D1FAE5',
          fontSize: '13px',
          fontWeight: 500,
          marginBottom: '32px',
          fontFamily: "'Poppins', system-ui, sans-serif",
        }}>
          Booking: <span style={{ color: '#ffffff', fontWeight: 700 }}>{trekTitle}</span>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {/* Connector Line Behind */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '10%',
            right: '10%',
            height: '2px',
            background: 'rgba(4, 120, 87, 0.5)',
            zIndex: 0
          }}></div>
          
          {STEPS.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            
            let circleBg = '#2A6650'; // Default / Future
            let circleColor = '#D1FAE5';
            
            if (isCompleted) {
              circleBg = '#F59E0B'; // Orange completed
              circleColor = '#ffffff';
            } else if (isCurrent) {
              circleBg = '#ffffff'; // White current
              circleColor = '#1F4D3A';
            }

            return (
              <div key={step.id} style={{
                position: 'relative',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                width: '120px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 700,
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  background: circleBg,
                  color: circleColor,
                  border: '4px solid #1F4D3A', // Matches background to cut into the line
                  boxSizing: 'border-box'
                }}>
                  {isCompleted ? <Check style={{ width: '18px', height: '18px' }} strokeWidth={3} /> : step.id}
                </div>
                
                <span style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.025em',
                  textAlign: 'center',
                  fontFamily: "'Poppins', system-ui, sans-serif",
                  color: (isCurrent || isCompleted) ? '#ffffff' : 'rgba(209, 250, 229, 0.7)'
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
