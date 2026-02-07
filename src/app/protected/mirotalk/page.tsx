import { getMiroTalkIframePublicConfig } from '@/lib/mirotalkIframeConfig';

export default function MiroTalkPage() {
    const { iframeSrc } = getMiroTalkIframePublicConfig();

    return (
        <iframe
            id="mirotalkIframe"
            title="MiroTalk"
            allow="camera; microphone; speaker-selection; display-capture; fullscreen; clipboard-read; clipboard-write; web-share; autoplay; encrypted-media; picture-in-picture"
            src={iframeSrc}
            style={{ height: '100vh', width: '100vw', border: 0 }}
        />
    );
}
