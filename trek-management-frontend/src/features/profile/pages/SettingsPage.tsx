import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import userService from '@/services/userService';
import { toast } from 'sonner';
import { Loader2, Moon, Sun, Monitor, Bell, Shield, Trash2, Key } from 'lucide-react';

export function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  
  const [activeTab, setActiveTab] = useState<'security' | 'notifications' | 'appearance' | 'danger'>('security');
  
  // Security State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Notifications State
  const [notifyBooking, setNotifyBooking] = useState(user?.notifyBookingUpdates ?? true);
  const [notifyUpcoming, setNotifyUpcoming] = useState(user?.notifyUpcomingTreks ?? true);
  const [notifyPromo, setNotifyPromo] = useState(user?.notifyPromotions ?? false);
  const [isUpdatingPrefs, setIsUpdatingPrefs] = useState(false);

  // Danger State
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    try {
      setIsChangingPassword(true);
      await userService.changePassword({ currentPassword, newPassword });
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleUpdatePreferences = async () => {
    try {
      setIsUpdatingPrefs(true);
      await userService.updatePreferences({
        notifyBookingUpdates: notifyBooking,
        notifyUpcomingTreks: notifyUpcoming,
        notifyPromotions: notifyPromo,
      });
      toast.success('Preferences saved successfully');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save preferences');
    } finally {
      setIsUpdatingPrefs(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }
    try {
      setIsDeleting(true);
      await userService.deleteAccount();
      toast.success('Account deleted successfully');
      logout();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete account');
      setIsDeleting(false);
    }
  };

  const tabs = [
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Sun },
    { id: 'danger', label: 'Danger Zone', icon: Trash2 },
  ] as const;

  return (
    <div className="flex flex-col max-w-6xl w-full mx-auto">
      <h1 className="text-2xl font-display font-extrabold text-foreground tracking-tight mb-8">
        Account Settings
      </h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive 
                      ? tab.id === 'danger' 
                        ? 'bg-destructive/10 text-destructive' 
                        : 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1 bg-card rounded-2xl border border-border shadow-sm p-8 md:p-12 min-h-[400px]">
          
          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                  <Key size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Change Password</h2>
                  <p className="text-sm text-muted-foreground">Ensure your account is using a long, random password to stay secure.</p>
                </div>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-5 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="mt-6 w-full flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-colors disabled:opacity-50"
                >
                  {isChangingPassword ? <Loader2 size={20} className="animate-spin" /> : 'Update Password'}
                </button>
              </form>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
                  <Bell size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Notification Preferences</h2>
                  <p className="text-sm text-muted-foreground">Choose what updates you want to receive via email.</p>
                </div>
              </div>

              <div className="space-y-6 max-w-2xl">
                <label className="flex items-center justify-between cursor-pointer p-4 rounded-xl border border-border hover:bg-muted transition-colors">
                  <div>
                    <span className="block font-semibold text-foreground">Booking Updates</span>
                    <span className="block text-sm text-muted-foreground">Payment receipts and itinerary changes</span>
                  </div>
                  <input type="checkbox" checked={notifyBooking} onChange={(e) => setNotifyBooking(e.target.checked)} className="w-5 h-5 accent-primary" />
                </label>
                
                <label className="flex items-center justify-between cursor-pointer p-4 rounded-xl border border-border hover:bg-muted transition-colors">
                  <div>
                    <span className="block font-semibold text-foreground">Upcoming Treks</span>
                    <span className="block text-sm text-muted-foreground">Reminders and packing lists before your trek</span>
                  </div>
                  <input type="checkbox" checked={notifyUpcoming} onChange={(e) => setNotifyUpcoming(e.target.checked)} className="w-5 h-5 accent-primary" />
                </label>

                <label className="flex items-center justify-between cursor-pointer p-4 rounded-xl border border-border hover:bg-muted transition-colors">
                  <div>
                    <span className="block font-semibold text-foreground">Promotions & Wishlist</span>
                    <span className="block text-sm text-muted-foreground">Price drops, new launches, and newsletters</span>
                  </div>
                  <input type="checkbox" checked={notifyPromo} onChange={(e) => setNotifyPromo(e.target.checked)} className="w-5 h-5 accent-primary" />
                </label>

                <button
                  onClick={handleUpdatePreferences}
                  disabled={isUpdatingPrefs}
                  className="w-full flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-colors disabled:opacity-50"
                >
                  {isUpdatingPrefs ? <Loader2 size={20} className="animate-spin" /> : 'Save Preferences'}
                </button>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                  <Sun size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Theme Settings</h2>
                  <p className="text-sm text-muted-foreground">Customize the look and feel of your dashboard.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    theme === 'light' ? 'border-primary bg-primary/5' : 'border-border hover:border-border/80'
                  }`}
                >
                  <Sun size={24} className={theme === 'light' ? 'text-primary' : 'text-muted-foreground'} />
                  <span className={`font-medium ${theme === 'light' ? 'text-primary' : 'text-muted-foreground'}`}>Light</span>
                </button>
                
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border hover:border-border/80'
                  }`}
                >
                  <Moon size={24} className={theme === 'dark' ? 'text-primary' : 'text-muted-foreground'} />
                  <span className={`font-medium ${theme === 'dark' ? 'text-primary' : 'text-muted-foreground'}`}>Dark</span>
                </button>

                <button
                  onClick={() => setTheme('system')}
                  className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    theme === 'system' ? 'border-primary bg-primary/5' : 'border-border hover:border-border/80'
                  }`}
                >
                  <Monitor size={24} className={theme === 'system' ? 'text-primary' : 'text-muted-foreground'} />
                  <span className={`font-medium ${theme === 'system' ? 'text-primary' : 'text-muted-foreground'}`}>System</span>
                </button>
              </div>
            </div>
          )}

          {/* Danger Zone Tab */}
          {activeTab === 'danger' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-destructive/10 rounded-lg text-destructive">
                  <Trash2 size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Delete Account</h2>
                  <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data.</p>
                </div>
              </div>

              <div className="p-8 bg-destructive/10 border border-destructive/20 rounded-2xl max-w-2xl">
                <h3 className="font-semibold text-destructive mb-2">Are you absolutely sure?</h3>
                <p className="text-sm text-destructive/80 mb-6">
                  This action cannot be undone. This will permanently deactivate your account, and you will not be able to log back in. Your active bookings will be preserved for business records but your personal data will be anonymized.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-destructive mb-1">
                      Please type <span className="font-bold font-mono">DELETE</span> to confirm
                    </label>
                    <input
                      type="text"
                      value={deleteConfirmation}
                      onChange={(e) => setDeleteConfirmation(e.target.value)}
                      placeholder="DELETE"
                      className="w-full px-4 py-2.5 rounded-xl border border-destructive/50 bg-background text-foreground focus:ring-2 focus:ring-destructive outline-none transition-all"
                    />
                  </div>
                  
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isDeleting || deleteConfirmation !== 'DELETE'}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={18} />}
                    Delete My Account
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
