'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import type { LogoutResponse, SendOtpResponse, VerifyOtpResponse } from '@/lib/apiTypes';
import { logoutResponseSchema, sendOtpResponseSchema, verifyOtpResponseSchema } from '@/lib/apiTypes';
import { apiPost } from '@/lib/http';
import { replaceHref } from '@/lib/navigation';
import { useOtpLoginOptionsSchema, type UseOtpLoginOptions } from '@/schemas/hooks';

export function useOtpLogin(options: UseOtpLoginOptions = {}) {
    const router = useRouter();

    const { redirectTo, redirectDelayMs } = useOtpLoginOptionsSchema.parse(options);

    const [email, setEmail] = useState<string>('');
    const [code, setCode] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [busy, setBusy] = useState<boolean>(false);

    const sendCode = useCallback(async () => {
        setStatus('');
        setBusy(true);
        try {
            await apiPost<SendOtpResponse>('/api/auth/send-otp', { email: email.trim() }, sendOtpResponseSchema);
            setStatus('OTP sent. Check your email.');
            toast.success('OTP sent. Check your email.');
        } catch (e) {
            const message = e instanceof Error ? e.message : String(e);
            setStatus(message);
            toast.error(message);
        } finally {
            setBusy(false);
        }
    }, [email]);

    const verifyAndLogin = useCallback(async () => {
        setStatus('');
        setBusy(true);
        try {
            const data = await apiPost<VerifyOtpResponse>(
                '/api/auth/verify-otp',
                {
                email: email.trim(),
                token: code.trim(),
                },
                verifyOtpResponseSchema
            );
            const shownEmail = data.user.email ?? email.trim();
            setStatus(`Logged in as: ${shownEmail}\nRedirecting to home...`);
            toast.success('Logged in successfully.');
            setTimeout(() => {
                replaceHref(router, redirectTo);
            }, redirectDelayMs);
        } catch (e) {
            const message = e instanceof Error ? e.message : String(e);
            setStatus(message);
            toast.error(message);
        } finally {
            setBusy(false);
        }
    }, [code, email, redirectDelayMs, redirectTo, router]);

    const logout = useCallback(async () => {
        setBusy(true);
        try {
            await apiPost<LogoutResponse>('/api/auth/logout', {}, logoutResponseSchema);
            setStatus('Logged out.');
            toast.success('Logged out.');
        } catch (e) {
            const message = e instanceof Error ? e.message : String(e);
            setStatus(message);
            toast.error(message);
        } finally {
            setBusy(false);
        }
    }, []);

    return {
        email,
        setEmail,
        code,
        setCode,
        status,
        busy,
        sendCode,
        verifyAndLogin,
        logout,
    };
}
