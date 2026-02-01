import { z } from 'zod';

import { cleanOptionalEnvString } from '@/lib/envParsers';

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
