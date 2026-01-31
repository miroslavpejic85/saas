import express from 'express';
import { requireUser } from '../auth/session.js';
import { checkoutLimiter } from '../config/limits.js';
import { ENV } from '../config/env.js';
import { stripe } from '../clients/stripe.js';
import { getRequestBaseUrl } from '../lib/http.js';
import { upsertUserAccess } from '../data/userAccess.js';

export function apiStripeRouter() {
    const router = express.Router();

    router.post('/create-checkout-session', checkoutLimiter, requireUser, async (req, res) => {
        const user = req.user;
        const requestBaseUrl = getRequestBaseUrl(req);

        // Supports BOTH:
        // 1) STRIPE_PRICE_ID + STRIPE_MODE (payment/subscription)
        // 2) Inline price_data (defaults to one-time payment)
        const mode = ENV.STRIPE_MODE;
        const priceId = ENV.STRIPE_PRICE_ID;

        const checkoutParams = {
            mode,
            success_url: `${requestBaseUrl}/success.html`,
            cancel_url: `${requestBaseUrl}/pricing.html`,
            client_reference_id: user.id,
            customer_email: user.email,
        };

        if (priceId) {
            checkoutParams.line_items = [{ price: priceId, quantity: 1 }];
        } else {
            const currency = ENV.STRIPE_CURRENCY;
            const productName = ENV.STRIPE_PRODUCT_NAME;
            const unitAmount = Number(ENV.STRIPE_UNIT_AMOUNT);

            if (!Number.isFinite(unitAmount) || unitAmount <= 0) {
                return res.status(400).json({
                    error: 'Invalid STRIPE_UNIT_AMOUNT. Set STRIPE_PRICE_ID or provide STRIPE_UNIT_AMOUNT as an integer (in cents).',
                });
            }

            const priceData = {
                currency,
                product_data: { name: productName },
                unit_amount: unitAmount,
            };

            if (mode === 'subscription') {
                const interval = ENV.STRIPE_RECURRING_INTERVAL;
                const intervalCountRaw = ENV.STRIPE_RECURRING_INTERVAL_COUNT;
                const intervalCount = intervalCountRaw ? Number(intervalCountRaw) : undefined;

                if (!interval) {
                    return res.status(400).json({
                        error: 'Missing STRIPE_RECURRING_INTERVAL for subscription mode. Set STRIPE_PRICE_ID or set STRIPE_RECURRING_INTERVAL=month|year.',
                    });
                }

                if (intervalCount !== undefined && (!Number.isFinite(intervalCount) || intervalCount <= 0)) {
                    return res.status(400).json({
                        error: 'Invalid STRIPE_RECURRING_INTERVAL_COUNT. Must be a positive integer.',
                    });
                }

                priceData.recurring = {
                    interval,
                    ...(intervalCount ? { interval_count: intervalCount } : {}),
                };
            }

            checkoutParams.line_items = [{ price_data: priceData, quantity: 1 }];
        }

        let session;
        try {
            session = await stripe.checkout.sessions.create(checkoutParams);
        } catch (e) {
            return res.status(400).json({ error: e.message || 'Stripe error' });
        }

        const { error } = await upsertUserAccess(user.id, { stripe_session_id: session.id });
        if (error) console.error('user_access upsert failed', error);

        res.json({ ok: true, url: session.url });
    });

    return router;
}
