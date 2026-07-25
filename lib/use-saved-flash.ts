"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Transient "Saved" confirmation. Returns a flag that goes true on flash()
 * and clears itself after `ms` — the timer is cancelled on unmount and on a
 * repeat flash so rapid saves don't stack timers.
 */
export function useSavedFlash(ms = 1800) {
  const [saved, setSaved] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  }, []);

  const flash = useCallback(() => {
    clear();
    setSaved(true);
    timer.current = setTimeout(() => setSaved(false), ms);
  }, [clear, ms]);

  useEffect(() => clear, [clear]);

  return { saved, flash };
}
