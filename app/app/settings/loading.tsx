import { CARD_BASE, Skeleton } from "@/components/ui/kit";

export default function SettingsLoading() {
  return (
    <div aria-busy="true" aria-live="polite" className="space-y-8">
      <span className="sr-only">Loading settings…</span>
      <div>
        <Skeleton className="h-3 w-20" />
        <Skeleton className="mt-3 h-7 w-40 rounded-2xl" />
        <Skeleton className="mt-3 h-4 w-80" />
      </div>
      <div className="space-y-2.5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`${CARD_BASE} px-5 py-5`}>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-3 h-3 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
