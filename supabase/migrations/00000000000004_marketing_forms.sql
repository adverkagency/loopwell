-- Marketing site form intake: contact messages and account-deletion requests.
--
-- Both tables are write-only for the public. Anonymous visitors need to submit
-- these forms, so anon/authenticated get INSERT — but no SELECT policy exists,
-- so nobody can read rows back through the API. Triage happens in the Supabase
-- dashboard (or later, a service-role admin view).

create table public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null check (char_length(trim(name)) between 1 and 120),
  email       text not null check (char_length(email) between 3 and 320),
  topic       text not null check (topic in ('support', 'sales', 'press', 'partnerships', 'other')),
  message     text not null check (char_length(trim(message)) between 1 and 5000),
  -- Set when a signed-in user submits; null for anonymous visitors.
  user_id     uuid references auth.users on delete set null
);

create table public.deletion_requests (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  email       text not null check (char_length(email) between 3 and 320),
  reason      text check (char_length(reason) <= 2000),
  status      text not null default 'pending'
                check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  user_id     uuid references auth.users on delete set null
);

create index contact_messages_created_at_idx on public.contact_messages (created_at desc);
create index deletion_requests_created_at_idx on public.deletion_requests (created_at desc);
create index deletion_requests_status_idx on public.deletion_requests (status);

alter table public.contact_messages enable row level security;
alter table public.deletion_requests enable row level security;

-- Insert-only: the forms are public, but submissions are never readable via the API.
create policy "anyone can submit a contact message"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);

create policy "anyone can submit a deletion request"
  on public.deletion_requests for insert
  to anon, authenticated
  with check (true);
