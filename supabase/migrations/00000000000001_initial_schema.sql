-- =========================================================
-- Loopwell — initial schema (M0)
-- RLS-first: every user table gets `user_id = auth.uid()`
-- policies BEFORE it ever holds data. One engine per concept:
-- one habits table (frequency field), one goals table
-- (target/current/deadline/label), one habit_logs table.
-- Nearly every query is "this user's rows for a date range"
-- → composite (user_id, date) indexes throughout.
-- =========================================================

-- ---------- profiles (extends auth.users) ----------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  age int check (age between 1 and 130),
  height_cm numeric(5, 1) check (height_cm > 0),
  gender text,
  activity_level text,
  unit_system text not null default 'metric' check (unit_system in ('metric', 'imperial')),
  timezone text not null default 'UTC',
  first_day_of_week int not null default 1 check (first_day_of_week in (0, 1)),
  theme text not null default 'system' check (theme in ('system', 'light', 'dark')),
  weight_module_enabled boolean not null default true,
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: own read" on public.profiles
  for select using (id = (select auth.uid()));
create policy "profiles: own insert" on public.profiles
  for insert with check (id = (select auth.uid()));
create policy "profiles: own update" on public.profiles
  for update using (id = (select auth.uid()));
create policy "profiles: own delete" on public.profiles
  for delete using (id = (select auth.uid()));

-- Auto-create a profile row on signup
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- habits (ONE unified engine) ----------
create table public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  icon text,
  color text,
  category text,
  -- unified frequency model: N times per period (7/week = daily)
  frequency_count int not null default 7 check (frequency_count between 1 and 31),
  frequency_period text not null default 'week' check (frequency_period in ('week', 'month')),
  in_quick_log boolean not null default false,
  sort_order int not null default 0,
  archived_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.habits enable row level security;

create policy "habits: own all" on public.habits
  for all using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create index habits_user_idx on public.habits (user_id, archived_at, sort_order);

-- ---------- habit_logs (one table, tri-state — not one per state) ----------
create table public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  habit_id uuid not null references public.habits (id) on delete cascade,
  date date not null,
  -- Locked rule: Partial counts toward completion %, does NOT extend streak
  state text not null check (state in ('complete', 'partial', 'skip')),
  created_at timestamptz not null default now(),
  unique (habit_id, date)
);

alter table public.habit_logs enable row level security;

create policy "habit_logs: own all" on public.habit_logs
  for all using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create index habit_logs_user_date_idx on public.habit_logs (user_id, date);
create index habit_logs_habit_date_idx on public.habit_logs (habit_id, date);

-- ---------- goals (ONE generic engine) ----------
create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  label text not null check (char_length(label) between 1 and 120),
  target_value numeric not null,
  current_value numeric not null default 0,
  start_value numeric,
  unit text,
  deadline date,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.goals enable row level security;

create policy "goals: own all" on public.goals
  for all using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create index goals_user_idx on public.goals (user_id, completed_at, deadline);

-- ---------- water_logs ----------
create table public.water_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  amount_ml int not null check (amount_ml between 1 and 10000),
  created_at timestamptz not null default now()
);

alter table public.water_logs enable row level security;

create policy "water_logs: own all" on public.water_logs
  for all using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create index water_logs_user_date_idx on public.water_logs (user_id, date);

-- ---------- sleep_logs ----------
create table public.sleep_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  bed_time time not null,
  wake_time time not null,
  -- duration derived client/server-side; stored for cheap aggregates
  duration_minutes int not null check (duration_minutes between 1 and 1440),
  quality text check (quality in ('poor', 'okay', 'great')),
  created_at timestamptz not null default now(),
  unique (user_id, date)
);

alter table public.sleep_logs enable row level security;

create policy "sleep_logs: own all" on public.sleep_logs
  for all using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create index sleep_logs_user_date_idx on public.sleep_logs (user_id, date);

-- ---------- weight_logs ----------
create table public.weight_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  weight_kg numeric(5, 2) not null check (weight_kg between 1 and 500),
  body_fat_pct numeric(4, 1) check (body_fat_pct between 1 and 80),   -- manual entry only
  muscle_pct numeric(4, 1) check (muscle_pct between 1 and 80),       -- manual entry only
  created_at timestamptz not null default now(),
  unique (user_id, date)
);

alter table public.weight_logs enable row level security;

create policy "weight_logs: own all" on public.weight_logs
  for all using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create index weight_logs_user_date_idx on public.weight_logs (user_id, date);

-- ---------- mood_logs ----------
create table public.mood_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  mood int not null check (mood between 1 and 5),
  note text check (char_length(note) <= 280),
  created_at timestamptz not null default now(),
  unique (user_id, date)
);

alter table public.mood_logs enable row level security;

create policy "mood_logs: own all" on public.mood_logs
  for all using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create index mood_logs_user_date_idx on public.mood_logs (user_id, date);

-- ---------- nutrition_logs ----------
create table public.nutrition_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  food_name text not null check (char_length(food_name) between 1 and 200),
  source text check (source in ('manual', 'usda', 'off')),
  source_ref text,
  calories numeric(7, 1) not null default 0 check (calories >= 0),
  protein_g numeric(6, 1) default 0 check (protein_g >= 0),
  carbs_g numeric(6, 1) default 0 check (carbs_g >= 0),
  fat_g numeric(6, 1) default 0 check (fat_g >= 0),
  fiber_g numeric(6, 1) check (fiber_g >= 0),
  sugar_g numeric(6, 1) check (sugar_g >= 0),
  created_at timestamptz not null default now()
);

alter table public.nutrition_logs enable row level security;

create policy "nutrition_logs: own all" on public.nutrition_logs
  for all using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create index nutrition_logs_user_date_idx on public.nutrition_logs (user_id, date);

-- ---------- workout_logs ----------
create table public.workout_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  kind text not null default 'strength' check (kind in ('strength', 'cardio')),
  name text not null check (char_length(name) between 1 and 120),
  sets int check (sets between 1 and 100),
  reps int check (reps between 1 and 1000),
  weight_kg numeric(6, 2) check (weight_kg >= 0),
  distance_km numeric(6, 2) check (distance_km >= 0),
  duration_minutes int check (duration_minutes between 1 and 1440),
  calories_burned int check (calories_burned between 0 and 20000),
  created_at timestamptz not null default now()
);

alter table public.workout_logs enable row level security;

create policy "workout_logs: own all" on public.workout_logs
  for all using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create index workout_logs_user_date_idx on public.workout_logs (user_id, date);

-- ---------- journal_entries (one per day) ----------
create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  body text not null check (char_length(body) <= 20000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, date)
);

alter table public.journal_entries enable row level security;

create policy "journal_entries: own all" on public.journal_entries
  for all using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create index journal_entries_user_date_idx on public.journal_entries (user_id, date);

-- ---------- achievements (definitions — global, read-only to users) ----------
create table public.achievements (
  id text primary key,             -- e.g. 'first-habit', '7-day-streak'
  title text not null,
  description text not null,
  icon text,
  sort_order int not null default 0
);

alter table public.achievements enable row level security;

create policy "achievements: authenticated read" on public.achievements
  for select to authenticated using (true);
-- no insert/update/delete policies: definitions are managed via migrations/seed only

-- ---------- user_achievements (unlocks) ----------
create table public.user_achievements (
  user_id uuid not null references auth.users (id) on delete cascade,
  achievement_id text not null references public.achievements (id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

alter table public.user_achievements enable row level security;

create policy "user_achievements: own read" on public.user_achievements
  for select using (user_id = (select auth.uid()));
create policy "user_achievements: own insert" on public.user_achievements
  for insert with check (user_id = (select auth.uid()));
-- no update/delete: unlocks are permanent
