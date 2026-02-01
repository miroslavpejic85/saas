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

function sleep(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
}

export default function SuccessPage() {
    const [out, setOut] = useState<string>('');

    useEffect(() => {
        (async () => {
            setOut('Checking payment status...');

            for (let i = 0; i < 20; i++) {
                try {
                    const me = await apiGet('/api/me');
                    setOut(JSON.stringify(me, null, 2));
                    if (me.paid) {
                        setOut('Paid confirmed. Redirecting to protected...');
                        setTimeout(() => {
                            window.location.href = '/protected';
                        }, 600);
                        return;
                    }
                } catch {
                    setOut('Not logged in.');
                    return;
                }

                await sleep(1500);
            }

            setOut(
                (prev) =>
                    prev + '\n\nStill waiting for webhook. If this never updates, your Stripe webhook may be failing.'
            );
        })();
    }, []);

    return (
        <main className="container">
            <h1>Payment successful</h1>
            <p>It can take a moment for webhook to mark you as paid.</p>

            <div className="card">
                <a className="btn" href="/protected">
                    Go to protected page
                </a>
                <a className="btn secondary" href="/">
                    Home
                </a>
            </div>

            <pre className="status">{out}</pre>
        </main>
    );
}
