import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rpkpuialhqvlodzszucn.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwa3B1aWFsaHF2bG9kenN6dWNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMDM0NDQsImV4cCI6MjA5MjY3OTQ0NH0....'; // ⚠️ ใส่ Key ของคุณตรงๆ

export const supabase = createClient(supabaseUrl, supabaseKey);