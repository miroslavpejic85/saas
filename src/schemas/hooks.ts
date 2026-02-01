import { z } from 'zod';

export const useOtpLoginOptionsSchema = z.object({
    redirectTo: z.string().default('/'),
    redirectDelayMs: z.number().int().min(0).default(600),
});

export const useRequirePaidOptionsSchema = z.object({
    unauthorizedRedirectTo: z.string().default('/login'),
    notPaidRedirectTo: z.string().default('/pricing'),
});

export const usePaymentConfirmationOptionsSchema = z.object({
    maxAttempts: z.number().int().min(1).max(200).default(20),
    intervalMs: z.number().int().min(100).max(60_000).default(1500),
    paidRedirectTo: z.string().default('/protected'),
    paidRedirectDelayMs: z.number().int().min(0).max(60_000).default(600),
});

export type UseOtpLoginOptions = z.input<typeof useOtpLoginOptionsSchema>;
export type UseRequirePaidOptions = z.input<typeof useRequirePaidOptionsSchema>;
export type UsePaymentConfirmationOptions = z.input<typeof usePaymentConfirmationOptionsSchema>;
