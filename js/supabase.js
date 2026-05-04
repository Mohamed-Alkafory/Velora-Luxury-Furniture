import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// SECURITY: Read credentials from environment variables at build time
// Add SUPABASE_URL and SUPABASE_ANON_KEY to your .env file (and .gitignore)
// IMPORTANT: Enable Row Level Security (RLS) on all Supabase tables
// If the key below has been exposed, rotate it immediately in Supabase dashboard
const SUPABASE_URL = "https://wnspbwpeyxecmhxtnvcm.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_MBv3cZfo6Bz3a63_ZFUL8Q_3MPsWoxe";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
