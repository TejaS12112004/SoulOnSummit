import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  primaryAction?: ReactNode
  secondaryAction?: ReactNode
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  className
}: EmptyStateProps) {
  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-border rounded-2xl bg-card/50",
        className
      )}
    >
      {icon && (
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground">
          {icon}
        </div>
      )}
      
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      
      {description && (
        <p className="text-muted-foreground max-w-md mb-6">
          {description}
        </p>
      )}
      
      {(primaryAction || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {secondaryAction}
          {primaryAction}
        </div>
      )}
    </div>
  )
}
