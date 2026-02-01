# Tiny SaaS Starter

![saas](./public/saas.png)

**[Supabase](https://supabase.com)** OTP + Stripe Checkout (Minimal)

## Flow

1. Login via Supabase OTP → session stored in httpOnly cookies
2. Pay via Stripe Checkout
3. Stripe webhook confirms payment → unlock **Protected** page

## Requirements

- Node.js (Next.js 16 requires Node >= 20.9)
- pnpm (recommended)
- Docker (for local Supabase)
- Supabase CLI
- Stripe account (+ Stripe CLI for local webhooks)

## Quick start (local Supabase)

```bash
git clone https://github.com/miroslavpejic85/saas.git
cd saas

# install supabase cli (one option)
pnpm add -g supabase

# start local supabase (requires Docker)
supabase start

# apply migrations + seed
supabase db reset
```

## Configure env

```bash
cp .env.example .env
```

Required:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET` (required to unlock after payment)

Checkout configuration:

- Option A (recommended): set `STRIPE_PRICE_ID`
- Option B: leave `STRIPE_PRICE_ID` empty and set `STRIPE_PRODUCT_NAME`, `STRIPE_CURRENCY`, `STRIPE_UNIT_AMOUNT`

## Stripe webhook (local)

```bash
stripe login

# Copy `whsec_...` into `.env` as `STRIPE_WEBHOOK_SECRET`
stripe listen --events checkout.session.completed --forward-to localhost:3000/stripe/webhook
```

## Run the app

```bash
pnpm install
pnpm run dev
```

Local URLs:

- App: http://localhost:3000
- Mailpit: http://127.0.0.1:54324
- Supabase Studio: http://127.0.0.1:54323

## Notes

- Routes: `/login`, `/pricing`, `/success`, `/protected`
- UI routes are under `src/app/*`.
- API endpoints are Route Handlers under `src/app/api/*`.
- Stripe webhook endpoint is `POST /stripe/webhook`.
- Legacy `.html` routes are redirected via Next 16 proxy convention in `src/proxy.ts`.

## Project structure

- `src/app/*`: pages + layouts (React)
- `src/app/api/*`: API route handlers
- `src/app/stripe/webhook/route.ts`: Stripe webhook handler
- `src/server/*`: server-only helpers (Supabase/Stripe clients, session helpers)
- `supabase/migrations/*`: database schema
