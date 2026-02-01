import type { ZodType } from 'zod';

import { jsonError } from '@/server/http/json';

export type ParseJsonBodyResult<T> = { ok: true; data: T } | { ok: false; response: ReturnType<typeof jsonError> };

export async function parseJsonBody<T>(
    request: Request,
    schema: ZodType<T>,
    options: { fallback?: unknown } = {}
): Promise<ParseJsonBodyResult<T>> {
    const body = await request.json().catch(() => options.fallback ?? null);
    const parsed = schema.safeParse(body);

    if (parsed.success) {
        return { ok: true, data: parsed.data };
    }

    const message = parsed.error.issues?.[0]?.message || 'Invalid body';
    return {
        ok: false,
        response: jsonError(message, 400),
    };
}
