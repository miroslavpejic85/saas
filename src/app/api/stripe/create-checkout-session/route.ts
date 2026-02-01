import { NextResponse, type NextRequest } from 'next/server';
import Stripe from 'stripe';

import { stripe } from '@/server/clients/stripe';
import { ENV } from '@/server/config/env';
import { getUserFromRequest } from '@/server/auth/session';
import { ACCESS_TOKEN_COOKIE_NAME, COOKIE_OPTIONS, REFRESH_TOKEN_COOKIE_NAME } from '@/server/config/cookies';
import { upsertUserAccess } from '@/server/data/userAccess';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    const { user, refreshedSession } = await getUserFromRequest(request);

    if (!user) {
        return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
    }

    const origin = request.nextUrl.origin;
    const mode = ENV.STRIPE_MODE;
    const priceId = ENV.STRIPE_PRICE_ID;

    const checkoutParams: Stripe.Checkout.SessionCreateParams = {
        mode,
        success_url: `${origin}/success`,
        cancel_url: `${origin}/pricing`,
        client_reference_id: user.id,
        customer_email: user.email ?? undefined,
    };

    if (priceId) {
        checkoutParams.line_items = [{ price: priceId, quantity: 1 }];
    } else {
        const currency = ENV.STRIPE_CURRENCY;
        const productName = ENV.STRIPE_PRODUCT_NAME;
        const unitAmount = Number(ENV.STRIPE_UNIT_AMOUNT);

        if (!Number.isFinite(unitAmount) || unitAmount <= 0) {
            return NextResponse.json(
                {
                    error: 'Invalid STRIPE_UNIT_AMOUNT. Set STRIPE_PRICE_ID or provide STRIPE_UNIT_AMOUNT as an integer (in cents).',
                },
                { status: 400 }
            );
        }

        const priceData: Stripe.Checkout.SessionCreateParams.LineItem.PriceData = {
            currency,
            product_data: { name: productName },
            unit_amount: unitAmount,
        };

        if (mode === 'subscription') {
            const interval = ENV.STRIPE_RECURRING_INTERVAL;
            const intervalCountRaw = ENV.STRIPE_RECURRING_INTERVAL_COUNT;
            const intervalCount = intervalCountRaw ? Number(intervalCountRaw) : undefined;

            if (!interval) {
                return NextResponse.json(
                    {
                        error: 'Missing STRIPE_RECURRING_INTERVAL for subscription mode. Set STRIPE_PRICE_ID or set STRIPE_RECURRING_INTERVAL=month|year.',
                    },
                    { status: 400 }
                );
            }

            if (intervalCount !== undefined && (!Number.isFinite(intervalCount) || intervalCount <= 0)) {
                return NextResponse.json(
                    { error: 'Invalid STRIPE_RECURRING_INTERVAL_COUNT. Must be a positive integer.' },
                    { status: 400 }
                );
            }

            priceData.recurring = {
                interval,
                ...(intervalCount ? { interval_count: intervalCount } : {}),
            };
        }

        checkoutParams.line_items = [{ price_data: priceData, quantity: 1 }];
    }

    let session: Stripe.Checkout.Session;
    try {
        session = await stripe.checkout.sessions.create(checkoutParams);
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Stripe error';
        return NextResponse.json({ error: message }, { status: 400 });
    }

    const { error } = await upsertUserAccess(user.id, { stripe_session_id: session.id });
    if (error) console.error('user_access upsert failed', error);

    const res = NextResponse.json({ ok: true, url: session.url });

    if (refreshedSession?.access_token) {
        res.cookies.set(ACCESS_TOKEN_COOKIE_NAME, refreshedSession.access_token, COOKIE_OPTIONS);
        if (refreshedSession.refresh_token) {
            res.cookies.set(REFRESH_TOKEN_COOKIE_NAME, refreshedSession.refresh_token, COOKIE_OPTIONS);
        }
    }

    return res;
}
