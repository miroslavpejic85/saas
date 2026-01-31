-- Track processed Stripe webhook events for idempotency

create table if not exists public.stripe_webhook_events (
  id text primary key,
  type text not null,
  created_at timestamptz not null default now()
);

alter table public.stripe_webhook_events enable row level security;

-- Server uses SERVICE ROLE key to insert/read. No client access needed.
-- (No policies created.)
