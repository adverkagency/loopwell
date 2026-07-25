"use client";

import { useState } from "react";
import { Droplets, Minus, Plus } from "lucide-react";

/** Interactive water quick-log card in the "Log in seconds" panel. */
export function WaterCard() {
  const [glasses, setGlasses] = useState(6);

  return (
    <div className="rounded-2xl border border-lp-hairline bg-lp-bg p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Droplets className="h-4 w-4 text-lp-primary" />
          <span className="text-sm font-medium text-lp-ink">Water</span>
        </div>
        <span className="text-xs text-lp-muted">{glasses}/8 glasses</span>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={() => setGlasses((g) => Math.max(0, g - 1))}
          className="grid h-9 w-9 place-items-center rounded-full border border-lp-hairline text-lp-ink transition-colors hover:bg-lp-subtle"
          aria-label="Remove glass"
        >
          <Minus className="h-4 w-4" />
        </button>
        <div className="flex flex-1 items-center gap-1.5">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className={`h-8 flex-1 rounded-md transition-colors ${
                i < glasses ? "bg-lp-primary" : "bg-lp-subtle"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => setGlasses((g) => Math.min(8, g + 1))}
          className="grid h-9 w-9 place-items-center rounded-full bg-lp-ink text-lp-bg transition-colors hover:bg-lp-ink/90"
          aria-label="Add glass"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

