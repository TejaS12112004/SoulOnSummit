import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number | string
  className?: string
}

export function Spinner({ size = 24, className, ...props }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className={cn("flex items-center justify-center", className)}
      {...props}
    >
      <Loader2
        size={size}
        className="animate-spin text-primary"
        aria-hidden="true"
      />
      <span className="sr-only">Loading...</span>
    </div>
  )
}
