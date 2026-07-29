import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'
import { AxiosError } from 'axios'
import authService from '@/services/authService'
import { ROUTES } from '@/constants/routes'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { registerSchema, type RegisterFormValues } from '../schemas/authSchemas'
import { AuthLayout } from '../components/AuthLayout'

export default function RegisterPage() {
  const navigate = useNavigate()
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setApiError(null)
    try {
      const parts = data.fullName.trim().split(/\s+/)
      const firstName = parts.shift() ?? ''
      const lastName = parts.join(' ')

      await authService.register({
        firstName,
        lastName,
        email: data.email,
        password: data.password,
      })
      
      setSuccess(true)
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>
      setApiError(axiosErr.response?.data?.message || 'Registration failed. Please try again.')
    }
  }

  if (success) {
    return (
      <AuthLayout>
        <div className="text-center">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-2xl font-display font-bold text-foreground mb-3">Account Created!</h2>
          <p className="text-muted-foreground mb-8">
            Your account has been successfully created. Please check your email to verify your account.
          </p>
          <Button
            onClick={() => navigate(ROUTES.LOGIN)}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-md shadow-accent/20 h-12 transition-all active:scale-[0.98]"
          >
            Go to Login
          </Button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Join us to book and manage your treks"
    >
      {apiError && (
        <div className="mb-6 bg-destructive/10 border border-destructive/20 text-destructive-foreground px-4 py-3 rounded-xl text-sm font-medium">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Full Name */}
        <div className="space-y-1.5">
          <label htmlFor="fullName" className="block text-[0.85rem] font-semibold text-foreground">
            Full Name
          </label>
          <Input
            id="fullName"
            type="text"
            autoComplete="name"
            placeholder="e.g. Jane Doe"
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? 'err-name' : undefined}
            {...register('fullName')}
          />
          {errors.fullName && (
            <p id="err-name" className="text-destructive text-xs font-medium">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-[0.85rem] font-semibold text-foreground">
            Email
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="hello@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'err-email' : undefined}
            {...register('email')}
          />
          {errors.email && (
            <p id="err-email" className="text-destructive text-xs font-medium">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-[0.85rem] font-semibold text-foreground">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'err-password' : undefined}
              className="pr-10"
              {...register('password')}
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
          {errors.password && (
            <p id="err-password" className="text-destructive text-xs font-medium">
              {errors.password.message}
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

        {/* Terms Acceptance */}
        <div>
          <div className="flex items-start gap-2.5 pt-1">
            <input
              type="checkbox"
              id="termsAccepted"
              aria-invalid={!!errors.termsAccepted}
              aria-describedby={errors.termsAccepted ? 'err-terms' : undefined}
              className="mt-1 w-4 h-4 rounded-sm border border-border bg-input accent-accent cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
              {...register('termsAccepted')}
            />
            <label htmlFor="termsAccepted" className="text-[0.85rem] font-medium text-muted-foreground leading-snug cursor-pointer select-none">
              I agree to the{' '}
              <span className="text-foreground font-semibold">
                Terms of Service
              </span>{' '}
              and{' '}
              <span className="text-foreground font-semibold">
                Privacy Policy
              </span>
            </label>
          </div>
          {errors.termsAccepted && (
            <p id="err-terms" className="text-destructive text-xs font-medium mt-1.5 ml-6.5">
              {errors.termsAccepted.message}
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
              Creating account...
            </>
          ) : (
            'Create account'
          )}
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm font-medium text-muted-foreground mt-8">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="text-foreground font-bold hover:text-accent transition-colors">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
