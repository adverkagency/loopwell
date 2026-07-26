-- =========================================================
-- Loopwell — Challenges (product spec Phase 2, pulled forward)
--
-- Solo, opt-in challenges: no social graph, no moderation surface.
-- ONE generic engine, same pattern as habits/goals — a challenge is
-- (metric, duration_days, target_days) and progress is derived from
-- the logs the user already writes. Adding a challenge is a seed row,
-- never a new table or a new code path.
--
-- `challenges` is a public catalogue (no user data). `user_challenges`
-- is per-user and RLS-guarded like every other user table. Leaving a
-- challenge DELETEs the row, so rejoining starts a fresh window.
-- =========================================================

create table public.challenges (
  id text primary key,
  title text not null,
  description text not null,
  -- Which existing log satisfies a day. Extend by adding a value here
  -- AND a matching branch in features/challenges/metrics.ts.
  metric text not null check (
    metric in ('habit_complete', 'water_goal', 'workout', 'sleep', 'mood', 'journal')
  ),
  duration_days int not null check (duration_days between 1 and 365),
  target_days int not null check (target_days between 1 and 365),
  icon text,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint challenges_target_within_duration check (target_days <= duration_days)
);

alter table public.challenges enable row level security;

create policy "challenges: authenticated read" on public.challenges
  for select to authenticated using (true);

-- ---------- user_challenges ----------
create table public.user_challenges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  challenge_id text not null references public.challenges (id) on delete cascade,
  -- Start of the window, in the USER's timezone (same convention as every
  -- other *_logs.date column) — never a server-side UTC date.
  joined_on date not null,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, challenge_id)
);

alter table public.user_challenges enable row level security;

create policy "user_challenges: own all" on public.user_challenges
  for all using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create index user_challenges_user_idx on public.user_challenges (user_id, challenge_id);

-- ---------- participant counts ----------
-- RLS correctly hides other users' rows, but "412 people are doing this"
-- is a non-identifying aggregate worth showing. security definer keeps it
-- to COUNT(*) only — no user_id, no join, nothing per-person leaves here.
create function public.challenge_participants()
returns table (challenge_id text, participants bigint)
language sql
security definer
set search_path = ''
stable
as $$
  select uc.challenge_id, count(*)::bigint
  from public.user_challenges uc
  group by uc.challenge_id;
$$;

revoke execute on function public.challenge_participants() from public, anon;
grant execute on function public.challenge_participants() to authenticated;

-- ---------- seed catalogue ----------
-- Every one of these is measurable from data Loopwell already stores.
insert into public.challenges
  (id, title, description, metric, duration_days, target_days, icon, sort_order)
values
  ('hydration-7',  'A week of hydration',
   'Hit your water goal every day for seven days.',
   'water_goal', 7, 7, 'droplet', 10),
  ('hydration-30', 'Thirty days of hydration',
   'Hit your water goal on 25 of the next 30 days. Five off-days are built in.',
   'water_goal', 30, 25, 'droplet', 20),
  ('steady-14',    'Two steady weeks',
   'Complete at least one habit on 12 of the next 14 days.',
   'habit_complete', 14, 12, 'flame', 30),
  ('move-12',      'Twelve movements',
   'Log twelve workouts inside thirty days — any kind, any length.',
   'workout', 30, 12, 'activity', 40),
  ('sleep-reset',  'Sleep reset',
   'Get seven hours or more on 10 of the next 14 nights.',
   'sleep', 14, 10, 'moon', 50),
  ('check-in-21',  'Twenty-one check-ins',
   'Log how you felt on 21 of the next 30 days.',
   'mood', 30, 21, 'smile', 60),
  ('reflect-14',   'A fortnight of reflection',
   'Write a journal entry on 10 of the next 14 days.',
   'journal', 14, 10, 'book', 70)
on conflict (id) do nothing;
