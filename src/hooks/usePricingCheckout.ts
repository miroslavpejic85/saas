'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import type { CreateCheckoutSessionResponse, MeResponse } from '@/lib/apiTypes';
import { createCheckoutSessionResponseSchema, meResponseSchema } from '@/lib/apiTypes';
import { apiGet, apiPost } from '@/lib/http';
import { useAsyncEffect } from '@/hooks/useAsyncEffect';
import { replaceHref } from '@/lib/navigation';

export function usePricingCheckout() {
    const router = useRouter();

    const [status, setStatus] = useState<string>('');
    const [busy, setBusy] = useState<boolean>(false);

    useAsyncEffect(async (signal) => {
        try {
            const me = await apiGet<MeResponse>('/api/me', meResponseSchema);
            if (signal.aborted) return;

            if (me.paid) {
                replaceHref(router, '/protected');
                return;
            }

            setStatus(`Logged in as ${me.user.email}. Ready to pay.`);
        } catch {
            if (signal.aborted) return;
            setStatus('Login required to pay.');
        }
    }, [router]);

    const pay = useCallback(async () => {
        setStatus('');
        setBusy(true);
        try {
            const data = await apiPost<CreateCheckoutSessionResponse>(
                '/api/stripe/create-checkout-session',
                {},
                createCheckoutSessionResponseSchema
            );
            if (!data.url) {
                setStatus('Stripe did not return a checkout URL.');
                toast.error('Stripe did not return a checkout URL.');
                return;
            }
            toast.message('Redirecting to Stripe Checkout…');
            window.location.href = data.url;
        } catch (e) {
            const message = e instanceof Error ? e.message : String(e);
            setStatus(message + '\n(You must login first.)');
            toast.error(message);
        } finally {
            setBusy(false);
        }
    }, []);

    return { status, busy, pay };
}
