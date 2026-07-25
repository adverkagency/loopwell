"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

export type QA = { q: string; a: string };

/** Single-open accordion shared by the FAQ, pricing, contact and data-deletion pages. */
export function Accordion({
  items,
  defaultOpen = 0,
  size = "lg",
}: {
  items: QA[];
  defaultOpen?: number;
  size?: "lg" | "xl";
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="divide-y divide-lp-hairline overflow-hidden rounded-3xl border border-lp-hairline bg-lp-surface">
      {items.map((item, i) => (
        <div key={item.q}>
          <button
            onClick={() => setOpen((o) => (o === i ? -1 : i))}
            aria-expanded={open === i}
            className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition-colors hover:bg-lp-subtle/40"
          >
            <span
              className={`font-display text-lp-ink ${
                size === "xl" ? "text-xl" : "text-lg md:text-xl"
              }`}
            >
              {item.q}
            </span>
            <span
              aria-hidden
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-lp-hairline transition-transform ${
                open === i ? "rotate-45 bg-lp-ink text-lp-bg" : ""
              }`}
            >
              <Plus className="h-4 w-4" />
            </span>
          </button>
          {open === i && (
            <div className="px-6 pb-6 text-sm leading-relaxed text-lp-muted animate-rise">{item.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}
