import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

export const supabase: SupabaseClient = createClient(
    environment.supabaseUrl,
    environment.supabaseAnonKey
);
