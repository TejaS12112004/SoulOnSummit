import { useEffect, useState, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { AxiosError } from 'axios'
import authService from '@/services/authService'
import { ROUTES } from '@/constants/routes'
import { Button } from '@/components/ui/button'
import { AuthLayout } from '../components/AuthLayout'

type VerifyState = 'LOADING' | 'SUCCESS' | 'ERROR' | 'INVALID'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const email = searchParams.get('email') // Some flows might include this in URL for resend
  
  const [status, setStatus] = useState<VerifyState>('LOADING')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isResending, setIsResending] = useState(false)
  
  const hasAttempted = useRef(false)

  useEffect(() => {
    if (!token) {
      setStatus('INVALID')
      return
    }

    if (hasAttempted.current) return
    hasAttempted.current = true

    const verify = async () => {
      try {
        await authService.verifyEmail(token)
        setStatus('SUCCESS')
      } catch (err) {
        const axiosErr = err as AxiosError<{ message: string }>
        setErrorMessage(axiosErr.response?.data?.message || 'Verification failed or link expired.')
        setStatus('ERROR')
      }
    }

    void verify()
  }, [token])

  const handleResend = async () => {
    if (!email) return
    setIsResending(true)
    try {
      await authService.resendVerification({ email })
      setErrorMessage('A new verification link has been sent to your email.')
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>
      setErrorMessage(axiosErr.response?.data?.message || 'Failed to resend verification link.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <AuthLayout>
      <div className="text-center">
        {status === 'INVALID' && (
          <>
            <h2 className="text-2xl font-display font-bold text-foreground mb-3">Invalid Link</h2>
            <p className="text-muted-foreground mb-8 text-[0.95rem]">
              The verification link is invalid or missing the required token.
            </p>
            <Link
              to={ROUTES.LOGIN}
              className="flex items-center justify-center w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-xl shadow-md shadow-accent/20 h-12 transition-all active:scale-[0.98]"
            >
              Go to Login
            </Link>
          </>
        )}

        {status === 'LOADING' && (
          <div className="py-8">
            <Loader2 className="w-8 h-8 text-accent animate-spin mx-auto mb-6" />
            <h2 className="text-xl font-display font-bold text-foreground mb-2">Verifying your email</h2>
            <p className="text-muted-foreground text-sm">Please wait a moment...</p>
          </div>
        )}

        {status === 'SUCCESS' && (
          <>
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-3">Email Verified!</h2>
            <p className="text-muted-foreground mb-8 text-[0.95rem]">
              Your email has been successfully verified. You can now access all features of your account.
            </p>
            <Link
              to={ROUTES.LOGIN}
              className="flex items-center justify-center w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-xl shadow-md shadow-accent/20 h-12 transition-all active:scale-[0.98]"
            >
              Continue to Login
            </Link>
          </>
        )}

        {status === 'ERROR' && (
          <>
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-3">Verification Failed</h2>
            <p className="text-muted-foreground mb-8 text-[0.95rem]">
              {errorMessage}
            </p>
            
            <div className="space-y-3">
              {email && (
                <Button
                  onClick={handleResend}
                  disabled={isResending}
                  variant="outline"
                  className="w-full h-12 font-semibold"
                >
                  {isResending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Resend Verification Link
                </Button>
              )}
              <Link
                to={ROUTES.LOGIN}
                className="flex items-center justify-center w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-xl shadow-md shadow-accent/20 h-12 transition-all active:scale-[0.98]"
              >
                Return to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </AuthLayout>
  )
}
