import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// SECURITY: Read credentials from environment variables at build time
// Add SUPABASE_URL and SUPABASE_ANON_KEY to your .env file (and .gitignore)
// IMPORTANT: Enable Row Level Security (RLS) on all Supabase tables
// If the key below has been exposed, rotate it immediately in Supabase dashboard
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.",
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
