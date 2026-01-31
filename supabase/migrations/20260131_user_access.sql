-- Migration: create user_access table for payment tracking
-- Run via: supabase db push (or included in db reset)

create table if not exists public.user_access (
  user_id uuid primary key references auth.users(id) on delete cascade,
  paid boolean not null default false,
  stripe_customer_id text,
  stripe_session_id text,
  updated_at timestamptz not null default now()
);

alter table public.user_access enable row level security;

drop policy if exists "read own access" on public.user_access; -- Drop existing policies if they exist
drop policy if exists "insert own access" on public.user_access; -- Drop existing policies if they exist

create policy "read own access"
on public.user_access
for select
using (auth.uid() = user_id);

create policy "insert own access"
on public.user_access
for insert
with check (auth.uid() = user_id);

