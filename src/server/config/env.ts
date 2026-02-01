import { z } from 'zod';

function cleanOptionalEnvString(value: unknown): string | undefined {
    if (value === undefined || value === null) return undefined;
    if (typeof value !== 'string') return String(value);
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    const unquoted = trimmed.replace(/^['"](.*)['"]$/, '$1').trim();
    return unquoted || undefined;
}

function cleanRequiredEnvString(value: unknown): string | undefined {
    return cleanOptionalEnvString(value);
}

const EnvSchema = z
    .object({
        NODE_ENV: z.enum(['development', 'test', 'production']).optional().default('development'),

        SUPABASE_URL: z.preprocess(cleanRequiredEnvString, z.string().min(1, 'SUPABASE_URL is required')),
        SUPABASE_ANON_KEY: z.preprocess(cleanRequiredEnvString, z.string().min(1, 'SUPABASE_ANON_KEY is required')),
        SUPABASE_SERVICE_ROLE_KEY: z.preprocess(
            cleanRequiredEnvString,
            z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required')
        ),

        STRIPE_SECRET_KEY: z.preprocess(cleanRequiredEnvString, z.string().min(1, 'STRIPE_SECRET_KEY is required')),
        STRIPE_WEBHOOK_SECRET: z.preprocess(cleanOptionalEnvString, z.string().min(1).optional()),
        STRIPE_MODE: z.enum(['payment', 'subscription']).optional().default('payment'),
        STRIPE_PRICE_ID: z.preprocess(
            cleanOptionalEnvString,
            z
                .string()
                .min(1)
                .regex(/^price_/, 'STRIPE_PRICE_ID must look like price_...')
                .optional()
        ),
        STRIPE_PRODUCT_NAME: z.preprocess(cleanOptionalEnvString, z.string().min(1).optional().default('Pro Access')),
        STRIPE_CURRENCY: z
            .preprocess(
                cleanOptionalEnvString,
                z
                    .string()
                    .min(3)
                    .max(3)
                    .transform((v) => v.toLowerCase())
                    .refine((v) => /^[a-z]{3}$/.test(v), 'STRIPE_CURRENCY must be a 3-letter currency code')
            )
            .optional()
            .default('usd'),
        STRIPE_UNIT_AMOUNT: z.preprocess(cleanOptionalEnvString, z.string().min(1).optional().default('1000')),
        STRIPE_RECURRING_INTERVAL: z.preprocess(cleanOptionalEnvString, z.enum(['month', 'year']).optional()),
        STRIPE_RECURRING_INTERVAL_COUNT: z.preprocess(cleanOptionalEnvString, z.string().min(1).optional()),

        PORT: z.preprocess(cleanOptionalEnvString, z.string().optional()),
        BASE_URL: z.preprocess(cleanOptionalEnvString, z.string().optional()),
    })
    .passthrough();

export const ENV = EnvSchema.parse(process.env);
export const NODE_ENV = ENV.NODE_ENV;
export const IS_PROD = NODE_ENV === 'production';

export const PORT = ENV.PORT ? Number(ENV.PORT) : 3000;
export const BASE_URL = ENV.BASE_URL || `http://127.0.0.1:${PORT}`;

if (IS_PROD && !ENV.STRIPE_WEBHOOK_SECRET) {
    throw new Error('Missing required env var in production: STRIPE_WEBHOOK_SECRET');
}
