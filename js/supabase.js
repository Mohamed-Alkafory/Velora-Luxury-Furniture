import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://wnspbwpeyxecmhxtnvcm.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_MBv3cZfo6Bz3a63_ZFUL8Q_3MPsWoxe";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
