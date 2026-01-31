import { IS_PROD } from './env.js';

export const ACCESS_TOKEN_COOKIE_NAME = 'sb_access_token';
export const REFRESH_TOKEN_COOKIE_NAME = 'sb_refresh_token';

export const COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: 'lax',
    secure: IS_PROD,
    path: '/',
};
