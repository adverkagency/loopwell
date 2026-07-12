"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * False during SSR and the pre-hydration window, true once React has
 * attached event handlers. Gate interactive-only controls on this so a
 * click before hydration renders a disabled button instead of silently
 * dropping the event (UX audit: lost first click on quick-log chips).
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
