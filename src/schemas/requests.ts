import { z } from 'zod';

export const sendOtpRequestSchema = z.object({
    email: z.string().trim().email('Invalid email'),
});

export const verifyOtpRequestSchema = z.object({
    email: z.string().trim().email('Invalid email'),
    token: z.string().trim().min(1, 'Missing token'),
});

// This endpoint doesn't require any specific body, but we still accept only JSON objects.
export const createCheckoutSessionRequestSchema = z.object({}).passthrough();

export type SendOtpRequest = z.infer<typeof sendOtpRequestSchema>;
export type VerifyOtpRequest = z.infer<typeof verifyOtpRequestSchema>;
export type CreateCheckoutSessionRequest = z.infer<typeof createCheckoutSessionRequestSchema>;
