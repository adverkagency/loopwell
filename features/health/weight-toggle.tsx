"use client";

import { useOptimistic, useTransition } from "react";
import { setWeightModuleEnabled } from "./actions";

export function WeightToggle({ enabled }: { enabled: boolean }) {
  const [, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic(enabled);

  return (
    <label className="flex cursor-pointer items-center justify-between rounded-card border border-hairline bg-elevated px-5 py-4 shadow-rest">
      <span>
        <span className="block text-sm font-semibold text-ink">Weight tracking</span>
        <span className="block text-xs text-ink-muted">
          Off removes the module from Daily entirely.
        </span>
      </span>
      <input
        type="checkbox"
        role="switch"
        checked={optimistic}
        onChange={(e) => {
          const next = e.target.checked;
          startTransition(async () => {
            setOptimistic(next);
            await setWeightModuleEnabled(next);
          });
        }}
        className="h-5 w-9 accent-[var(--lw-teal-500)]"
      />
    </label>
  );
}
