'use client';

import { useEffect, useState } from 'react';

function safeJsonParse(text: string): unknown {
    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
}

async function apiGet(url: string): Promise<any> {
    const res = await fetch(url, {
        credentials: 'same-origin',
        cache: 'no-store',
    });

    const text = await res.text();
    const data = (safeJsonParse(text) as any) ?? { raw: text };

    if (!res.ok) {
        const message = data && data.error ? data.error : `Request failed (${res.status})`;
        throw new Error(message);
    }

    return data;
}

export default function HomePage() {
    const [status, setStatus] = useState<string>('Loading...');

    useEffect(() => {
        (async () => {
            try {
                const data = await apiGet('/api/me');
                setStatus(JSON.stringify(data, null, 2));
            } catch {
                setStatus('Not logged in.');
            }
        })();
    }, []);

    return (
        <main className="container">
            <h1>Supabase Auth (Email OTP) + Stripe</h1>
            <p>Demo app: login via email code, pay with Stripe, unlock protected page.</p>

            <div className="card">
                <a className="btn" href="/login">
                    Login
                </a>
                <a className="btn" href="/pricing">
                    Pricing
                </a>
                <a className="btn" href="/protected">
                    Protected Page
                </a>
            </div>

            <pre className="status">{status}</pre>
        </main>
    );
}
