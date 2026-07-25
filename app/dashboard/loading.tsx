import { CARD_BASE, Skeleton } from "@/components/ui/kit";

/** Dashboard skeleton — mirrors the real grid so nothing jumps on hydration. */
export default function DailyLoading() {
  return (
    <div aria-busy="true" aria-live="polite" className="space-y-8 md:space-y-10">
      <span className="sr-only">Loading your dashboard…</span>

      <section className={`${CARD_BASE} p-6 sm:p-8 md:p-10`}>
        <div className="flex flex-col-reverse items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full max-w-xl">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="mt-4 h-7 w-4/5 rounded-2xl" />
            <Skeleton className="mt-3 h-4 w-3/5" />
            <div className="mt-7 flex gap-2.5">
              <Skeleton className="h-11 w-32" />
              <Skeleton className="h-11 w-32" />
            </div>
          </div>
          <Skeleton className="mx-auto size-40 shrink-0 sm:size-44" />
        </div>
      </section>

      <div className="grid items-start gap-8 md:gap-10 lg:grid-cols-12 [&>*]:min-w-0">
        <section className="space-y-4 lg:col-span-7">
          <Skeleton className="h-4 w-36" />
          <div className="space-y-2.5">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={`${CARD_BASE} flex items-center gap-4 p-4 sm:p-5`}>
                <Skeleton className="size-6 shrink-0" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-12" />
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4 lg:col-span-5">
          <Skeleton className="h-4 w-36" />
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={`${CARD_BASE} p-4 sm:p-5`}>
                <Skeleton className="h-3 w-16" />
                <Skeleton className="mt-3 h-5 w-24 rounded-xl" />
                <Skeleton className="mt-4 h-9 w-full rounded-2xl" />
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid items-start gap-8 md:gap-10 lg:grid-cols-12 [&>*]:min-w-0">
        <div className={`${CARD_BASE} p-6 sm:p-8 lg:col-span-8`}>
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-2 h-3 w-64" />
          <Skeleton className="mt-8 h-[200px] w-full rounded-2xl" />
        </div>
        <div className="space-y-2.5 lg:col-span-4">
          <div className={`${CARD_BASE} p-6 sm:p-7`}>
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-4 h-5 w-full rounded-xl" />
            <Skeleton className="mt-3 h-5 w-2/3 rounded-xl" />
          </div>
          <div className={`${CARD_BASE} p-6 sm:p-7`}>
            <Skeleton className="h-4 w-28" />
            <div className="mt-5 space-y-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-1.5 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
