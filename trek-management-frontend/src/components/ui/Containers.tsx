import * as React from "react"
import { cn } from "@/lib/utils"

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType
}

/**
 * PageContainer provides consistent maximum width, centering, and horizontal padding 
 * for the main page content across all viewport sizes.
 */
export function PageContainer({
  className,
  as: Component = "main",
  ...props
}: PageContainerProps) {
  return (
    <Component
      className={cn(
        "container mx-auto px-4 md:px-6 lg:px-8 w-full max-w-7xl",
        className
      )}
      {...props}
    />
  )
}

export interface SectionContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType
  noPadding?: boolean
}

/**
 * SectionContainer defines vertical spacing for logical sections within a page.
 */
export function SectionContainer({
  className,
  as: Component = "section",
  noPadding = false,
  ...props
}: SectionContainerProps) {
  return (
    <Component
      className={cn(
        !noPadding && "py-12 md:py-16 lg:py-24",
        "w-full flex flex-col gap-6 md:gap-8",
        className
      )}
      {...props}
    />
  )
}
