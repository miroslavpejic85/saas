import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { ENV } from '@/server/config/env';
import { stripe } from '@/server/clients/stripe';
import { supabaseAdmin } from '@/server/clients/supabase';
import { upsertUserAccess } from '@/server/data/userAccess';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    const sig = request.headers.get('stripe-signature');

    if (!ENV.STRIPE_WEBHOOK_SECRET) return new NextResponse('Webhook not configured', { status: 500 });
    if (!sig) return new NextResponse('Missing Stripe-Signature header', { status: 400 });

    const buf = Buffer.from(await request.arrayBuffer());

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(buf, sig, ENV.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Invalid webhook signature';
        return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
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
            return new NextResponse('Webhook storage error', { status: 500 });
        }

        if (existing?.id) {
            return NextResponse.json({ received: true, deduped: true });
        }

        const { error: insertError } = await supabaseAdmin
            .from('stripe_webhook_events')
            .insert({ id: event.id, type: event.type });

        if (insertError) {
            if (String((insertError as any).code) !== '23505') {
                console.error('stripe_webhook_events insert failed', insertError);
                return new NextResponse('Webhook storage error', { status: 500 });
            }
            return NextResponse.json({ received: true, deduped: true });
        }
    } catch (e) {
        console.error('stripe_webhook_events unexpected error', e);
        return new NextResponse('Webhook storage error', { status: 500 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;

        if (userId) {
            const { error } = await upsertUserAccess(userId, {
                paid: true,
                stripe_customer_id: (session.customer as string | null) || null,
                stripe_session_id: session.id,
            });
            if (error) console.error('webhook user_access upsert failed', error);
        }
    }

    return NextResponse.json({ received: true });
}
