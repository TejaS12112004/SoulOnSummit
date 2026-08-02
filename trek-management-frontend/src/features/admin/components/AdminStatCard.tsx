import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface AdminStatCardProps {
  icon: ReactNode;
  iconBgColor: string;
  value: string | number;
  label: string;
  growth: number;
}

export function AdminStatCard({ icon, iconBgColor, value, label, growth }: AdminStatCardProps) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '150px',
      position: 'relative'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ 
          width: '40px', height: '40px', borderRadius: '10px', 
          background: iconBgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' 
        }}>
          {icon}
        </div>
        {growth > 0 ? (
          <div style={{ 
            background: '#D1FAE5', color: '#059669', fontSize: '0.75rem', fontWeight: 800,
            padding: '4px 8px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '2px'
          }}>
            <ArrowUpRight style={{ width: 12, height: 12 }} />
            {growth}%
          </div>
        ) : null}
      </div>

      <div style={{ marginTop: '16px' }}>
        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1C2B3A', fontFamily: 'inherit', letterSpacing: '-0.02em', lineHeight: 1 }}>
          {value}
        </div>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#9CA3AF', marginTop: '6px', fontFamily: 'inherit' }}>
          {label}
        </div>
      </div>
    </div>
  );
}
