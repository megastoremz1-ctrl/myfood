import { createBrowserClient } from '@supabase/ssr';

/**
 * Supabase Client for MyFood
 * 
 * Handles:
 * - Authentication (email/password, phone OTP, social login)
 * - File Storage (menu images, restaurant logos, user avatars)
 * 
 * Configure in .env.local:
 * NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
 * NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Singleton instance for client-side usage
let clientInstance: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabase() {
  if (!clientInstance) {
    clientInstance = createClient();
  }
  return clientInstance;
}
