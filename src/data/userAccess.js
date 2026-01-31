import { supabaseAdmin } from '../clients/supabase.js';

export async function getPaidForUser(userId) {
    const { data, error } = await supabaseAdmin.from('user_access').select('paid').eq('user_id', userId).maybeSingle();

    if (error) throw error;
    return data?.paid === true;
}

export async function upsertUserAccess(userId, fields) {
    const payload = {
        user_id: userId,
        ...fields,
        updated_at: new Date().toISOString(),
    };

    return supabaseAdmin.from('user_access').upsert(payload);
}
