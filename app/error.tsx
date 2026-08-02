"use client";

import { useEffect } from "react";
import { EmptyState, LoopIllustration, buttonClass } from "@/components/ui/kit";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg items-center px-6">
      <EmptyState
        illustration={<LoopIllustration />}
        title="Something went wrong"
        body="That's on us, not you. Try again, and if it keeps happening let us know."
        action={
          <button onClick={reset} className={buttonClass("primary", "md")}>
            Try again
          </button>
        }
      />
    </div>
  );
}
