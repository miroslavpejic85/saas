import { z } from 'zod';

export const okResponseSchema = z.object({ ok: z.literal(true) });

export const meResponseSchema = z.object({
    ok: z.literal(true),
    user: z.object({
        id: z.string(),
        email: z.string().email().nullable(),
    }),
    paid: z.boolean(),
});

export const sendOtpResponseSchema = okResponseSchema;
export const logoutResponseSchema = okResponseSchema;

export const verifyOtpResponseSchema = z.object({
    ok: z.literal(true),
    user: z.object({
        email: z.string().email().nullable(),
    }),
});

export const createCheckoutSessionResponseSchema = z.object({
    ok: z.literal(true),
    url: z.string().url().nullable(),
});

export type OkResponse = z.infer<typeof okResponseSchema>;
export type MeResponse = z.infer<typeof meResponseSchema>;
export type SendOtpResponse = z.infer<typeof sendOtpResponseSchema>;
export type LogoutResponse = z.infer<typeof logoutResponseSchema>;
export type VerifyOtpResponse = z.infer<typeof verifyOtpResponseSchema>;
export type CreateCheckoutSessionResponse = z.infer<typeof createCheckoutSessionResponseSchema>;
