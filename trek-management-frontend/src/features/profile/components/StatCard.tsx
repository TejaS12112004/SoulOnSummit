import type { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  value: string | ReactNode;
  title: string;
  subtitle?: string;
  dotColor?: string;
  valueColor?: string;
}

export function StatCard({ icon, value, title, subtitle, dotColor, valueColor = '#111827' }: StatCardProps) {
  return (
    <div className="bg-card border border-border shadow-sm" style={{
      borderRadius: '16px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '130px',
      position: 'relative'
    }}>
      {/* Top Row: Icon & Optional Dot */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="bg-muted" style={{ 
          width: '40px', height: '40px', borderRadius: '50%', 
          display: 'flex', alignItems: 'center', justifyContent: 'center' 
        }}>
          {icon}
        </div>
        {dotColor && (
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: dotColor }} />
        )}
      </div>

      {/* Bottom Row: Stats */}
      <div style={{ marginTop: '16px' }}>
        <div className={valueColor === '#111827' ? 'text-foreground' : ''} style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'inherit', color: valueColor === '#111827' ? undefined : valueColor, letterSpacing: '-0.02em', lineHeight: 1 }}>
          {value}
        </div>
        <div className="text-foreground" style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '6px', fontFamily: 'inherit' }}>
          {title}
        </div>
        {subtitle && (
          <div className="text-muted-foreground" style={{ fontSize: '0.7rem', marginTop: '2px', fontFamily: 'inherit' }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}
