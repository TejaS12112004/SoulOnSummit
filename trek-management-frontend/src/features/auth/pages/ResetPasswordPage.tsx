import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import authService from '@/services/authService';
import { Lock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      setServerError('Missing reset token. Please request a new password reset link.');
      return;
    }
    
    try {
      setServerError('');
      await authService.resetPassword({ token, newPassword: data.newPassword, confirmPassword: data.confirmPassword });
      setIsSuccess(true);
    } catch (err: any) {
      setServerError(err?.response?.data?.message || 'Failed to reset password. The link might be expired.');
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4 bg-black overflow-hidden" style={{ height: '100vh' }}>
        <div className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 scale-105" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1920")' }} />
        <div className="absolute inset-0 z-0 bg-black/60 backdrop-blur-[2px]" />
        
        <div className="w-full max-w-md relative z-10">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl transition-all duration-300 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500/20 mb-6 ring-1 ring-red-500/30">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Invalid Link</h3>
            <p className="text-gray-300 text-sm mb-8 leading-relaxed">
              The password reset link is missing or invalid. Please request a new link.
            </p>
            <Link
              to="/forgot-password"
              className="w-full bg-[#F59E0B] hover:bg-[#FCD34D] text-[#1C2B3A] font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
            >
              Request new link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-black overflow-hidden" style={{ height: '100vh' }}>
      <div className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 scale-105" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1920")' }} />
      <div className="absolute inset-0 z-0 bg-black/60 backdrop-blur-[2px]" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl transition-all duration-300">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#F59E0B]/20 mb-4 ring-1 ring-[#F59E0B]/30">
              <Lock className="w-7 h-7 text-[#F59E0B]" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 font-display tracking-tight">Set new password</h2>
            <p className="text-gray-300 text-sm">
              Please enter your new password below.
            </p>
          </div>

          {isSuccess ? (
            <div className="text-center animate-in fade-in zoom-in duration-300">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-500/20 mb-6 ring-1 ring-green-500/30">
                <CheckCircle2 className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Password Reset Complete</h3>
              <p className="text-gray-300 text-sm mb-8 leading-relaxed">
                Your password has been successfully updated. You can now sign in with your new password.
              </p>
              <Link
                to="/login"
                className="w-full bg-[#F59E0B] hover:bg-[#FCD34D] text-[#1C2B3A] font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
              >
                Sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 animate-in fade-in duration-300">
              {serverError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                  {serverError}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[14px] font-medium text-gray-200 ml-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute text-gray-400" style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px' }} />
                  <input
                    type="password"
                    {...register('newPassword')}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent focus:bg-white/10 transition-all"
                    style={{ padding: '12px 14px 12px 42px', fontSize: '14px', letterSpacing: '2px' }}
                  />
                </div>
                {errors.newPassword && (
                  <p className="text-red-400 text-xs mt-1 ml-1">{errors.newPassword.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[14px] font-medium text-gray-200 ml-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute text-gray-400" style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px' }} />
                  <input
                    type="password"
                    {...register('confirmPassword')}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent focus:bg-white/10 transition-all"
                    style={{ padding: '12px 14px 12px 42px', fontSize: '14px', letterSpacing: '2px' }}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1 ml-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#F59E0B] hover:bg-[#FCD34D] text-[#1C2B3A] font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center mt-6 shadow-lg shadow-[#F59E0B]/20"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Reset password'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
