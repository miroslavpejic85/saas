import { z } from 'zod';

import { cleanOptionalEnvString, parseOptionalBool, parseOptionalCsv } from '@/lib/envParsers';

export function normalizeMiroTalkDomain(raw: string): { domain: string; baseUrl: string } {
    const trimmed = raw.trim().replace(/\/+$/, '');

    if (/^https?:\/\//i.test(trimmed)) {
        const domain = trimmed.replace(/^https?:\/\//i, '').replace(/\/+$/, '');
        return { domain, baseUrl: trimmed };
    }

    const domain = trimmed.replace(/^\/\//, '').replace(/\/+$/, '');
    return { domain, baseUrl: `https://${domain}` };
}

const MiroTalkWidgetPublicEnvSchema = z
    .object({
        NEXT_PUBLIC_MIROTALK_WIDGET_ENABLED: z.preprocess(parseOptionalBool, z.boolean().optional()).optional(),
        NEXT_PUBLIC_MIROTALK_DOMAIN: z.preprocess(cleanOptionalEnvString, z.string().min(1).optional()),

        // Optional override if your widget script is hosted elsewhere.
        // Example: https://sfu.mirotalk.com/js/Widget.js
        NEXT_PUBLIC_MIROTALK_WIDGET_SCRIPT_SRC: z.preprocess(cleanOptionalEnvString, z.string().url().optional()),

        NEXT_PUBLIC_MIROTALK_ROOM: z
            .preprocess(cleanOptionalEnvString, z.string().min(1).optional())
            .default('support-room'),
        NEXT_PUBLIC_MIROTALK_THEME: z.preprocess(cleanOptionalEnvString, z.string().min(1).optional()).default('dark'),
        NEXT_PUBLIC_MIROTALK_WIDGET_TYPE: z
            .preprocess(cleanOptionalEnvString, z.string().min(1).optional())
            .default('support'),
        NEXT_PUBLIC_MIROTALK_WIDGET_STATE: z
            .preprocess(cleanOptionalEnvString, z.string().min(1).optional())
            .default('normal'),
        NEXT_PUBLIC_MIROTALK_POSITION: z
            .preprocess(cleanOptionalEnvString, z.string().min(1).optional())
            .default('bottom-right'),

        NEXT_PUBLIC_MIROTALK_DRAGGABLE: z.preprocess(parseOptionalBool, z.boolean().optional()).default(false),
        NEXT_PUBLIC_MIROTALK_CHECK_ONLINE: z.preprocess(parseOptionalBool, z.boolean().optional()).default(false),

        NEXT_PUBLIC_MIROTALK_EXPERT_IMAGES: z
            .preprocess(parseOptionalCsv, z.array(z.string()).optional())
            .default([
                'https://i.pravatar.cc/40?img=1',
                'https://i.pravatar.cc/40?img=2',
                'https://i.pravatar.cc/40?img=3',
            ]),
        NEXT_PUBLIC_MIROTALK_BUTTONS: z
            .preprocess(parseOptionalCsv, z.array(z.string()).optional())
            .default(['audio', 'video', 'screen', 'chat', 'join']),

        NEXT_PUBLIC_MIROTALK_HEADING: z
            .preprocess(cleanOptionalEnvString, z.string().min(1).optional())
            .default('Need Help?'),
        NEXT_PUBLIC_MIROTALK_SUBHEADING: z
            .preprocess(cleanOptionalEnvString, z.string().min(1).optional())
            .default('Get instant support from our expert team!'),
        NEXT_PUBLIC_MIROTALK_CONNECT_TEXT: z
            .preprocess(cleanOptionalEnvString, z.string().min(1).optional())
            .default('connect in < 5 seconds'),
        NEXT_PUBLIC_MIROTALK_ONLINE_TEXT: z
            .preprocess(cleanOptionalEnvString, z.string().min(1).optional())
            .default('We are online'),
        NEXT_PUBLIC_MIROTALK_OFFLINE_TEXT: z
            .preprocess(cleanOptionalEnvString, z.string().min(1).optional())
            .default('We are offline'),
        NEXT_PUBLIC_MIROTALK_POWERED_BY: z
            .preprocess(cleanOptionalEnvString, z.string().min(1).optional())
            .default('Powered by MiroTalk'),

        NEXT_PUBLIC_MIROTALK_DEBUG: z.preprocess(parseOptionalBool, z.boolean().optional()).optional(),
    })
    .passthrough();

export type MiroTalkWidgetPublicConfig = {
    enabled: boolean;
    domainRaw?: string;
    domain?: string;
    baseUrl?: string;
    scriptSrc?: string;

    room: string;
    theme: string;
    widgetType: string;
    widgetState: string;
    position: string;

    draggable: boolean;
    checkOnline: boolean;

    expertImages: string[];
    buttons: string[];

    heading: string;
    subheading: string;
    connectText: string;
    onlineText: string;
    offlineText: string;
    poweredBy: string;

    debug: boolean;
};

export function getMiroTalkWidgetPublicConfig(): MiroTalkWidgetPublicConfig {
    const parsed = MiroTalkWidgetPublicEnvSchema.parse({
        NEXT_PUBLIC_MIROTALK_WIDGET_ENABLED: process.env.NEXT_PUBLIC_MIROTALK_WIDGET_ENABLED,
        NEXT_PUBLIC_MIROTALK_DOMAIN: process.env.NEXT_PUBLIC_MIROTALK_DOMAIN,
        NEXT_PUBLIC_MIROTALK_WIDGET_SCRIPT_SRC: process.env.NEXT_PUBLIC_MIROTALK_WIDGET_SCRIPT_SRC,
        NEXT_PUBLIC_MIROTALK_ROOM: process.env.NEXT_PUBLIC_MIROTALK_ROOM,
        NEXT_PUBLIC_MIROTALK_THEME: process.env.NEXT_PUBLIC_MIROTALK_THEME,
        NEXT_PUBLIC_MIROTALK_WIDGET_TYPE: process.env.NEXT_PUBLIC_MIROTALK_WIDGET_TYPE,
        NEXT_PUBLIC_MIROTALK_WIDGET_STATE: process.env.NEXT_PUBLIC_MIROTALK_WIDGET_STATE,
        NEXT_PUBLIC_MIROTALK_POSITION: process.env.NEXT_PUBLIC_MIROTALK_POSITION,
        NEXT_PUBLIC_MIROTALK_DRAGGABLE: process.env.NEXT_PUBLIC_MIROTALK_DRAGGABLE,
        NEXT_PUBLIC_MIROTALK_CHECK_ONLINE: process.env.NEXT_PUBLIC_MIROTALK_CHECK_ONLINE,
        NEXT_PUBLIC_MIROTALK_EXPERT_IMAGES: process.env.NEXT_PUBLIC_MIROTALK_EXPERT_IMAGES,
        NEXT_PUBLIC_MIROTALK_BUTTONS: process.env.NEXT_PUBLIC_MIROTALK_BUTTONS,
        NEXT_PUBLIC_MIROTALK_HEADING: process.env.NEXT_PUBLIC_MIROTALK_HEADING,
        NEXT_PUBLIC_MIROTALK_SUBHEADING: process.env.NEXT_PUBLIC_MIROTALK_SUBHEADING,
        NEXT_PUBLIC_MIROTALK_CONNECT_TEXT: process.env.NEXT_PUBLIC_MIROTALK_CONNECT_TEXT,
        NEXT_PUBLIC_MIROTALK_ONLINE_TEXT: process.env.NEXT_PUBLIC_MIROTALK_ONLINE_TEXT,
        NEXT_PUBLIC_MIROTALK_OFFLINE_TEXT: process.env.NEXT_PUBLIC_MIROTALK_OFFLINE_TEXT,
        NEXT_PUBLIC_MIROTALK_POWERED_BY: process.env.NEXT_PUBLIC_MIROTALK_POWERED_BY,
        NEXT_PUBLIC_MIROTALK_DEBUG: process.env.NEXT_PUBLIC_MIROTALK_DEBUG,
    });

    const debugDefault = process.env.NODE_ENV !== 'production';
    const debug = parsed.NEXT_PUBLIC_MIROTALK_DEBUG ?? debugDefault;

    // Backwards-compatible default: if you don't set the flag, widget stays enabled.
    const enabled = parsed.NEXT_PUBLIC_MIROTALK_WIDGET_ENABLED ?? true;

    const domainRaw = parsed.NEXT_PUBLIC_MIROTALK_DOMAIN;
    if (!domainRaw) {
        return {
            enabled,
            domainRaw,
            room: parsed.NEXT_PUBLIC_MIROTALK_ROOM,
            theme: parsed.NEXT_PUBLIC_MIROTALK_THEME,
            widgetType: parsed.NEXT_PUBLIC_MIROTALK_WIDGET_TYPE,
            widgetState: parsed.NEXT_PUBLIC_MIROTALK_WIDGET_STATE,
            position: parsed.NEXT_PUBLIC_MIROTALK_POSITION,
            draggable: parsed.NEXT_PUBLIC_MIROTALK_DRAGGABLE,
            checkOnline: parsed.NEXT_PUBLIC_MIROTALK_CHECK_ONLINE,
            expertImages: parsed.NEXT_PUBLIC_MIROTALK_EXPERT_IMAGES,
            buttons: parsed.NEXT_PUBLIC_MIROTALK_BUTTONS,
            heading: parsed.NEXT_PUBLIC_MIROTALK_HEADING,
            subheading: parsed.NEXT_PUBLIC_MIROTALK_SUBHEADING,
            connectText: parsed.NEXT_PUBLIC_MIROTALK_CONNECT_TEXT,
            onlineText: parsed.NEXT_PUBLIC_MIROTALK_ONLINE_TEXT,
            offlineText: parsed.NEXT_PUBLIC_MIROTALK_OFFLINE_TEXT,
            poweredBy: parsed.NEXT_PUBLIC_MIROTALK_POWERED_BY,
            debug,
        };
    }

    const { domain, baseUrl } = normalizeMiroTalkDomain(domainRaw);
    const scriptSrc = parsed.NEXT_PUBLIC_MIROTALK_WIDGET_SCRIPT_SRC || `${baseUrl}/js/widget.js`; // MiroTalk SFU has /js/Widget.js

    return {
        enabled,
        domainRaw,
        domain,
        baseUrl,
        scriptSrc,
        room: parsed.NEXT_PUBLIC_MIROTALK_ROOM,
        theme: parsed.NEXT_PUBLIC_MIROTALK_THEME,
        widgetType: parsed.NEXT_PUBLIC_MIROTALK_WIDGET_TYPE,
        widgetState: parsed.NEXT_PUBLIC_MIROTALK_WIDGET_STATE,
        position: parsed.NEXT_PUBLIC_MIROTALK_POSITION,
        draggable: parsed.NEXT_PUBLIC_MIROTALK_DRAGGABLE,
        checkOnline: parsed.NEXT_PUBLIC_MIROTALK_CHECK_ONLINE,
        expertImages: parsed.NEXT_PUBLIC_MIROTALK_EXPERT_IMAGES,
        buttons: parsed.NEXT_PUBLIC_MIROTALK_BUTTONS,
        heading: parsed.NEXT_PUBLIC_MIROTALK_HEADING,
        subheading: parsed.NEXT_PUBLIC_MIROTALK_SUBHEADING,
        connectText: parsed.NEXT_PUBLIC_MIROTALK_CONNECT_TEXT,
        onlineText: parsed.NEXT_PUBLIC_MIROTALK_ONLINE_TEXT,
        offlineText: parsed.NEXT_PUBLIC_MIROTALK_OFFLINE_TEXT,
        poweredBy: parsed.NEXT_PUBLIC_MIROTALK_POWERED_BY,
        debug,
    };
}
