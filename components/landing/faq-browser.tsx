"use client";

import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { FAQ_CATEGORIES, FAQ_ITEMS, type FaqCategory } from "@/lib/marketing/content";

/** Searchable, category-filtered FAQ. Groups stay visible so scanning still works. */
export function FaqBrowser() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<FaqCategory | "All">("All");
  const [open, setOpen] = useState<string | null>(FAQ_ITEMS[0].q);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = FAQ_ITEMS.filter((item) => {
      const inCategory = category === "All" || item.category === category;
      const inQuery =
        !q || item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q);
      return inCategory && inQuery;
    });
    return FAQ_CATEGORIES.map((c) => ({
      category: c,
      items: matches.filter((m) => m.category === c),
    })).filter((g) => g.items.length > 0);
  }, [query, category]);

  const total = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <div className="mx-auto flex max-w-xl items-center gap-2 rounded-full border border-lp-hairline bg-lp-surface px-4 py-3 shadow-soft">
        <Search className="h-4 w-4 shrink-0 text-lp-muted" />
        <input
          aria-label="Search FAQ"
          placeholder="Search questions…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent text-sm text-lp-ink outline-none placeholder:text-lp-muted"
        />
      </div>

      <div className="mt-8">
        <div className="flex flex-wrap justify-center gap-2">
          {(["All", ...FAQ_CATEGORIES] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                category === c
                  ? "border-lp-ink bg-lp-ink text-lp-bg"
                  : "border-lp-hairline bg-lp-surface text-lp-muted hover:text-lp-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {total === 0 ? (
          <p className="mt-16 text-center text-lp-muted">
            No questions match “{query}”. Try a different search, or{" "}
            <a href="/contact" className="text-lp-ink underline underline-offset-4">
              write to us
            </a>
            .
          </p>
        ) : (
          <div className="mt-12 space-y-12">
            {groups.map((group) => (
              <div key={group.category}>
                <div className="mb-4 flex items-baseline justify-between">
                  <h2 className="font-display text-2xl text-lp-ink">{group.category}</h2>
                  <span className="text-xs text-lp-muted">
                    {group.items.length} question{group.items.length === 1 ? "" : "s"}
                  </span>
                </div>
                <div className="divide-y divide-lp-hairline overflow-hidden rounded-3xl border border-lp-hairline bg-lp-surface">
                  {group.items.map((item) => (
                    <div key={item.q}>
                      <button
                        onClick={() => setOpen((o) => (o === item.q ? null : item.q))}
                        aria-expanded={open === item.q}
                        className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition-colors hover:bg-lp-subtle/40"
                      >
                        <span className="font-display text-lg text-lp-ink md:text-xl">{item.q}</span>
                        <span
                          aria-hidden
                          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-lp-hairline transition-transform ${
                            open === item.q ? "rotate-45 bg-lp-ink text-lp-bg" : ""
                          }`}
                        >
                          <Plus className="h-4 w-4" />
                        </span>
                      </button>
                      {open === item.q && (
                        <div className="px-6 pb-6 text-sm leading-relaxed text-lp-muted animate-rise">
                          {item.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
