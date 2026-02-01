'use client';

import Script from 'next/script';
import { useMemo, useRef, useState } from 'react';

import { getMiroTalkWidgetPublicConfig } from '@/lib/mirotalkWidgetConfig';

export function MiroTalkSupportWidget() {
    const config = useMemo(() => getMiroTalkWidgetPublicConfig(), []);

    const [scriptStatus, setScriptStatus] = useState<'idle' | 'loaded' | 'error'>('idle');
    const didInitRef = useRef(false);

    if (!config.enabled) return null;

    if (!config.domainRaw) {
        if (process.env.NODE_ENV !== 'production') {
            return (
                <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                    Set <span className="font-mono">NEXT_PUBLIC_MIROTALK_DOMAIN</span> to enable the support widget.
                </div>
            );
        }

        return null;
    }

    if (!config.domain || !config.scriptSrc) return null;

    return (
        <>
            <Script
                id="mirotalk-widget-script"
                src={config.scriptSrc}
                strategy="afterInteractive"
                onLoad={() => {
                    setScriptStatus('loaded');

                    // Widget.js relies on a DOMContentLoaded listener for auto-init.
                    // When loaded via next/script afterInteractive, DOMContentLoaded already fired,
                    // so we dispatch it once to trigger the widget's auto-init code.
                    if (!didInitRef.current) {
                        didInitRef.current = true;
                        try {
                            document.dispatchEvent(new Event('DOMContentLoaded'));
                        } catch {
                            // ignore
                        }
                    }
                }}
                onError={() => setScriptStatus('error')}
            />

            {/*
                MiroTalk Widget.js auto-initializes on DOMContentLoaded by looking for
                an element with the `data-mirotalk-auto` attribute.
            */}
            <div
                id="support-widget"
                data-mirotalk-auto
                data-domain={config.domain}
                data-room={config.room}
                data-theme={config.theme}
                data-widget-type={config.widgetType}
                data-widget-state={config.widgetState}
                data-position={config.position}
                data-draggable={String(config.draggable)}
                data-check-online={String(config.checkOnline)}
                data-expert-images={config.expertImages.join(',')}
                data-buttons={config.buttons.join(',')}
                data-heading={config.heading}
                data-subheading={config.subheading}
                data-connect-text={config.connectText}
                data-online-text={config.onlineText}
                data-offline-text={config.offlineText}
                data-powered-by={config.poweredBy}
            />

            {config.debug ? (
                <div className="rounded-lg border p-3 text-xs text-muted-foreground">
                    <div className="font-medium text-foreground">MiroTalk widget debug</div>
                    <div>
                        enabled: <span className="font-mono">{String(config.enabled)}</span>
                    </div>
                    <div>
                        domain: <span className="font-mono">{config.domain}</span>
                    </div>
                    <div>
                        script: <span className="font-mono">{config.scriptSrc}</span>
                    </div>
                    <div>
                        room: <span className="font-mono">{config.room}</span>
                    </div>
                    <div>
                        buttons: <span className="font-mono">{config.buttons.join(',')}</span>
                    </div>
                    <div>
                        status:{' '}
                        <span className="font-mono">
                            {scriptStatus === 'idle'
                                ? 'loading (or blocked)'
                                : scriptStatus === 'loaded'
                                  ? 'loaded'
                                  : 'error loading script'}
                        </span>
                    </div>
                    {scriptStatus === 'error' ? (
                        <div>
                            hint:{' '}
                            <span className="font-mono">
                                If this is <span className="font-mono">p2p.mirotalk.com</span>, it does not serve
                                <span className="font-mono">/js/Widget.js</span>. Use
                                <span className="font-mono">NEXT_PUBLIC_MIROTALK_WIDGET_SCRIPT_SRC</span> or a domain
                                that includes the widget assets.
                            </span>
                        </div>
                    ) : null}
                </div>
            ) : null}
        </>
    );
}
