import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("h-full flex flex-col overflow-hidden rounded-2xl border-border/40 bg-card shadow-sm", className)}>
      <div className="relative aspect-[4/3] w-full bg-beige-dark overflow-hidden">
        <Skeleton className="h-full w-full rounded-none" />
        <div className="absolute top-3 left-3 right-3 flex justify-between">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
      
      <CardHeader className="p-5 pb-2">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      
      <CardContent className="p-5 pt-3 pb-4 flex-grow flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-y-2.5 gap-x-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardContent>
      
      <CardFooter className="p-5 pt-0 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-border mt-auto bg-muted">
        <div className="flex flex-col gap-1 w-full sm:w-auto mt-3 sm:mt-0">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="flex flex-row gap-2 w-full sm:w-auto mt-2 sm:mt-0">
          <Skeleton className="h-10 w-full sm:w-28 rounded-xl" />
          <Skeleton className="h-10 w-full sm:w-28 rounded-xl" />
        </div>
      </CardFooter>
    </Card>
  )
}
