import { getMiroTalkIframePublicConfig } from '@/lib/mirotalkIframeConfig';

export default function MiroTalkPage() {
    const { iframeSrc } = getMiroTalkIframePublicConfig();

    return (
        <iframe
            id="mirotalkIframe"
            title="MiroTalk"
            allow="camera; microphone; display-capture; fullscreen; clipboard-read; clipboard-write; web-share; autoplay"
            src={iframeSrc}
            style={{ height: '100vh', width: '100vw', border: 0 }}
        />
    );
}
