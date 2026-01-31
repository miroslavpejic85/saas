import express from 'express';
import { z } from 'zod';
import { supabaseAnon } from '../clients/supabase.js';
import { authLimiter } from '../config/limits.js';
import { ACCESS_TOKEN_COOKIE_NAME, COOKIE_OPTIONS, REFRESH_TOKEN_COOKIE_NAME } from '../config/cookies.js';
import { getRequestBaseUrl } from '../lib/http.js';
import { parseJsonBody } from '../lib/validation.js';

const SendOtpSchema = z.object({
    email: z.string().trim().email('Invalid email'),
});

const VerifyOtpSchema = z.object({
    email: z.string().trim().email('Invalid email'),
    token: z.string().trim().min(1, 'Missing token'),
});

export function apiAuthRouter() {
    const router = express.Router();

    // Send OTP to email
    router.post('/send-otp', authLimiter, async (req, res) => {
        const body = parseJsonBody(req, res, SendOtpSchema);
        if (!body) return;
        const { email } = body;

        const { data, error } = await supabaseAnon.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${getRequestBaseUrl(req)}/login.html`,
            },
        });

        if (error) return res.status(400).json({ error: error.message });
        res.json({ ok: true, data });
    });

    // Verify OTP code
    router.post('/verify-otp', authLimiter, async (req, res) => {
        const body = parseJsonBody(req, res, VerifyOtpSchema);
        if (!body) return;
        const { email, token } = body;

        const { data, error } = await supabaseAnon.auth.verifyOtp({
            email,
            token,
            type: 'email',
        });

        if (error) return res.status(400).json({ error: error.message });

        res.cookie(ACCESS_TOKEN_COOKIE_NAME, data.session.access_token, COOKIE_OPTIONS);
        if (data.session.refresh_token) {
            res.cookie(REFRESH_TOKEN_COOKIE_NAME, data.session.refresh_token, COOKIE_OPTIONS);
        }

        res.json({ ok: true, user: data.user });
    });

    router.post('/logout', async (req, res) => {
        res.clearCookie(ACCESS_TOKEN_COOKIE_NAME, COOKIE_OPTIONS);
        res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, COOKIE_OPTIONS);
        res.json({ ok: true });
    });

    return router;
}
