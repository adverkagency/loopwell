"use client";

import { useLayoutEffect, useRef } from "react";

/**
 * Keeps an absolutely-positioned panel inside the viewport.
 *
 * Anchoring alone can't solve this: these fields sit in grids that are one
 * column on a phone and two on a tablet, so a left-anchored panel runs off the
 * right edge in one layout and a right-anchored one runs off the left edge in
 * the other. Measuring after open and nudging by the overflow handles every
 * layout with one rule, and leaves the panel where it was when it already fits.
 *
 * The offset is written straight to the node rather than held in state — it's
 * a post-layout correction, and routing it through a render would mean an
 * extra pass on every open.
 */
export function useEdgeClamp(open: boolean, margin = 8) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!open || !el) return;

    const place = () => {
      // Measure untranslated so repeated runs don't compound the shift.
      el.style.transform = "";
      const r = el.getBoundingClientRect();
      const vw = document.documentElement.clientWidth;
      let dx = 0;
      if (r.right > vw - margin) dx = vw - margin - r.right;
      if (r.left + dx < margin) dx = margin - r.left;
      if (dx) el.style.transform = `translateX(${Math.round(dx)}px)`;
    };

    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [open, margin]);

  return ref;
}
