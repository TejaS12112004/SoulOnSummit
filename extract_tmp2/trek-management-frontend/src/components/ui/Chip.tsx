import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const chipVariants = cva(
  "inline-flex items-center justify-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "text-foreground border-border hover:bg-muted/50",
        ghost: "border-transparent text-foreground hover:bg-muted/50",
        success:
          "border-transparent bg-success/15 text-success-foreground hover:bg-success/25",
        warning:
          "border-transparent bg-warning/15 text-warning-foreground hover:bg-warning/25",
      },
      isInteractive: {
        true: "cursor-pointer active:scale-[0.98]",
        false: "cursor-default",
      },
    },
    defaultVariants: {
      variant: "default",
      isInteractive: false,
    },
  }
)

export interface ChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chipVariants> {
  onRemove?: () => void
  icon?: React.ReactNode
}

export function Chip({
  className,
  variant,
  isInteractive,
  onRemove,
  icon,
  children,
  ...props
}: ChipProps) {
  return (
    <div
      className={cn(chipVariants({ variant, isInteractive, className }))}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {onRemove && (
        <button
          type="button"
          className={cn(
            "ml-1 rounded-full outline-none hover:bg-black/10 focus:ring-2 focus:ring-ring dark:hover:bg-white/20 transition-all duration-200 ease-out",
            "flex h-4 w-4 items-center justify-center"
          )}
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          aria-label="Remove"
        >
          <X size={12} className="opacity-70 hover:opacity-100" />
        </button>
      )}
    </div>
  )
}
