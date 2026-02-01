import 'server-only';

import Stripe from 'stripe';
import { ENV } from '@/server/config/env';

export const stripe = new Stripe(ENV.STRIPE_SECRET_KEY, { apiVersion: '2026-01-28.clover' });
