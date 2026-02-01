import { IS_PROD } from '@/server/config/env';

export const ACCESS_TOKEN_COOKIE_NAME = 'sb_access_token';
export const REFRESH_TOKEN_COOKIE_NAME = 'sb_refresh_token';

export const COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: IS_PROD,
    path: '/',
};
