import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../components/AdminSidebar';

export function AdminLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FAF9F6', fontFamily: 'inherit' }}>
      
      {/* Sidebar - Fixed to the left */}
      <aside style={{ 
        width: '260px', 
        background: '#133224', // Very dark green
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto'
      }}>
        <AdminSidebar />
      </aside>

      {/* Main Content Area */}
      <main style={{ 
        flex: 1, 
        minWidth: 0, 
        padding: '32px 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <Outlet />
      </main>
      
    </div>
  );
}
