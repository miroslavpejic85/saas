'use client';

import { useState } from 'react';

function safeJsonParse(text: string): unknown {
    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
}

async function apiPost(url: string, body: unknown): Promise<any> {
    const res = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body ?? {}),
    });

    const text = await res.text();
    const data = (safeJsonParse(text) as any) ?? { raw: text };

    if (!res.ok) {
        const message = data && data.error ? data.error : `Request failed (${res.status})`;
        throw new Error(message);
    }

    return data;
}

export default function LoginPage() {
    const [email, setEmail] = useState<string>('');
    const [code, setCode] = useState<string>('');
    const [out, setOut] = useState<string>('');

    return (
        <main className="container">
            <h1>Login</h1>
            <p>Enter your email. You&apos;ll receive a confirmation code.</p>

            <div className="card">
                <label>Email</label>
                <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <button
                    className="btn"
                    onClick={async () => {
                        setOut('');
                        try {
                            await apiPost('/api/auth/send-otp', { email: email.trim() });
                            setOut('OTP sent. Check your email.');
                        } catch (e) {
                            setOut(e instanceof Error ? e.message : String(e));
                        }
                    }}
                >
                    Send code
                </button>

                <hr />

                <label>Code</label>
                <input
                    id="code"
                    type="text"
                    placeholder="123456"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />

                <button
                    className="btn"
                    onClick={async () => {
                        setOut('');
                        try {
                            const data = await apiPost('/api/auth/verify-otp', {
                                email: email.trim(),
                                token: code.trim(),
                            });
                            setOut(`Logged in as: ${data.user.email}\nRedirecting to home...`);
                            setTimeout(() => {
                                window.location.href = '/';
                            }, 600);
                        } catch (e) {
                            setOut(e instanceof Error ? e.message : String(e));
                        }
                    }}
                >
                    Verify &amp; Login
                </button>

                <button
                    className="btn secondary"
                    onClick={async () => {
                        try {
                            await apiPost('/api/auth/logout', {});
                            setOut('Logged out.');
                        } catch (e) {
                            setOut(e instanceof Error ? e.message : String(e));
                        }
                    }}
                >
                    Logout
                </button>
            </div>

            <pre className="status">{out}</pre>

            <p>
                <a href="/">Home</a>
            </p>
        </main>
    );
}
