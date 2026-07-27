/**
 * BookingPageSkeleton — mirrors the exact layout of BookingPage.
 *
 * Left column:
 *   - Traveller counter skeleton (matches TravellerCounter card height)
 *   - One TravellerCard skeleton (matches expanded card with all field groups)
 *   - Special requests skeleton
 *
 * Right column:
 *   - BookingSidebar skeleton (matches all sidebar sections)
 */

function SkeletonBlock({
  className = '',
  rounded = 'rounded-md',
}: {
  className?: string
  rounded?: string
}) {
  return (
    <div className={`bg-white/5 animate-pulse ${rounded} ${className}`} />
  )
}

/** Skeleton for one input label + field pair */
function FieldSkeleton({ wide = false }: { wide?: boolean }) {
  return (
    <div className={wide ? 'col-span-2' : ''}>
      <SkeletonBlock className="h-3 w-24 mb-2" />
      <SkeletonBlock className="h-10 w-full" />
    </div>
  )
}

export function BookingPageSkeleton() {
  return (
    <div className="min-h-screen bg-beige" aria-busy="true" aria-label="Loading booking page">
      {/* Header skeleton */}
      <div className="bg-white shadow-sm border-b border-white/10 px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <SkeletonBlock className="h-3 w-28 mb-4" />
          <SkeletonBlock className="h-7 w-48 mb-5" />
          {/* Step indicator */}
          <div className="flex items-center gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <SkeletonBlock className="w-6 h-6 shrink-0" rounded="rounded-full" />
                  <SkeletonBlock className="h-3 w-20 hidden sm:block" />
                </div>
                {i < 2 && <SkeletonBlock className="w-8 h-px hidden sm:block" rounded="rounded-none" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Page content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── Left column ── */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* Traveller counter card */}
            <div className="bg-white shadow-sm rounded-2xl border border-white/10 p-5">
              <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                  <SkeletonBlock className="h-5 w-44" />
                  <SkeletonBlock className="h-3 w-36" />
                </div>
                {/* +/- controls */}
                <div className="flex items-center gap-3">
                  <SkeletonBlock className="w-9 h-9" rounded="rounded-full" />
                  <SkeletonBlock className="w-8 h-7" />
                  <SkeletonBlock className="w-9 h-9" rounded="rounded-full" />
                </div>
              </div>
            </div>

            {/* TravellerCard skeleton */}
            <div className="bg-white shadow-sm rounded-2xl border border-white/10 overflow-hidden">
              {/* Card header */}
              <div className="flex items-center gap-3 px-5 py-4">
                <SkeletonBlock className="w-8 h-8 shrink-0" rounded="rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <SkeletonBlock className="h-4 w-32" />
                  <SkeletonBlock className="h-3 w-20" />
                </div>
                <SkeletonBlock className="w-4 h-4" rounded="rounded" />
              </div>

              {/* Card body — field grid */}
              <div className="px-5 pb-5 border-t border-white/10 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full name — spans 2 */}
                  <FieldSkeleton wide />
                  {/* Age */}
                  <FieldSkeleton />
                  {/* Gender */}
                  <FieldSkeleton />
                  {/* Phone */}
                  <FieldSkeleton />
                  {/* Email */}
                  <FieldSkeleton />
                  {/* Medical — spans 2 */}
                  <div className="col-span-2">
                    <SkeletonBlock className="h-3 w-36 mb-2" />
                    <SkeletonBlock className="h-16 w-full" />
                  </div>
                  {/* Trek experience — spans 2 */}
                  <div className="col-span-2">
                    <SkeletonBlock className="h-3 w-32 mb-2" />
                    <SkeletonBlock className="h-16 w-full" />
                  </div>
                </div>

                {/* Emergency contact divider */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <SkeletonBlock className="h-3 w-36 mb-3" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FieldSkeleton />
                    <FieldSkeleton />
                  </div>
                </div>
              </div>
            </div>

            {/* Special requests card */}
            <div className="bg-white shadow-sm rounded-2xl border border-white/10 p-5">
              <SkeletonBlock className="h-5 w-40 mb-1" />
              <SkeletonBlock className="h-3 w-56 mb-3" />
              <SkeletonBlock className="h-20 w-full" />
            </div>
          </div>

          {/* ── Right column — sidebar ── */}
          <div className="hidden lg:block lg:w-[380px] shrink-0">
            <div className="bg-white shadow-sm rounded-2xl border border-white/10 p-6 space-y-5">
              {/* Trek summary */}
              <div className="space-y-1.5">
                <SkeletonBlock className="h-3 w-10" />
                <SkeletonBlock className="h-5 w-full" />
                <SkeletonBlock className="h-3 w-40" />
              </div>

              <div className="border-t border-white/10" />

              {/* Departure */}
              <div className="space-y-1.5">
                <SkeletonBlock className="h-3 w-20" />
                <SkeletonBlock className="h-4 w-48" />
                <SkeletonBlock className="h-3 w-36" />
              </div>

              <div className="border-t border-white/10" />

              {/* Price breakdown */}
              <div className="space-y-2">
                <SkeletonBlock className="h-3 w-28" />
                <div className="flex justify-between">
                  <SkeletonBlock className="h-4 w-36" />
                  <SkeletonBlock className="h-4 w-20" />
                </div>
                <SkeletonBlock className="h-8 w-full" rounded="rounded-lg" />
              </div>

              {/* Grand total */}
              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between items-center">
                  <SkeletonBlock className="h-5 w-24" />
                  <SkeletonBlock className="h-8 w-32" />
                </div>
              </div>

              {/* Secure badge */}
              <SkeletonBlock className="h-9 w-full" rounded="rounded-lg" />

              {/* Terms */}
              <div className="flex items-start gap-3">
                <SkeletonBlock className="w-4 h-4 shrink-0 mt-0.5" rounded="rounded" />
                <div className="space-y-1 flex-1">
                  <SkeletonBlock className="h-3 w-full" />
                  <SkeletonBlock className="h-3 w-3/4" />
                </div>
              </div>

              {/* CTA button */}
              <SkeletonBlock className="h-12 w-full" rounded="rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
