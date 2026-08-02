"use client";

import { useMemo, useState, useTransition } from "react";
import { Globe } from "lucide-react";
import { setTimezone } from "./actions";
import { useSavedFlash } from "@/lib/use-saved-flash";
import { CARD_BASE, INPUT, LABEL, SavedFlash } from "@/components/ui/kit";

const COMMON_FALLBACK = [
  "UTC",
  "America/Los_Angeles",
  "America/Denver",
  "America/Chicago",
  "America/New_York",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Karachi",
  "Asia/Kolkata",
  "Asia/Dubai",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
];

function allTimezones(): string[] {
  try {
    return Intl.supportedValuesOf("timeZone");
  } catch {
    return COMMON_FALLBACK;
  }
}

export function TimezoneSetting({ current }: { current: string }) {
  const [pending, startTransition] = useTransition();
  const [value, setValue] = useState(current);
  const [error, setError] = useState<string | null>(null);
  const { saved, flash } = useSavedFlash();
  const zones = useMemo(() => allTimezones(), []);

  function save(next: string) {
    setValue(next);
    setError(null);
    startTransition(async () => {
      const res = await setTimezone(next);
      if (res.error) setError(res.error);
      else flash();
    });
  }

  return (
    <div className={`${CARD_BASE} px-5 py-5`}>
      <div className="flex items-start gap-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent">
          <Globe aria-hidden className="size-[18px]" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-[14px] font-semibold">Timezone</h2>
          <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
            Sets your daily boundary for streaks, goals, and challenges.
            Update this if you travel or it was wrong at signup.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label htmlFor="tz-select" className={`${LABEL} sr-only`}>
              Timezone
            </label>
            <select
              id="tz-select"
              value={value}
              disabled={pending}
              onChange={(e) => save(e.target.value)}
              className={`${INPUT} max-w-xs`}
            >
              {zones.map((z) => (
                <option key={z} value={z}>
                  {z.replace(/_/g, " ")}
                </option>
              ))}
            </select>
            {saved ? <SavedFlash /> : null}
          </div>
          {error ? (
            <p role="alert" className="mt-2 text-[13px] font-medium text-danger">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
