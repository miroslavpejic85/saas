'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ProtectedError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-10">
            <div className="space-y-1">
                <h1 className="text-3xl font-semibold tracking-tight">Protected</h1>
                <p className="text-sm text-muted-foreground">Something crashed inside this route.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Unexpected error</CardTitle>
                    <CardDescription>Try again, or go back home.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    <Button onClick={reset}>Try again</Button>
                    <Button asChild variant="outline">
                        <Link href="/">Home</Link>
                    </Button>
                </CardContent>
            </Card>

            <Alert variant="destructive">
                <AlertTitle>Details</AlertTitle>
                <AlertDescription>
                    <pre className="whitespace-pre-wrap font-mono text-xs">{error.message}</pre>
                </AlertDescription>
            </Alert>
        </main>
    );
}
