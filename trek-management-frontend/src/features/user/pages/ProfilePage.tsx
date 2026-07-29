import { useAuth } from '@/hooks/useAuth'
import { useUserBookings } from '@/features/booking/hooks/useUserBookings'
import { Card } from '@/components/ui/card'
import { Info } from 'lucide-react'
import { QueryErrorState } from '@/components/ui'

export default function ProfilePage() {
  const { user } = useAuth()
  const { data: bookings = [], isLoading, isError, error, refetch } = useUserBookings()

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName) return 'U'
    return `${firstName[0]}${lastName?.[0] || ''}`.toUpperCase()
  }

  const upcomingBookings = bookings.filter(b => b.status === 'CONFIRMED' && new Date(b.startDate) >= new Date())
  const pastBookings = bookings.filter(b => b.status === 'COMPLETED' || new Date(b.startDate) < new Date())

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground mb-2">My Profile</h1>
        <p className="text-muted-foreground text-[0.95rem]">
          View your personal information and account statistics.
        </p>
      </div>

      {/* Profile Header Card */}
      <Card className="p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 border border-border bg-card shadow-sm">
        <div className="w-24 h-24 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-3xl font-display font-bold shadow-md shrink-0">
          {getInitials(user?.firstName, user?.lastName)}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-2xl font-bold text-foreground mb-1">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-muted-foreground mb-1">{user?.email}</p>
          <div className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-full mt-2">
            {user?.roles && user.roles.length > 0 ? user.roles[0].replace('ROLE_', '') : 'MEMBER'}
          </div>
        </div>
        {isError ? (
          <div className="w-full mt-4">
            <QueryErrorState error={error} onRetry={refetch} />
          </div>
        ) : (
          <div className="flex flex-wrap gap-4 sm:gap-8 mt-4 sm:mt-0 text-center justify-center">
          <div>
            <p className="text-3xl font-display font-bold text-foreground">
              {isLoading ? '-' : bookings.length}
            </p>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total</p>
          </div>
          <div>
            <p className="text-3xl font-display font-bold text-foreground">
              {isLoading ? '-' : upcomingBookings.length}
            </p>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Upcoming</p>
          </div>
          <div>
            <p className="text-3xl font-display font-bold text-foreground">
              {isLoading ? '-' : pastBookings.length}
            </p>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Completed</p>
          </div>
        </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Information (Read-only) */}
        <Card className="p-6 border border-border shadow-sm">
          <h3 className="text-lg font-bold text-foreground mb-6">Personal Information</h3>
          
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">First Name</label>
              <div className="p-3 bg-muted rounded-xl text-foreground font-medium text-[0.95rem] border border-border/50">
                {user?.firstName || 'Not provided'}
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Last Name</label>
              <div className="p-3 bg-muted rounded-xl text-foreground font-medium text-[0.95rem] border border-border/50">
                {user?.lastName || 'Not provided'}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Email Address</label>
              <div className="p-3 bg-muted rounded-xl text-foreground font-medium text-[0.95rem] border border-border/50">
                {user?.email}
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-accent/5 rounded-xl border border-accent/10 mt-6">
              <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Profile updates are currently managed by administrators. To change your personal information, please contact support.
              </p>
            </div>
          </div>
        </Card>

        {/* Account Settings (Unsupported Features Informational) */}
        <Card className="p-6 border border-border shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-foreground mb-6">Account Settings</h3>
          
          <div className="space-y-4 flex-1">
            <div className="p-5 border border-border rounded-xl">
              <h4 className="font-semibold text-foreground mb-1">Change Password</h4>
              <p className="text-sm text-muted-foreground mb-3">Update your account password securely.</p>
              <div className="inline-flex px-2.5 py-1 bg-muted text-muted-foreground text-xs font-semibold rounded-md border border-border/50">
                This feature is planned for a future release.
              </div>
            </div>

            <div className="p-5 border border-border rounded-xl">
              <h4 className="font-semibold text-foreground mb-1">Notification Preferences</h4>
              <p className="text-sm text-muted-foreground mb-3">Manage how you receive updates and alerts.</p>
              <div className="inline-flex px-2.5 py-1 bg-muted text-muted-foreground text-xs font-semibold rounded-md border border-border/50">
                This feature is planned for a future release.
              </div>
            </div>

            <div className="p-5 border border-destructive/20 bg-destructive/5 rounded-xl">
              <h4 className="font-semibold text-destructive mb-1">Delete Account</h4>
              <p className="text-sm text-destructive/80 mb-3">Permanently remove your account and all data.</p>
              <div className="inline-flex px-2.5 py-1 bg-destructive/10 text-destructive text-xs font-semibold rounded-md border border-destructive/20">
                Contact support to request deletion
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
