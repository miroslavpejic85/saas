import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import { Toaster } from '@/components/ui/sonner';

import './globals.css';

export const metadata: Metadata = {
    title: 'Supabase + Stripe App',
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body suppressHydrationWarning>
                {children}
                <Toaster position="top-right" />
            </body>
        </html>
    );
}
