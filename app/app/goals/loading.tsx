import { Skeleton, SkeletonCard } from "@/components/ui/kit";

export default function GoalsLoading() {
  return (
    <div aria-busy="true" aria-live="polite" className="space-y-8">
      <span className="sr-only">Loading your goals…</span>
      <div>
        <Skeleton className="h-3 w-20" />
        <Skeleton className="mt-3 h-7 w-40 rounded-2xl" />
        <Skeleton className="mt-3 h-4 w-80" />
      </div>
      <div className="grid items-start gap-4 sm:grid-cols-2">
        {[0, 1, 2].map((i) => (
          <SkeletonCard key={i} lines={2} />
        ))}
      </div>
    </div>
  );
}
