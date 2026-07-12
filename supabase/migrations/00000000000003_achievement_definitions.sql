-- Loopwell seed data — local development + first deploy.
-- Achievement definitions (~10 at launch per product spec).
insert into public.achievements (id, title, description, icon, sort_order) values
  ('first-habit',    'First Habit',    'Log your very first habit.',                  'leaf',     10),
  ('7-day-streak',   '7-Day Streak',   'Complete one habit 7 days in a row.',         'flame',    20),
  ('30-day-streak',  '30-Day Streak',  'Complete one habit 30 days in a row.',        'flame',    30),
  ('100l-water',     '100L Water',     'Log 100 litres of water in total.',           'droplet',  40),
  ('100-workouts',   '100 Workouts',   'Log 100 workouts.',                           'activity', 50),
  ('perfect-week',   'Perfect Week',   'Complete every habit, every day, for a week.','star',     60),
  ('first-goal-hit', 'First Goal Hit', 'Complete your first goal.',                   'goals',    70),
  ('30-day-user',    '30-Day User',    'Keep coming back for 30 days.',               'calendar', 80),
  ('early-bird',     'Early Bird',     'Log a habit before 7am.',                     'sun',      90),
  ('comeback',       'Comeback',       'Return and log after a 7+ day break.',        'sparkle', 100)
on conflict (id) do nothing;
