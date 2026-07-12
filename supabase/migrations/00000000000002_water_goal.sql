-- M2: per-user daily water goal (ml). Default 2L, sane bounds.
alter table public.profiles
  add column water_goal_ml int not null default 2000
  check (water_goal_ml between 250 and 10000);
