import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

export default function ProtectedAccountPage() {
    return (
        <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-10">
            <div className="space-y-1">
                <h1 className="text-3xl font-semibold tracking-tight">Account</h1>
                <p className="text-sm text-muted-foreground">Example protected sub-page.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Account</CardTitle>
                    <CardDescription>Put account details here.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    <Button asChild>
                        <Link href="/protected">Protected home</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/">Home</Link>
                    </Button>
                </CardContent>
            </Card>
        </main>
    );
}
