import 'server-only';

import type { NextRequest } from 'next/server';
import type { Session, User } from '@supabase/supabase-js';

import { supabaseAnon } from '@/server/clients/supabase';
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from '@/server/config/cookies';

type CookieStoreLike = {
    get: (name: string) => { value: string } | undefined;
};

async function getUserFromTokens(
    accessToken: string | null,
    refreshToken: string | null
): Promise<{ user: User | null; refreshedSession: Session | null }> {
    if (accessToken) {
        const { data, error } = await supabaseAnon.auth.getUser(accessToken);
        if (!error && data?.user) {
            return { user: data.user, refreshedSession: null };
        }
    }

    if (!refreshToken) return { user: null, refreshedSession: null };

    const { data: refreshed, error: refreshError } = await supabaseAnon.auth.refreshSession({
        refresh_token: refreshToken,
    });

    if (refreshError || !refreshed?.session?.access_token) return { user: null, refreshedSession: null };

    return { user: refreshed.user ?? null, refreshedSession: refreshed.session };
}

export async function getUserFromRequest(
    request: NextRequest
): Promise<{ user: User | null; refreshedSession: Session | null }> {
    const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value || null;
    const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE_NAME)?.value || null;

    return getUserFromTokens(accessToken, refreshToken);
}

export async function getUserFromCookies(
    cookieStore: CookieStoreLike
): Promise<{ user: User | null; refreshedSession: Session | null }> {
    const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value || null;
    const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)?.value || null;

    return getUserFromTokens(accessToken, refreshToken);
}
