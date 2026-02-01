'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import type { MeResponse } from '@/lib/apiTypes';
import { meResponseSchema } from '@/lib/apiTypes';
import { apiGet, type ApiError } from '@/lib/http';
import { useAsyncEffect } from '@/hooks/useAsyncEffect';
import { replaceHref } from '@/lib/navigation';
import { useRequirePaidOptionsSchema, type UseRequirePaidOptions } from '@/schemas/hooks';

export function useRequirePaid(options: UseRequirePaidOptions = {}) {
    const router = useRouter();

    const { unauthorizedRedirectTo, notPaidRedirectTo } = useRequirePaidOptionsSchema.parse(options);

    const [checking, setChecking] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useAsyncEffect(async (signal) => {
        try {
            const me = await apiGet<MeResponse>('/api/me', meResponseSchema);
            if (signal.aborted) return;

            if (!me.paid) {
                replaceHref(router, notPaidRedirectTo);
                return;
            }

            setChecking(false);
        } catch (e) {
            if (signal.aborted) return;

            const err = e as ApiError;
            if (err?.status === 401) {
                replaceHref(router, unauthorizedRedirectTo);
                return;
            }

            setError(err?.message || 'Server error');
            setChecking(false);
        }
    }, [notPaidRedirectTo, unauthorizedRedirectTo, router]);

    return { checking, error };
}
