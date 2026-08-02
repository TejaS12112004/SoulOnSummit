import type { RecentActivity } from '@/hooks/useAdminDashboard';
import { Ticket, Star, User, XCircle, MessageSquare } from 'lucide-react';

interface RecentActivityWidgetProps {
  activities: RecentActivity[];
}

export function RecentActivityWidget({ activities }: RecentActivityWidgetProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'booking': return <Ticket style={{ width: 14, height: 14, color: '#EC4899' }} />;
      case 'review': return <Star style={{ width: 14, height: 14, color: '#F59E0B' }} />;
      case 'user': return <User style={{ width: 14, height: 14, color: '#3B82F6' }} />;
      case 'cancellation': return <XCircle style={{ width: 14, height: 14, color: '#EF4444' }} />;
      case 'support': return <MessageSquare style={{ width: 14, height: 14, color: '#8B5CF6' }} />;
      default: return null;
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case 'booking': return '#FDF2F8';
      case 'review': return '#FEF3C7';
      case 'user': return '#EFF6FF';
      case 'cancellation': return '#FEF2F2';
      case 'support': return '#F5F3FF';
      default: return '#F3F4F6';
    }
  };

  return (
    <div style={{
      background: '#fff',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
      gridColumn: 'span 1'
    }}>
      <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1C2B3A', margin: '0 0 24px', fontFamily: 'inherit' }}>
        Recent Activity
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {activities.map((activity) => (
          <div key={activity.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{ 
              width: '32px', height: '32px', borderRadius: '8px', 
              background: getBg(activity.type), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
            }}>
              {getIcon(activity.type)}
            </div>
            
            <div>
              <div style={{ fontSize: '0.85rem', color: '#4B5563', fontFamily: 'inherit', lineHeight: 1.5 }}>
                {activity.message}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#9CA3AF', fontFamily: 'inherit', marginTop: '4px' }}>
                {activity.timeAgo}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
