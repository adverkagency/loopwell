import { CARD_BASE, Skeleton, SkeletonCard } from "@/components/ui/kit";

export default function ProgressLoading() {
  return (
    <div aria-busy="true" aria-live="polite" className="space-y-8 md:space-y-10">
      <span className="sr-only">Loading your progress…</span>
      <div>
        <Skeleton className="h-3 w-20" />
        <Skeleton className="mt-3 h-7 w-48 rounded-2xl" />
        <Skeleton className="mt-3 h-4 w-72" />
      </div>
      <SkeletonCard lines={2} />
      <div className="grid items-start gap-6 sm:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i} className={`${CARD_BASE} p-6 sm:p-7`}>
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-5 h-36 w-full rounded-2xl" />
          </div>
        ))}
      </div>
      <div className={`${CARD_BASE} p-6 sm:p-7`}>
        <Skeleton className="h-4 w-44" />
        <Skeleton className="mt-5 h-24 w-full rounded-2xl" />
      </div>
    </div>
  );
}
