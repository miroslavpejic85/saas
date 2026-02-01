'use client';

import Link from 'next/link';

import { useOtpLogin } from '@/hooks/useOtpLogin';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function LoginPage() {
    const { email, setEmail, code, setCode, status, busy, sendCode, verifyAndLogin, logout } = useOtpLogin({
        redirectTo: '/',
    });

    return (
        <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-10">
            <div className="space-y-1">
                <h1 className="text-3xl font-semibold tracking-tight">Login</h1>
                <p className="text-sm text-muted-foreground">
                    Enter your email. You&apos;ll receive a confirmation code.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Email OTP</CardTitle>
                    <CardDescription>Send a one-time code and verify.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button onClick={sendCode} disabled={busy || !email.trim()}>
                            Send code
                        </Button>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <Label htmlFor="code">Code</Label>
                        <Input
                            id="code"
                            type="text"
                            placeholder="123456"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />

                        <div className="flex flex-wrap gap-2">
                            <Button onClick={verifyAndLogin} disabled={busy || !email.trim() || !code.trim()}>
                                Verify &amp; Login
                            </Button>
                            <Button variant="secondary" onClick={logout} disabled={busy}>
                                Logout
                            </Button>
                            <Button asChild variant="outline" disabled={busy}>
                                <Link href="/">Home</Link>
                            </Button>
                        </div>
                    </div>
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
