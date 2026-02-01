import 'server-only';

import { createClient } from '@supabase/supabase-js';
import { ENV } from '@/server/config/env';

export const supabaseAnon = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY);
export const supabaseAdmin = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_SERVICE_ROLE_KEY);
