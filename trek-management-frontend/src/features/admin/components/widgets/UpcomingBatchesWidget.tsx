import type { UpcomingBatch } from '@/hooks/useAdminDashboard';
import { CalendarDays } from 'lucide-react';

interface UpcomingBatchesWidgetProps {
  batches: UpcomingBatch[];
}

export function UpcomingBatchesWidget({ batches }: UpcomingBatchesWidgetProps) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
      gridColumn: '1 / -1',
      overflowX: 'auto'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <CalendarDays style={{ width: 20, height: 20, color: '#3B82F6' }} />
        <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1C2B3A', margin: 0, fontFamily: 'inherit' }}>
          Upcoming Batches
        </h2>
      </div>

      <div style={{ minWidth: '700px' }}>
        {/* Table Header */}
        <div style={{ 
          display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr 1fr 1fr 1.5fr 0.8fr', 
          gap: '16px', borderBottom: '1px solid #EBEBEB', paddingBottom: '12px',
          fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', 
          textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'inherit'
        }}>
          <div>Trek</div>
          <div>Date</div>
          <div>Trek Leader</div>
          <div style={{ textAlign: 'center' }}>Registered</div>
          <div style={{ textAlign: 'center' }}>Capacity</div>
          <div>Fill Rate</div>
          <div style={{ textAlign: 'center' }}>Action</div>
        </div>

        {/* Table Rows */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {batches.map((batch, index) => {
            const fillPercentage = Math.round((batch.registered / batch.capacity) * 100);
            let barColor = '#10B981'; // Green
            if (fillPercentage > 80) barColor = '#EF4444'; // Red (almost full)
            else if (fillPercentage > 50) barColor = '#F59E0B'; // Yellow (filling up)

            return (
              <div key={batch.id} style={{ 
                display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr 1fr 1fr 1.5fr 0.8fr', 
                gap: '16px', alignItems: 'center', padding: '16px 0',
                borderBottom: index !== batches.length - 1 ? '1px solid #F3F4F6' : 'none',
                fontSize: '0.85rem', color: '#4B5563', fontFamily: 'inherit'
              }}>
                <div style={{ fontWeight: 700, color: '#1C2B3A' }}>{batch.trekName}</div>
                <div>{batch.date}</div>
                <div>-</div>
                <div style={{ textAlign: 'center', fontWeight: 700 }}>{batch.registered}</div>
                <div style={{ textAlign: 'center' }}>{batch.capacity}</div>
                
                {/* Progress Bar Column */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ flex: 1, height: '4px', background: '#E5E7EB', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${fillPercentage}%`, height: '100%', background: barColor, borderRadius: '2px' }} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1C2B3A', minWidth: '32px' }}>
                    {fillPercentage}%
                  </span>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <button style={{
                    background: '#fff', border: '1px solid #1F4D3A', color: '#1F4D3A',
                    padding: '6px 14px', borderRadius: '8px', fontSize: '0.75rem',
                    fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#EFF6F2'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#fff'}
                  >
                    Manage
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
