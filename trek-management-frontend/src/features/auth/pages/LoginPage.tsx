import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { AxiosError } from 'axios'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/constants/routes'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { loginSchema, type LoginFormValues } from '../schemas/authSchemas'
import { AuthLayout } from '../components/AuthLayout'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [showPassword, setShowPassword] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || ROUTES.HOME

  const onSubmit = async (data: LoginFormValues) => {
    setApiError(null)
    try {
      await login({ email: data.email, password: data.password })
      navigate(from, { replace: true })
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>
      setApiError(axiosErr.response?.data?.message || 'Failed to login. Please try again.')
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Enter your details to sign in to your account"
    >
      {apiError && (
        <div className="mb-6 bg-destructive/10 border border-destructive/20 text-destructive-foreground px-4 py-3 rounded-xl text-sm font-medium">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
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
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-[0.85rem] font-semibold text-foreground">
              Password
            </label>
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="text-xs font-semibold text-accent hover:underline transition-all"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
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

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-md shadow-accent/20 h-12 text-base transition-all active:scale-[0.98] mt-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm font-medium text-muted-foreground mt-8">
        Don't have an account?{' '}
        <Link to={ROUTES.REGISTER} className="text-foreground font-bold hover:text-accent transition-colors">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  )
}
