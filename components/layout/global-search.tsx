"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Dumbbell,
  Search,
  Smile,
  SquareCheckBig,
  Target,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import type { SearchHit } from "@/app/api/search/route";

const ICONS: Record<SearchHit["type"], LucideIcon> = {
  habit: SquareCheckBig,
  goal: Target,
  food: Utensils,
  workout: Dumbbell,
  journal: BookOpen,
  mood: Smile,
};

/**
 * Search across the user's own habits, goals, and logs. The one search
 * surface in the app besides food lookup — deliberately scoped to things the
 * user wrote, so it never turns into a discovery feed.
 *
 * Combobox pattern: ↑/↓ move, Enter opens, Escape closes, ⌘K / Ctrl-K focuses.
 */
export function GlobalSearch({ className = "" }: { className?: string }) {
  const router = useRouter();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestId = useRef(0);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchHit[]>([]);
  /** The query `results` belongs to — drives "searching" without a status flag. */
  const [searchedFor, setSearchedFor] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    const q = query.trim();
    debounce.current = setTimeout(
      async () => {
        const id = ++requestId.current;
        if (q.length < 2) {
          setResults([]);
          setSearchedFor(q);
          return;
        }
        let hits: SearchHit[] = [];
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
          const data = (await res.json()) as { results?: SearchHit[] };
          hits = data.results ?? [];
        } catch {
          hits = [];
        }
        // Ignore a slow response that lost the race to a newer keystroke
        if (id !== requestId.current) return;
        setResults(hits);
        setSearchedFor(q);
        setActive(0);
      },
      q.length < 2 ? 0 : 250
    );
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [query]);

  // ⌘K / Ctrl-K from anywhere in the app
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Clicking away closes the panel without clearing what was typed
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, [open]);

  function go(hit: SearchHit) {
    setOpen(false);
    setQuery("");
    setResults([]);
    inputRef.current?.blur();
    router.push(hit.href);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[active]);
    }
  }

  const trimmed = query.trim();
  const showPanel = open && trimmed.length >= 2;
  const searching = trimmed !== searchedFor;

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <label className="sr-only" htmlFor={`${listId}-input`}>
        Search Loopwell
      </label>
      <div className="relative">
        <Search
          aria-hidden
          strokeWidth={1.75}
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <input
          id={`${listId}-input`}
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            showPanel && results.length > 0 ? `${listId}-opt-${active}` : undefined
          }
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search habits, goals, logs…"
          className="h-10 w-full rounded-full bg-secondary pl-9 pr-3 text-[13px] text-foreground ring-1 ring-border transition-all duration-200 placeholder:text-muted-foreground focus:bg-surface focus:outline-none focus:ring-2 focus:ring-ring/45"
        />
      </div>

      {showPanel ? (
        <div className="drawer-in absolute left-0 right-0 top-[calc(100%+0.5rem)] z-40 overflow-hidden rounded-2xl bg-surface shadow-[var(--shadow-e3)] ring-1 ring-border">
          {searching && results.length === 0 ? (
            <p className="px-4 py-3 text-[13px] text-muted-foreground">Searching…</p>
          ) : results.length === 0 ? (
            <p className="px-4 py-3 text-[13px] text-muted-foreground">
              Nothing matches “{trimmed}”.
            </p>
          ) : (
            <ul id={listId} role="listbox" aria-label="Search results" className="max-h-[60vh] overflow-y-auto py-1">
              {results.map((hit, i) => {
                const Icon = ICONS[hit.type];
                return (
                  <li
                    key={`${hit.type}-${hit.href}-${hit.title}-${i}`}
                    id={`${listId}-opt-${i}`}
                    role="option"
                    aria-selected={i === active}
                  >
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onClick={() => go(hit)}
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        i === active ? "bg-accent-soft" : ""
                      }`}
                    >
                      <Icon
                        aria-hidden
                        strokeWidth={1.75}
                        className="size-4 shrink-0 text-accent"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-medium">
                          {hit.title}
                        </span>
                        <span className="block truncate text-[11px] text-muted-foreground">
                          {hit.subtitle}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : null}

      <p aria-live="polite" className="sr-only">
        {showPanel && !searching
          ? `${results.length} result${results.length === 1 ? "" : "s"}`
          : ""}
      </p>
    </div>
  );
}
