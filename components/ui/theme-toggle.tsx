"use client";

import { useSyncExternalStore } from "react";
import { Monitor, Moon, Sun } from "lucide-react";

const KEY = "lw-theme";
type Theme = "system" | "light" | "dark";

let listeners: (() => void)[] = [];
function subscribe(cb: () => void) {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
}
function readTheme(): Theme {
  const saved = safeGet();
  return saved === "light" || saved === "dark" ? saved : "system";
}

/**
 * Theme toggle — cycles system → light → dark. Persists to localStorage;
 * a tiny inline script in the root layout applies the saved value before
 * paint (no flash). data-theme drives the token flip in globals.css.
 */
export function ThemeToggle() {
  // useSyncExternalStore: SSR renders "system", client hydrates from storage
  const theme = useSyncExternalStore(subscribe, readTheme, () => "system" as Theme);

  function cycle() {
    const next: Theme =
      theme === "system" ? "light" : theme === "light" ? "dark" : "system";
    const root = document.documentElement;

    // Every colour token changes at once; without muting transitions for the
    // flip, every element carrying `transition-colors` animates and the switch
    // reads as lag. globals.css handles the muting, we just bracket the change.
    root.setAttribute("data-theme-switching", "");

    if (next === "system") {
      root.removeAttribute("data-theme");
      try {
        localStorage.removeItem(KEY);
      } catch {}
    } else {
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem(KEY, next);
      } catch {}
    }
    listeners.forEach((l) => l());

    // Two frames: one for the new colours to paint, one before transitions
    // are allowed back so nothing catches the tail of the change.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => root.removeAttribute("data-theme-switching"))
    );
  }

  const label =
    theme === "system"
      ? "Theme: system — switch to light"
      : theme === "light"
        ? "Theme: light — switch to dark"
        : "Theme: dark — switch to system";

  const Icon = theme === "system" ? Monitor : theme === "light" ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={label}
      title={label}
      className="grid size-11 place-items-center rounded-xl text-muted-foreground transition-colors duration-200 hover:bg-secondary hover:text-foreground active:scale-95"
    >
      <Icon aria-hidden className="size-[18px]" strokeWidth={1.75} />
      <span className="sr-only">{label}</span>
    </button>
  );
}

function safeGet(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}
