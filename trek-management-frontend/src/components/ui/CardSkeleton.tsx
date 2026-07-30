import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-full flex flex-col overflow-hidden rounded-2xl bg-[#1e1c1a] border border-[#2e2b27] shadow-lg",
        className
      )}
    >
      {/* ── Cover Image Skeleton ── */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#2a2723]">
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <Skeleton className="h-4 w-20 rounded-full bg-[#3f3b36]" />
          <Skeleton className="h-4 w-16 rounded-full bg-[#3f3b36]" />
        </div>
      </div>

      {/* ── Card Body Skeleton ── */}
      <div className="flex flex-col flex-grow px-10 pt-6 pb-[55px]">
        {/* Title */}
        <Skeleton className="h-5 w-3/4 mb-2 bg-[#3a3632]" />
        <Skeleton className="h-5 w-1/2 mb-2 bg-[#3a3632]" />

        {/* Location */}
        <div className="flex items-center gap-2 mb-5 mt-2">
          <Skeleton className="h-3.5 w-3.5 rounded-full shrink-0 bg-[#3a3632]" />
          <Skeleton className="h-3 w-2/3 bg-[#3a3632]" />
        </div>

        {/* Duration + Altitude */}
        <div className="flex items-center gap-5 mb-4">
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-3.5 w-3.5 rounded-full shrink-0 bg-[#3a3632]" />
            <Skeleton className="h-3 w-16 bg-[#3a3632]" />
          </div>
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-3.5 w-3.5 rounded-full shrink-0 bg-[#3a3632]" />
            <Skeleton className="h-3 w-16 bg-[#3a3632]" />
          </div>
        </div>

        {/* Star Rating */}
        <div className="flex items-center gap-2 mb-5">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-4 rounded-full bg-[#3a3632]" />
            ))}
          </div>
          <Skeleton className="h-3 w-12 bg-[#3a3632]" />
        </div>

        {/* Spacer pushes footer to bottom */}
        <div className="flex-grow" />

        {/* ── Footer: Price + Next Date ── */}
        <div className="border-t border-[#2e2b27] pt-4">
          {/* Row 1: Price */}
          <div className="flex items-baseline gap-2 mb-1.5">
            <Skeleton className="h-6 w-24 bg-[#3a3632]" />
            <Skeleton className="h-3 w-12 bg-[#3a3632]" />
          </div>
          {/* Row 2: Date */}
          <Skeleton className="h-3 w-3/4 mt-2 bg-[#3a3632]" />
        </div>
      </div>
    </div>
  )
}
