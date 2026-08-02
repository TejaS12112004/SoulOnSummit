import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { CategoryData } from '@/hooks/useAdminDashboard';

interface CategoryChartProps {
  data: CategoryData[];
}

export function CategoryChart({ data }: CategoryChartProps) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1C2B3A', margin: '0 0 24px', fontFamily: 'inherit' }}>
        Trek Categories
      </h2>

      <div style={{ width: '100%', height: '220px', position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any) => [value, 'Revenue']}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', fontFamily: 'inherit' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto' }}>
        {data.map((item) => (
          <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }} />
              <span style={{ fontSize: '0.85rem', color: '#4B5563', fontFamily: 'inherit' }}>{item.name}</span>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1C2B3A', fontFamily: 'inherit' }}>
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
