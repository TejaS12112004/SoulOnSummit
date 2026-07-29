import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { AxiosError } from 'axios'
import authService from '@/services/authService'
import { ROUTES } from '@/constants/routes'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '../schemas/authSchemas'
import { AuthLayout } from '../components/AuthLayout'

export default function ForgotPasswordPage() {
  const [apiError, setApiError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setApiError(null)
    try {
      await authService.forgotPassword({ email: data.email })
      setSuccess(true)
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>
      setApiError(axiosErr.response?.data?.message || 'Failed to send reset link. Please try again.')
    }
  }

  if (success) {
    return (
      <AuthLayout>
        <div className="text-center">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-2xl font-display font-bold text-foreground mb-3">Check your inbox</h2>
          <p className="text-muted-foreground mb-8 text-[0.95rem]">
            We have sent a password reset link to your email address. Please check your inbox and spam folder.
          </p>
          <Link
            to={ROUTES.LOGIN}
            className="flex items-center justify-center w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-xl shadow-md shadow-accent/20 h-12 transition-all active:scale-[0.98]"
          >
            Return to Login
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Forgot Password?"
      subtitle="No worries, we'll send you reset instructions."
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

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-md shadow-accent/20 h-12 text-base transition-all active:scale-[0.98] mt-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Sending link...
            </>
          ) : (
            'Reset password'
          )}
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm font-medium text-muted-foreground mt-8">
        Remembered your password?{' '}
        <Link to={ROUTES.LOGIN} className="text-foreground font-bold hover:text-accent transition-colors">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
