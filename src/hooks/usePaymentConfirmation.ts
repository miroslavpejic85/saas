'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import type { MeResponse } from '@/lib/apiTypes';
import { meResponseSchema } from '@/lib/apiTypes';
import { apiGet } from '@/lib/http';
import { sleep } from '@/lib/sleep';
import { useAsyncEffect } from '@/hooks/useAsyncEffect';
import { replaceHref } from '@/lib/navigation';
import { usePaymentConfirmationOptionsSchema, type UsePaymentConfirmationOptions } from '@/schemas/hooks';

export function usePaymentConfirmation(options: UsePaymentConfirmationOptions = {}) {
    const router = useRouter();

    const didToastPaidRef = useRef(false);
    const didToastNotLoggedInRef = useRef(false);

    const { maxAttempts, intervalMs, paidRedirectTo, paidRedirectDelayMs } =
        usePaymentConfirmationOptionsSchema.parse(options);

    const [status, setStatus] = useState<string>('');

    useAsyncEffect(async (signal) => {
        setStatus('Checking payment status...');

        for (let i = 0; i < maxAttempts; i++) {
            if (signal.aborted) return;

            try {
                const me = await apiGet<MeResponse>('/api/me', meResponseSchema);
                if (signal.aborted) return;

                setStatus(JSON.stringify(me, null, 2));

                if (me.paid) {
                    setStatus('Paid confirmed. Redirecting to protected...');

                    if (!didToastPaidRef.current) {
                        didToastPaidRef.current = true;
                        toast.success('Payment confirmed. Redirecting…');
                    }

                    setTimeout(() => {
                        replaceHref(router, paidRedirectTo);
                    }, paidRedirectDelayMs);
                    return;
                }
            } catch {
                if (signal.aborted) return;
                setStatus('Not logged in.');

                if (!didToastNotLoggedInRef.current) {
                    didToastNotLoggedInRef.current = true;
                    toast.error('Not logged in.');
                }

                return;
            }

            await sleep(intervalMs);
        }

        if (signal.aborted) return;
        setStatus((prev) => prev + '\n\nStill waiting for webhook. If this never updates, your Stripe webhook may be failing.');
    }, [intervalMs, maxAttempts, paidRedirectDelayMs, paidRedirectTo, router]);

    return { status };
}
