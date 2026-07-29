import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'
import { AxiosError } from 'axios'
import authService from '@/services/authService'
import { ROUTES } from '@/constants/routes'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { resetPasswordSchema, type ResetPasswordFormValues } from '../schemas/authSchemas'
import { AuthLayout } from '../components/AuthLayout'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      setApiError('Invalid or missing reset token.')
      return
    }

    setApiError(null)
    try {
      await authService.resetPassword({
        token,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      })
      setSuccess(true)
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>
      setApiError(axiosErr.response?.data?.message || 'Failed to reset password. The link may have expired.')
    }
  }

  if (success) {
    return (
      <AuthLayout>
        <div className="text-center">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-2xl font-display font-bold text-foreground mb-3">Password updated!</h2>
          <p className="text-muted-foreground mb-8 text-[0.95rem]">
            Your password has been successfully reset. You can now use your new password to log in.
          </p>
          <Link
            to={ROUTES.LOGIN}
            className="flex items-center justify-center w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-xl shadow-md shadow-accent/20 h-12 transition-all active:scale-[0.98]"
          >
            Go to Login
          </Link>
        </div>
      </AuthLayout>
    )
  }

  if (!token) {
    return (
      <AuthLayout>
        <div className="text-center">
          <h2 className="text-xl font-display font-bold text-foreground mb-3">Invalid Link</h2>
          <p className="text-muted-foreground text-sm mb-6">
            The password reset link is invalid or missing the reset token.
          </p>
          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="flex items-center justify-center w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-xl h-11"
          >
            Request new link
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Please enter your new password below."
    >
      {apiError && (
        <div className="mb-6 bg-destructive/10 border border-destructive/20 text-destructive-foreground px-4 py-3 rounded-xl text-sm font-medium">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* New Password */}
        <div className="space-y-1.5">
          <label htmlFor="newPassword" className="block text-[0.85rem] font-semibold text-foreground">
            New Password
          </label>
          <div className="relative">
            <Input
              id="newPassword"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="••••••••"
              aria-invalid={!!errors.newPassword}
              aria-describedby={errors.newPassword ? 'err-password' : undefined}
              className="pr-10"
              {...register('newPassword')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.newPassword && (
            <p id="err-password" className="text-destructive text-xs font-medium">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="block text-[0.85rem] font-semibold text-foreground">
            Confirm Password
          </label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="••••••••"
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={errors.confirmPassword ? 'err-confirm' : undefined}
              className="pr-10"
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p id="err-confirm" className="text-destructive text-xs font-medium">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-md shadow-accent/20 h-12 text-base transition-all active:scale-[0.98] mt-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Updating password...
            </>
          ) : (
            'Reset password'
          )}
        </Button>
      </form>
    </AuthLayout>
  )
}
