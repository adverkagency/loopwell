"use client";

import { useEffect } from "react";
import Link from "next/link";
import { EmptyState, LoopIllustration, buttonClass } from "@/components/ui/kit";

export default function DashboardError({
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
    <div className="mx-auto flex min-h-[60vh] max-w-lg items-center px-4">
      <EmptyState
        illustration={<LoopIllustration />}
        title="This page hit a snag"
        body="Your data is safe — this was just a loading error. Try again, or head back to your dashboard."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={reset} className={buttonClass("primary", "md")}>
              Try again
            </button>
            <Link href="/dashboard" className={buttonClass("secondary", "md")}>
              Back to dashboard
            </Link>
          </div>
        }
      />
    </div>
  );
}
