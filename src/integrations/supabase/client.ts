// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://lpurrypqwoxvwyjqwvwz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwdXJyeXBxd294dnd5anF3dnd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NDc0MzEsImV4cCI6MjA1ODAyMzQzMX0.F8x8n3e3122xx50cqIMYV3lDr4ez_9KqcQggZALqvf0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);