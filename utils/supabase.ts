// utils/supabase.ts
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config(); // 💥 Bu satır en üstte olmalı!

const supabaseUrl = process.env.SUPABASE_API_URL!;
const supabaseKey = process.env.SUPABASE_API_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase env değişkenleri eksik");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
