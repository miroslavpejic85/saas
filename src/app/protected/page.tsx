import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { MiroTalkSupportWidget } from '@/app/protected/_components/MiroTalkSupportWidget';

export default function ProtectedPage() {
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
                        <Button asChild variant="secondary">
                            <Link href="/protected/mirotalk">MiroTalk</Link>
                        </Button>
                        <Button asChild variant="secondary">
                            <Link href="/protected/account">Account</Link>
                        </Button>
                        <Button asChild variant="secondary">
                            <Link href="/protected/settings">Settings</Link>
                        </Button>
                        <Button asChild variant="secondary">
                            <Link href="/protected/billing">Billing</Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/">Home</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <MiroTalkSupportWidget />
        </main>
    );
}
