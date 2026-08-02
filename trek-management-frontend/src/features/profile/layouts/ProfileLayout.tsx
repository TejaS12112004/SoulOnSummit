import { Outlet, Navigate } from 'react-router-dom';
import { ProfileSidebar } from '../components/ProfileSidebar';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';

export function ProfileLayout() {
  const { isAdmin } = useAuth();

  if (isAdmin) {
    return <Navigate to={ROUTES.ADMIN} replace />;
  }

  return (
    <div className="min-h-screen bg-background pb-20 pt-8">
      <div className="max-w-[1280px] mx-auto px-8 flex gap-8 items-start">
        
        {/* Sidebar - Reduced width */}
        <aside className="w-[250px] shrink-0">
          <ProfileSidebar />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
        
      </div>
    </div>
  );
}
