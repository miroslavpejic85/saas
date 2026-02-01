'use client';

import Link from 'next/link';

import { useRequirePaid } from '@/hooks/useRequirePaid';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ProtectedPage() {
    const { checking, error } = useRequirePaid({
        unauthorizedRedirectTo: '/login',
        notPaidRedirectTo: '/pricing',
    });

    if (checking) {
        return (
            <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-10">
                <div className="space-y-1">
                    <h1 className="text-3xl font-semibold tracking-tight">Protected Page</h1>
                    <p className="text-sm text-muted-foreground">Checking access…</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Loading</CardTitle>
                        <CardDescription>Verifying your session and access.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        <Button asChild variant="outline">
                            <Link href="/">Home</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Alert>
                    <AlertTitle>Status</AlertTitle>
                    <AlertDescription>Checking access…</AlertDescription>
                </Alert>
            </main>
        );
    }

    if (error) {
        return (
            <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-10">
                <div className="space-y-1">
                    <h1 className="text-3xl font-semibold tracking-tight">Protected Page</h1>
                    <p className="text-sm text-muted-foreground">Access check failed.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Error</CardTitle>
                        <CardDescription>Something went wrong while verifying access.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button asChild variant="outline">
                            <Link href="/">Home</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Alert variant="destructive">
                    <AlertTitle>Details</AlertTitle>
                    <AlertDescription>
                        <pre className="whitespace-pre-wrap font-mono text-xs">{error}</pre>
                    </AlertDescription>
                </Alert>
            </main>
        );
    }

    return (
        <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-10">
            <div className="space-y-1">
                <h1 className="text-3xl font-semibold tracking-tight">Protected Page</h1>
                <p className="text-sm text-muted-foreground">If you can see this, you&apos;re paid.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Members area</CardTitle>
                    <CardDescription>Put your premium content here.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>Tools, links, onboarding steps, docs, etc.</p>
                    <div className="flex flex-wrap gap-2">
                        <Button asChild variant="outline">
                            <Link href="/">Home</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
