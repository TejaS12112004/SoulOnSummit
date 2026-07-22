import { Skeleton } from '@/components/ui/skeleton';

export function UpcomingDeparturesSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between flex-wrap gap-4 bg-white/5 border border-white/10 rounded-2xl px-7 py-5"
        >
          <div className="flex-[2] min-w-[180px] space-y-2">
            <Skeleton className="h-5 w-40 bg-white/10" />
            <Skeleton className="h-4 w-28 bg-white/10" />
          </div>
          <Skeleton className="h-6 w-20 rounded bg-white/10" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-3 w-16 bg-white/10" />
            <Skeleton className="h-5 w-20 bg-white/10" />
          </div>
          <div className="flex-1 space-y-1">
            <Skeleton className="h-3 w-10 bg-white/10" />
            <Skeleton className="h-6 w-24 bg-white/10" />
          </div>
          <Skeleton className="h-10 w-28 rounded-xl bg-white/10" />
        </div>
      ))}
    </div>
  );
}
