import type { ZodType } from 'zod';

export type ApiError = Error & {
    status: number;
    data?: unknown;
};

function isZodSchema(value: unknown): value is ZodType<unknown> {
    return (
        !!value && typeof value === 'object' && 'parse' in (value as any) && typeof (value as any).parse === 'function'
    );
}

function safeJsonParse(text: string): unknown {
    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
}

function getErrorMessage(data: unknown, status: number): string {
    if (data && typeof data === 'object' && 'error' in data && typeof (data as any).error === 'string') {
        return (data as any).error;
    }
    return `Request failed (${status})`;
}

export async function requestJson<T>(url: string, init: RequestInit = {}): Promise<T> {
    const res = await fetch(url, {
        credentials: 'same-origin',
        cache: 'no-store',
        ...init,
    });

    const text = await res.text();
    const parsed = safeJsonParse(text);
    const data = parsed ?? (text ? { raw: text } : null);

    if (!res.ok) {
        const message = getErrorMessage(data, res.status);
        throw Object.assign(new Error(message), {
            status: res.status,
            data,
        }) as ApiError;
    }

    return data as T;
}

export async function requestJsonSchema<T>(url: string, schema: ZodType<T>, init: RequestInit = {}): Promise<T> {
    const data = await requestJson<unknown>(url, init);
    return schema.parse(data);
}

export async function apiGet<T>(url: string, init?: RequestInit): Promise<T>;
export async function apiGet<T>(url: string, schema: ZodType<T>, init?: RequestInit): Promise<T>;
export async function apiGet<T>(url: string, arg2: RequestInit | ZodType<T> = {}, arg3: RequestInit = {}): Promise<T> {
    if (isZodSchema(arg2)) {
        return requestJsonSchema<T>(url, arg2, arg3);
    }

    return requestJson<T>(url, arg2);
}

export async function apiPost<T>(url: string, body: unknown, init?: RequestInit): Promise<T>;
export async function apiPost<T>(url: string, body: unknown, schema: ZodType<T>, init?: RequestInit): Promise<T>;
export async function apiPost<T>(
    url: string,
    body: unknown,
    arg3: RequestInit | ZodType<T> = {},
    arg4: RequestInit = {}
): Promise<T> {
    const schema = isZodSchema(arg3) ? arg3 : undefined;
    const init = isZodSchema(arg3) ? arg4 : arg3;

    const mergedHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        ...(init.headers ?? {}),
    };

    const requestInit: RequestInit = {
        ...init,
        method: 'POST',
        headers: mergedHeaders,
        body: JSON.stringify(body ?? {}),
    };

    if (schema) {
        return requestJsonSchema<T>(url, schema, requestInit);
    }

    return requestJson<T>(url, requestInit);
}
