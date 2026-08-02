import { createClient } from "@/lib/supabase/server";
import { safeTimezone, todayInTz } from "@/lib/dates";
import { EmptyState, LoopIllustration, PageHeader } from "@/components/ui/kit";
import {
  ChallengeBoard,
  type ChallengeCard,
} from "@/features/challenges/challenge-board";
import { qualifyingDates } from "@/features/challenges/metrics";
import {
  challengeProgress,
  type ChallengeMetric,
} from "@/features/challenges/progress";
import { markChallengeComplete } from "@/features/challenges/actions";

export const metadata = { title: "Challenges — Loopwell" };

type ChallengeRow = {
  id: string;
  title: string;
  description: string;
  metric: ChallengeMetric;
  duration_days: number;
  target_days: number;
  icon: string | null;
};

export default async function ChallengesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone, water_goal_ml")
    .eq("id", user!.id)
    .single();

  const tz = safeTimezone(profile?.timezone as string | undefined);
  const today = todayInTz(tz);
  const waterGoalMl = (profile?.water_goal_ml as number | null) ?? 2000;

  const [{ data: catalogue, error: catalogueError }, { data: mine }, { data: counts }] =
    await Promise.all([
      supabase
        .from("challenges")
        .select("id, title, description, metric, duration_days, target_days, icon")
        .eq("active", true)
        .order("sort_order", { ascending: true })
        .returns<ChallengeRow[]>(),
      supabase
        .from("user_challenges")
        .select("challenge_id, joined_on, completed_at")
        .eq("user_id", user!.id),
      // Aggregate-only RPC — RLS hides other users' rows, this returns counts.
      supabase.rpc("challenge_participants"),
    ]);

  // Migration 0005 creates these tables. Until it's applied the page says so
  // rather than rendering a convincing-looking empty catalogue.
  if (catalogueError || (catalogue ?? []).length === 0) {
    return (
      <>
        <PageHeader
          eyebrow="Solo, opt-in"
          title="Challenges"
          subtitle="Short, kind challenges scored from the things you already log."
        />
        <EmptyState
          illustration={<LoopIllustration />}
          title="Challenges aren't switched on yet"
          body={
            catalogueError
              ? "The challenges tables haven't been created on this Supabase project yet — run migration 00000000000005_challenges.sql and this page fills itself in."
              : "No challenges are active right now. New ones land with each release."
          }
        />
      </>
    );
  }

  const joinedBy = new Map(
    (mine ?? []).map((m) => [
      m.challenge_id as string,
      {
        joinedOn: m.joined_on as string,
        completedAt: m.completed_at as string | null,
      },
    ])
  );
  const participantsBy = new Map(
    ((counts ?? []) as { challenge_id: string; participants: number }[]).map((c) => [
      c.challenge_id,
      Number(c.participants),
    ])
  );

  // Only fetch logs when there's a window to measure, and only back to the
  // oldest one — no point pulling history nothing is scored against.
  const earliest = [...joinedBy.values()]
    .map((j) => j.joinedOn)
    .sort()[0];

  const source = earliest
    ? await loadMetricSource(supabase, user!.id, earliest, waterGoalMl)
    : null;

  const cards: ChallengeCard[] = (catalogue ?? []).map((c) => {
    const joined = joinedBy.get(c.id);
    const progress =
      joined && source
        ? challengeProgress({
            joinedOn: joined.joinedOn,
            durationDays: c.duration_days,
            targetDays: c.target_days,
            today,
            qualifyingDates: qualifyingDates(c.metric, source),
          })
        : null;
    return {
      id: c.id,
      title: c.title,
      description: c.description,
      duration_days: c.duration_days,
      target_days: c.target_days,
      icon: c.icon,
      participants: participantsBy.get(c.id) ?? 0,
      progress,
    };
  });

  // Stamp completion once, the same fire-and-check shape as achievements.
  const newlyComplete = cards.filter((card) => {
    const joined = joinedBy.get(card.id);
    return card.progress?.status === "complete" && joined && !joined.completedAt;
  });
  await Promise.all(newlyComplete.map((card) => markChallengeComplete(card.id)));

  return (
    <>
      <PageHeader
        eyebrow="Solo, opt-in"
        title="Challenges"
        subtitle="Short, kind challenges scored from the things you already log. Nothing extra to track, no one to compete against."
      />
      <ChallengeBoard challenges={cards} />
    </>
  );
}

async function loadMetricSource(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  from: string,
  waterGoalMl: number
) {
  const [habits, water, workouts, sleep, mood, journal] = await Promise.all([
    supabase
      .from("habit_logs")
      .select("date, state")
      .eq("user_id", userId)
      .gte("date", from),
    supabase
      .from("water_logs")
      .select("date, amount_ml")
      .eq("user_id", userId)
      .gte("date", from),
    supabase
      .from("workout_logs")
      .select("date")
      .eq("user_id", userId)
      .gte("date", from),
    supabase
      .from("sleep_logs")
      .select("date, duration_minutes")
      .eq("user_id", userId)
      .gte("date", from),
    supabase
      .from("mood_logs")
      .select("date")
      .eq("user_id", userId)
      .gte("date", from),
    supabase
      .from("journal_entries")
      .select("date, body")
      .eq("user_id", userId)
      .gte("date", from),
  ]);

  return {
    habitLogs: (habits.data ?? []) as { date: string; state: string }[],
    waterLogs: (water.data ?? []) as { date: string; amount_ml: number }[],
    waterGoalMl,
    workoutLogs: (workouts.data ?? []) as { date: string }[],
    sleepLogs: (sleep.data ?? []) as {
      date: string;
      duration_minutes: number | null;
    }[],
    moodLogs: (mood.data ?? []) as { date: string }[],
    journalEntries: (journal.data ?? []) as { date: string; body: string | null }[],
  };
}
