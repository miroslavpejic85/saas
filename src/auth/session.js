import { supabaseAnon } from '../clients/supabase.js';
import { ACCESS_TOKEN_COOKIE_NAME, COOKIE_OPTIONS, REFRESH_TOKEN_COOKIE_NAME } from '../config/cookies.js';

function getAccessToken(req) {
    return req.cookies?.[ACCESS_TOKEN_COOKIE_NAME] || null;
}

function getRefreshToken(req) {
    return req.cookies?.[REFRESH_TOKEN_COOKIE_NAME] || null;
}

export async function getUserFromCookie(req, res) {
    const token = getAccessToken(req);
    if (token) {
        const { data, error } = await supabaseAnon.auth.getUser(token);
        if (!error && data?.user) return data.user;
    }

    const refreshToken = getRefreshToken(req);
    if (!refreshToken) return null;

    const { data: refreshed, error: refreshError } = await supabaseAnon.auth.refreshSession({
        refresh_token: refreshToken,
    });

    if (refreshError || !refreshed?.session?.access_token) return null;

    if (res) {
        res.cookie(ACCESS_TOKEN_COOKIE_NAME, refreshed.session.access_token, COOKIE_OPTIONS);
        if (refreshed.session.refresh_token) {
            res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshed.session.refresh_token, COOKIE_OPTIONS);
        }
    }

    if (refreshed.user) return refreshed.user;

    const { data, error } = await supabaseAnon.auth.getUser(refreshed.session.access_token);
    if (error) return null;
    return data.user;
}

export async function requireUser(req, res, next) {
    const user = await getUserFromCookie(req, res);
    if (!user) return res.status(401).json({ error: 'Not logged in' });
    req.user = user;
    next();
}
