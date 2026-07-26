"use client";

import { useState, useTransition } from "react";
import {
  Activity,
  BookOpen,
  Check,
  Droplets,
  Flame,
  Moon,
  Smile,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { joinChallenge, leaveChallenge } from "./actions";
import { challengeTimingLabel, type ChallengeProgress } from "./progress";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { CARD_BASE, buttonClass } from "@/components/ui/kit";

const ICONS: Record<string, LucideIcon> = {
  droplet: Droplets,
  flame: Flame,
  activity: Activity,
  moon: Moon,
  smile: Smile,
  book: BookOpen,
};

export type ChallengeCard = {
  id: string;
  title: string;
  description: string;
  duration_days: number;
  target_days: number;
  icon: string | null;
  participants: number;
  /** null when the user hasn't joined. */
  progress: ChallengeProgress | null;
};

export function ChallengeBoard({ challenges }: { challenges: ChallengeCard[] }) {
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [leaving, setLeaving] = useState<ChallengeCard | null>(null);

  function run(id: string, fn: () => Promise<{ error?: string }>) {
    setError(null);
    setBusyId(id);
    startTransition(async () => {
      const res = await fn();
      if (res.error) setError(res.error);
      setBusyId(null);
    });
  }

  const joined = challenges.filter((c) => c.progress !== null);
  const open = challenges.filter((c) => c.progress === null);

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      {error ? (
        <p
          role="alert"
          className="rounded-2xl bg-danger/10 px-4 py-2.5 text-[13px] font-medium text-danger"
        >
          {error}
        </p>
      ) : null}

      {joined.length > 0 ? (
        <section aria-label="Your challenges" className="space-y-4">
          <h2 className="text-[17px] font-semibold tracking-tight">
            Your challenges
          </h2>
          <ul className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
            {joined.map((c) => (
              <Row
                key={c.id}
                challenge={c}
                busy={pending && busyId === c.id}
                onLeave={() => setLeaving(c)}
              />
            ))}
          </ul>
        </section>
      ) : null}

      <section aria-label="Open challenges" className="space-y-4">
        <h2 className="text-[17px] font-semibold tracking-tight">
          {joined.length > 0 ? "More to try" : "Pick one to start"}
        </h2>
        {open.length === 0 ? (
          <p className="text-[14px] text-muted-foreground">
            You&apos;re in every challenge going. New ones land with each release.
          </p>
        ) : (
          <ul className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
            {open.map((c) => (
              <Row
                key={c.id}
                challenge={c}
                busy={pending && busyId === c.id}
                onJoin={() => run(c.id, () => joinChallenge({ challenge_id: c.id }))}
              />
            ))}
          </ul>
        )}
      </section>

      <ConfirmDialog
        open={leaving !== null}
        title={`Leave “${leaving?.title ?? ""}”?`}
        body="Your habits and logs stay exactly as they are — only this challenge's progress is cleared. You can join again any time, and the window restarts from that day."
        confirmLabel="Leave challenge"
        onCancel={() => setLeaving(null)}
        onConfirm={() => {
          const c = leaving;
          setLeaving(null);
          if (c) run(c.id, () => leaveChallenge({ challenge_id: c.id }));
        }}
      />
    </div>
  );
}

function Row({
  challenge: c,
  busy,
  onJoin,
  onLeave,
}: {
  challenge: ChallengeCard;
  busy: boolean;
  onJoin?: () => void;
  onLeave?: () => void;
}) {
  const Icon = ICONS[c.icon ?? ""] ?? Trophy;
  const p = c.progress;
  const done = p?.status === "complete";

  return (
    <li
      className={`${CARD_BASE} flex h-full flex-col p-6 sm:p-7 ${
        done ? "ring-accent-line" : ""
      }`}
    >
      <div className="flex items-start gap-4">
        <span
          className={`grid size-11 shrink-0 place-items-center rounded-2xl ${
            done ? "bg-accent text-accent-foreground" : "bg-accent-soft text-accent"
          }`}
        >
          {done ? (
            <Check aria-hidden className="size-[18px]" strokeWidth={2.5} />
          ) : (
            <Icon aria-hidden className="size-[18px]" strokeWidth={1.75} />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-semibold tracking-tight">{c.title}</h3>
          <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
            {c.description}
          </p>
        </div>
      </div>

      {p ? (
        <div className="mt-6">
          <div className="flex items-baseline justify-between gap-3">
            <span className="tabular text-[13px] font-medium">
              {p.daysDone} of {c.target_days} days
            </span>
            <span className="tabular text-[12px] text-muted-foreground">
              {challengeTimingLabel(p)}
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className={`h-full rounded-full transition-[width] duration-700 ${
                p.status === "missed" ? "bg-border-strong" : "bg-accent"
              }`}
              style={{ width: `${p.pct}%` }}
            />
          </div>
          {p.status === "missed" ? (
            <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">
              This run fell short — no streak lost, nothing broken. Leave and
              rejoin whenever you want a fresh window.
            </p>
          ) : null}
        </div>
      ) : (
        <p className="tabular mt-6 text-[12px] text-muted-foreground">
          {c.target_days} of {c.duration_days} days
        </p>
      )}

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-5">
        <span className="tabular text-[12px] text-muted-foreground">
          {c.participants === 0
            ? "Be the first"
            : `${c.participants.toLocaleString()} ${
                c.participants === 1 ? "person" : "people"
              }`}
        </span>
        {onJoin ? (
          <button
            type="button"
            disabled={busy}
            onClick={onJoin}
            className={buttonClass("primary", "sm")}
          >
            {busy ? "Joining…" : "Join"}
          </button>
        ) : (
          <button
            type="button"
            disabled={busy}
            onClick={onLeave}
            className={buttonClass("quiet", "sm")}
          >
            {busy ? "Leaving…" : "Leave"}
          </button>
        )}
      </div>
    </li>
  );
}
