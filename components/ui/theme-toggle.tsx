"use client";

import { useSyncExternalStore } from "react";
import { MoonIcon } from "@/components/ui/icons";

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
    if (next === "system") {
      document.documentElement.removeAttribute("data-theme");
      try {
        localStorage.removeItem(KEY);
      } catch {}
    } else {
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem(KEY, next);
      } catch {}
    }
    listeners.forEach((l) => l());
  }

  const label =
    theme === "system"
      ? "Theme: system — switch to light"
      : theme === "light"
        ? "Theme: light — switch to dark"
        : "Theme: dark — switch to system";

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={label}
      title={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline bg-elevated text-ink-secondary transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
    >
      <MoonIcon size={18} />
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
