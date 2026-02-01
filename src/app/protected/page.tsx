'use client';

import { useEffect, useState } from 'react';

type ApiError = Error & { status?: number; data?: unknown };

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
        const err: ApiError = new Error(message);
        err.status = res.status;
        err.data = data;
        throw err;
    }

    return data;
}

export default function ProtectedPage() {
    const [checking, setChecking] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        (async () => {
            try {
                const me = await apiGet('/api/me');
                if (!me.paid) {
                    window.location.href = '/pricing';
                    return;
                }
                setChecking(false);
            } catch (e) {
                const err = e as ApiError;
                if (err && err.status === 401) {
                    window.location.href = '/login';
                    return;
                }
                setError(err?.message || 'Server error');
                setChecking(false);
            }
        })();
    }, []);

    if (checking) {
        return (
            <main className="container">
                <h1>Protected Page</h1>
                <pre className="status">Checking access...</pre>
            </main>
        );
    }

    if (error) {
        return (
            <main className="container">
                <h1>Protected Page</h1>
                <pre className="status">{error}</pre>
            </main>
        );
    }

    return (
        <main className="container">
            <h1>Protected Page</h1>
            <p>If you can see this, you&apos;re paid.</p>

            <div className="card">
                <h2>Members area</h2>
                <p>Put your premium content here (tools, links, onboarding steps, docs, etc.).</p>
            </div>

            <p>
                <a href="/">Home</a>
            </p>
        </main>
    );
}
