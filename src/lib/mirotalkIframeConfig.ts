import { z } from 'zod';

function cleanOptionalEnvString(value: unknown): string | undefined {
    if (value === undefined || value === null) return undefined;
    if (typeof value !== 'string') return String(value);
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    const unquoted = trimmed.replace(/^['"](.*)['"]$/, '$1').trim();
    return unquoted || undefined;
}

const MiroTalkIframePublicEnvSchema = z
    .object({
        NEXT_PUBLIC_MIROTALK_IFRAME_SRC: z.preprocess(cleanOptionalEnvString, z.string().min(1).optional()),
    })
    .passthrough();

export type MiroTalkIframePublicConfig = {
    iframeSrc: string;
};

export function getMiroTalkIframePublicConfig(options?: { fallbackSrc?: string }): MiroTalkIframePublicConfig {
    const parsed = MiroTalkIframePublicEnvSchema.parse({
        NEXT_PUBLIC_MIROTALK_IFRAME_SRC: process.env.NEXT_PUBLIC_MIROTALK_IFRAME_SRC,
    });

    const fallbackSrc = options?.fallbackSrc || 'https://p2p.mirotalk.com/newcall';
    const iframeSrc = parsed.NEXT_PUBLIC_MIROTALK_IFRAME_SRC || fallbackSrc;

    return { iframeSrc };
}
