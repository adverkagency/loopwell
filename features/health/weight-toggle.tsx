"use client";

import { useOptimistic, useTransition } from "react";
import { Scale } from "lucide-react";
import { setWeightModuleEnabled } from "./actions";
import { CARD_BASE } from "@/components/ui/kit";

export function WeightToggle({ enabled }: { enabled: boolean }) {
  const [, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic(enabled);

  return (
    <label
      className={`${CARD_BASE} flex cursor-pointer items-center gap-4 px-5 py-4`}
    >
      <span
        className={`grid size-10 shrink-0 place-items-center rounded-2xl transition-colors duration-200 ${
          optimistic
            ? "bg-accent-soft text-accent"
            : "bg-secondary text-muted-foreground"
        }`}
      >
        <Scale aria-hidden className="size-[18px]" strokeWidth={1.75} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-semibold">Weight tracking</span>
        <span className="block text-[12px] text-muted-foreground">
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
        className="peer sr-only"
      />
      {/* Switch track — iOS-style, focus ring comes from the sibling input */}
      <span
        aria-hidden
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--accent)] ${
          optimistic ? "bg-accent" : "bg-border-strong/50"
        }`}
      >
        <span
          className={`absolute top-1 size-5 rounded-full bg-surface shadow-[var(--shadow-e1)] transition-all duration-200 ease-[var(--ease-calm)] ${
            optimistic ? "left-6" : "left-1"
          }`}
        />
      </span>
    </label>
  );
}
