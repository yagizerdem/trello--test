import { createClient } from "@supabase/supabase-js";
import SD from "./SD";

// Create a single supabase client for interacting with your database
const supabase = createClient(SD.settings.URL, SD.settings.ANONAPIKEY);

export default supabase;
