// Shared browser helpers (no build step)

function safeJsonParse(text) {
    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
}

async function apiRequest(url, options = {}) {
    const res = await fetch(url, {
        credentials: 'same-origin',
        cache: 'no-store',
        ...options,
    });

    const text = await res.text();
    const data = safeJsonParse(text) ?? { raw: text };

    if (!res.ok) {
        const message = data && data.error ? data.error : `Request failed (${res.status})`;
        const err = new Error(message);
        err.status = res.status;
        err.data = data;
        throw err;
    }

    return data;
}

async function apiGet(url) {
    return apiRequest(url);
}

async function apiPost(url, body) {
    return apiRequest(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body ?? {}),
    });
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
}

function pretty(obj) {
    return JSON.stringify(obj, null, 2);
}

function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

window.App = {
    apiGet,
    apiPost,
    setText,
    pretty,
    sleep,
};
