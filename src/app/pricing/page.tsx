'use client';

import Link from 'next/link';

import { usePricingCheckout } from '@/hooks/usePricingCheckout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function PricingPage() {
    const { status, busy, pay } = usePricingCheckout();

    return (
        <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-10">
            <div className="space-y-1">
                <h1 className="text-3xl font-semibold tracking-tight">Pricing</h1>
                <p className="text-sm text-muted-foreground">Pay to unlock the protected page.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Pro Access</CardTitle>
                    <CardDescription>One-time payment via Stripe Checkout.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    <Button onClick={pay} disabled={busy}>
                        Pay with Stripe
                    </Button>
                    <Button asChild variant="outline" disabled={busy}>
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
