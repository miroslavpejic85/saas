'use client';

import Link from 'next/link';

import { usePaymentConfirmation } from '@/hooks/usePaymentConfirmation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function SuccessPage() {
    const { status } = usePaymentConfirmation({
        paidRedirectTo: '/protected',
    });

    return (
        <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-10">
            <div className="space-y-1">
                <h1 className="text-3xl font-semibold tracking-tight">Payment successful</h1>
                <p className="text-sm text-muted-foreground">
                    It can take a moment for the webhook to mark you as paid.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Next steps</CardTitle>
                    <CardDescription>Head to the protected page once access updates.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    <Button asChild>
                        <Link href="/protected">Go to protected page</Link>
                    </Button>
                    <Button asChild variant="secondary">
                        <Link href="/">Home</Link>
                    </Button>
                </CardContent>
            </Card>

            {status ? (
                <Alert>
                    <AlertTitle>Status</AlertTitle>
                    <AlertDescription>
                        <pre className="whitespace-pre-wrap font-mono text-xs">{status}</pre>
                    </AlertDescription>
                </Alert>
            ) : null}
        </main>
    );
}
