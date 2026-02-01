'use client';

import Link from 'next/link';
import { useState } from 'react';

import { apiGet } from '@/lib/http';
import type { MeResponse } from '@/lib/apiTypes';
import { meResponseSchema } from '@/lib/apiTypes';
import { useAsyncEffect } from '@/hooks/useAsyncEffect';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function HomePage() {
    const [status, setStatus] = useState<string>('Loading...');

    useAsyncEffect(async (signal) => {
        try {
            const data = await apiGet<MeResponse>('/api/me', meResponseSchema);
            if (signal.aborted) return;
            setStatus(JSON.stringify(data, null, 2));
        } catch {
            if (signal.aborted) return;
            setStatus('Not logged in.');
        }
    }, []);

    return (
        <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-10">
            <div className="space-y-1">
                <h1 className="text-3xl font-semibold tracking-tight">Supabase Auth (Email OTP) + Stripe</h1>
                <p className="text-sm text-muted-foreground">
                    Demo app: login via email code, pay with Stripe, unlock protected page.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Navigation</CardTitle>
                    <CardDescription>Jump to the key flows.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    <Button asChild>
                        <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild variant="secondary">
                        <Link href="/pricing">Pricing</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/protected">Protected Page</Link>
                    </Button>
                </CardContent>
            </Card>

            <div className="space-y-2">
                <div className="text-sm font-medium">Session</div>
                <Alert>
                    <AlertTitle>Current state</AlertTitle>
                    <AlertDescription>
                        <pre className="max-h-[240px] overflow-auto whitespace-pre-wrap font-mono text-xs">
                            {status}
                        </pre>
                    </AlertDescription>
                </Alert>
            </div>
        </main>
    );
}
