// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// Exporta la interfaz usando 'export type'
export type Member = {
  id: string;
  name: string;
  email: string;
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
