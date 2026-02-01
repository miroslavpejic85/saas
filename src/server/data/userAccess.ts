import 'server-only';

import { supabaseAdmin } from '@/server/clients/supabase';

export async function getPaidForUser(userId: string): Promise<boolean> {
    const { data, error } = await supabaseAdmin.from('user_access').select('paid').eq('user_id', userId).maybeSingle();

    if (error) throw error;
    return data?.paid === true;
}

export type UserAccessUpsertFields = {
    paid?: boolean;
    stripe_customer_id?: string | null;
    stripe_session_id?: string | null;
};

export async function upsertUserAccess(userId: string, fields: UserAccessUpsertFields) {
    const payload = {
        user_id: userId,
        ...fields,
        updated_at: new Date().toISOString(),
    };

    return supabaseAdmin.from('user_access').upsert(payload);
}
