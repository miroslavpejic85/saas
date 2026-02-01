'use client';

import { useEffect, useState } from 'react';

function safeJsonParse(text: string): unknown {
    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
}

async function apiRequest(url: string, options: RequestInit = {}): Promise<any> {
    const res = await fetch(url, {
        credentials: 'same-origin',
        cache: 'no-store',
        ...options,
    });

    const text = await res.text();
    const data = (safeJsonParse(text) as any) ?? { raw: text };

    if (!res.ok) {
        const message = data && data.error ? data.error : `Request failed (${res.status})`;
        throw new Error(message);
    }

    return data;
}

async function apiGet(url: string): Promise<any> {
    return apiRequest(url);
}

async function apiPost(url: string, body: unknown): Promise<any> {
    return apiRequest(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body ?? {}),
    });
}

export default function PricingPage() {
    const [out, setOut] = useState<string>('');

    useEffect(() => {
        (async () => {
            try {
                const me = await apiGet('/api/me');
                if (me.paid) {
                    window.location.href = '/protected';
                    return;
                }
                setOut(`Logged in as ${me.user.email}. Ready to pay.`);
            } catch {
                setOut('Login required to pay.');
            }
        })();
    }, []);

    return (
        <main className="container">
            <h1>Pricing</h1>
            <p>Pay to unlock the protected page.</p>

            <div className="card">
                <h2>Pro Access</h2>
                <p>One-time payment via Stripe Checkout.</p>
                <button
                    className="btn"
                    onClick={async () => {
                        setOut('');
                        try {
                            const data = await apiPost('/api/stripe/create-checkout-session', {});
                            window.location.href = data.url;
                        } catch (e) {
                            const message = e instanceof Error ? e.message : String(e);
                            setOut(message + '\n(You must login first.)');
                        }
                    }}
                >
                    Pay with Stripe
                </button>
            </div>

            <pre className="status">{out}</pre>

            <p>
                <a href="/">Home</a>
            </p>
        </main>
    );
}
