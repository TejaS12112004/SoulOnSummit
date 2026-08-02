import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { RevenueData } from '@/hooks/useAdminDashboard';


interface RevenueChartProps {
  data: RevenueData[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
      gridColumn: 'span 2'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1C2B3A', margin: 0, fontFamily: 'inherit' }}>
          Revenue & Bookings
        </h2>
        <select style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '0.8rem', color: '#4B5563', fontFamily: 'inherit' }}>
          <option>Last 7 months</option>
          <option>Last 12 months</option>
        </select>
      </div>

      <div style={{ width: '100%', height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#9CA3AF', fontFamily: 'inherit' }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#9CA3AF', fontFamily: 'inherit' }}
              tickFormatter={(value) => `₹${value / 1000}k`}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', fontFamily: 'inherit' }}
              formatter={(value: any) => [value, 'Revenue']}
            />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#1F4D3A" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: '#1F4D3A' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
