import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { Card } from '@/components/ui/card'

interface AuthLayoutProps {
  title?: string
  subtitle?: string
  children: ReactNode
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 pb-20">
      <div className="w-full max-w-[420px]">
        {/* Brand/Header */}
        <div className="text-center mb-8">
          <Link
            to={ROUTES.HOME}
            className="inline-block text-2xl font-display font-bold text-foreground mb-6 hover:opacity-80 transition-opacity"
          >
            SoulOnSummit.
          </Link>
          {title && (
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground tracking-tight mb-2">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-muted-foreground text-[0.95rem]">
              {subtitle}
            </p>
          )}
        </div>

        {/* Card Wrapper */}
        <Card className="p-6 sm:p-8 shadow-sm">
          {children}
        </Card>
      </div>
    </div>
  )
}
