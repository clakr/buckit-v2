import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
if (!supabaseUrl) throw new Error("no supabaseUrl found");

const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
if (!supabaseKey) throw new Error("no supabaseKey found");

export const supabase = createClient(supabaseUrl, supabaseKey);
