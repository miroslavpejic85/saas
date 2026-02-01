import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { getPaidForUser } from '@/server/data/userAccess';
import { getUserFromCookies } from '@/server/auth/session';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const { user } = await getUserFromCookies(cookieStore);

    if (!user) {
        redirect('/login');
    }

    const paid = await getPaidForUser(user.id);
    if (!paid) {
        redirect('/pricing');
    }

    return <>{children}</>;
}
