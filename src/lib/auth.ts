/**
 * MyFood Authentication Service
 * 
 * Wraps Supabase Auth for:
 * - Email/password registration and login
 * - Phone number OTP (M-Pesa style)
 * - Password reset
 * - Session management
 * - User profile updates
 */

import { getSupabase } from './supabase';

export type UserRole = 'client' | 'business' | 'driver' | 'admin';

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: any;
}

/**
 * Register a new user with email and password
 */
export async function signUp(
  email: string,
  password: string,
  metadata?: { name?: string; phone?: string; role?: UserRole }
): Promise<AuthResult> {
  const supabase = getSupabase();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: metadata?.name || '',
        phone: metadata?.phone || '',
        role: metadata?.role || 'client',
      },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, user: data.user };
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string): Promise<AuthResult> {
  const supabase = getSupabase();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, user: data.user };
}

/**
 * Sign in with phone number (OTP)
 * Sends a verification code via SMS
 */
export async function signInWithPhone(phone: string): Promise<AuthResult> {
  const supabase = getSupabase();

  const { error } = await supabase.auth.signInWithOtp({
    phone,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Verify phone OTP code
 */
export async function verifyPhoneOtp(phone: string, token: string): Promise<AuthResult> {
  const supabase = getSupabase();

  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, user: data.user };
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  const supabase = getSupabase();
  await supabase.auth.signOut();
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser() {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Get the current session
 */
export async function getSession() {
  const supabase = getSupabase();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<AuthResult> {
  const supabase = getSupabase();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Update user password
 */
export async function updatePassword(newPassword: string): Promise<AuthResult> {
  const supabase = getSupabase();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Update user profile metadata
 */
export async function updateProfile(data: {
  name?: string;
  phone?: string;
  avatar_url?: string;
}): Promise<AuthResult> {
  const supabase = getSupabase();

  const { error } = await supabase.auth.updateUser({
    data: {
      full_name: data.name,
      phone: data.phone,
      avatar_url: data.avatar_url,
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  const supabase = getSupabase();
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
  return subscription;
}
