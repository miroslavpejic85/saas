# Tiny SaaS Starter

![saas](./public/saas.png)

Supabase OTP + Stripe Checkout (Minimal)

## Flow

1. Login via OTP → Supabase session
2. Pay via Stripe Checkout
3. Webhook confirms payment → unlock `Protected Page`

---

## Requirements

- Docker
- Supabase CLI
- Node.js
- Stripe account + Stripe CLI

---

## Install & Start Supabase

```bash
# clone this repo
git clone https://github.com/miroslavpejic85/saas.git

# go to saas dir
cd saas

# Install CLI (npm)
npm i -g supabase

# Initialize project (once)
supabase init

# Start local stack
supabase start
supabase db reset
```

Local URLs:

- API: http://127.0.0.1:54321
- Studio: http://127.0.0.1:54323
- Mailpit inbox: http://127.0.0.1:54324

---

## Configure env

```bash
# Copy and edit it
cp .env.example .env
```

---

## Run the app

```bash
npm ci
npm run dev
```

Open: http://localhost:3000

---

## Stripe webhook (local)

```bash
stripe login
stripe listen --events checkout.session.completed --forward-to localhost:3000/stripe/webhook
```

Copy `whsec_...` → `.env` as `STRIPE_WEBHOOK_SECRET`.

---

## DB

`public.user_access` → stores `user_id` + `paid` boolean

---
