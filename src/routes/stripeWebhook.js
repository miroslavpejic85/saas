import express from 'express';
import { ENV } from '../config/env.js';
import { stripe } from '../clients/stripe.js';
import { supabaseAdmin } from '../clients/supabase.js';
import { upsertUserAccess } from '../data/userAccess.js';

export function registerStripeWebhook(app) {
    // Stripe webhook needs raw body
    app.post('/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
        const sig = req.headers['stripe-signature'];

        if (!ENV.STRIPE_WEBHOOK_SECRET) return res.status(500).send('Webhook not configured');
        if (!sig) return res.status(400).send('Missing Stripe-Signature header');

        let event;
        try {
            event = stripe.webhooks.constructEvent(req.body, sig, ENV.STRIPE_WEBHOOK_SECRET);
        } catch (err) {
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        // Idempotency: ignore replayed events
        try {
            const { data: existing, error: existingError } = await supabaseAdmin
                .from('stripe_webhook_events')
                .select('id')
                .eq('id', event.id)
                .maybeSingle();

            if (existingError) {
                console.error('stripe_webhook_events lookup failed', existingError);
                return res.status(500).send('Webhook storage error');
            }

            if (existing?.id) {
                return res.json({ received: true, deduped: true });
            }

            const { error: insertError } = await supabaseAdmin
                .from('stripe_webhook_events')
                .insert({ id: event.id, type: event.type });

            if (insertError) {
                if (String(insertError.code) !== '23505') {
                    console.error('stripe_webhook_events insert failed', insertError);
                    return res.status(500).send('Webhook storage error');
                }
                return res.json({ received: true, deduped: true });
            }
        } catch (e) {
            console.error('stripe_webhook_events unexpected error', e);
            return res.status(500).send('Webhook storage error');
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const userId = session.client_reference_id;

            if (userId) {
                const { error } = await upsertUserAccess(userId, {
                    paid: true,
                    stripe_customer_id: session.customer || null,
                    stripe_session_id: session.id,
                });
                if (error) console.error('webhook user_access upsert failed', error);
            }
        }

        res.json({ received: true });
    });
}
