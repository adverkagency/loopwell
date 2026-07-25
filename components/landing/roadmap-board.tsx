"use client";

import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { Badge } from "./ui";

export type RoadmapItem = {
  title: string;
  desc: string;
  tag: string;
  votes: number;
};

export type RoadmapColumn = {
  status: "Now" | "Next" | "Future";
  items: RoadmapItem[];
};

/**
 * Three-column public roadmap. Votes are local-only for now — there's no votes
 * table yet, so a click registers visually and the count resets on reload.
 */
export function RoadmapBoard({ columns }: { columns: RoadmapColumn[] }) {
  const [voted, setVoted] = useState<Record<string, boolean>>({});

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {columns.map((col) => (
        <div key={col.status} className="rounded-3xl border border-lp-hairline bg-lp-surface p-5">
          <div className="mb-5 flex items-center gap-2 px-1">
            <Badge tone={col.status === "Now" ? "primary" : "neutral"}>{col.status}</Badge>
            <span className="text-xs text-lp-muted">{col.items.length}</span>
          </div>
          <ul className="space-y-3">
            {col.items.map((item) => {
              const isVoted = voted[item.title];
              return (
                <li
                  key={item.title}
                  className="rounded-2xl border border-lp-hairline bg-lp-bg/60 p-4 transition-colors hover:bg-lp-subtle/60"
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => setVoted((v) => ({ ...v, [item.title]: !v[item.title] }))}
                      aria-pressed={isVoted}
                      aria-label={`Vote for ${item.title}`}
                      className={`grid h-14 w-11 shrink-0 place-items-center rounded-xl border text-center transition-colors ${
                        isVoted
                          ? "border-lp-ink bg-lp-ink text-lp-bg"
                          : "border-lp-hairline bg-lp-surface hover:border-lp-ink hover:bg-lp-ink hover:text-lp-bg"
                      }`}
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                      <span className="text-[11px] font-semibold">
                        {item.votes + (isVoted ? 1 : 0)}
                      </span>
                    </button>
                    <div className="min-w-0">
                      <div className="font-display text-lg text-lp-ink">{item.title}</div>
                      <p className="mt-1 text-sm text-lp-muted">{item.desc}</p>
                      <div className="mt-2">
                        <Badge>{item.tag}</Badge>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
