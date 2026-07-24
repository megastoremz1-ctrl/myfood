'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getSupabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  avatarUrl: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  signInWithPhone: (phone: string) => Promise<{ success: boolean; error?: string }>;
  verifyOtp: (phone: string, token: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  uploadAvatar: (file: File) => Promise<{ success: boolean; url?: string; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabase();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: sess } }: { data: { session: Session | null } }) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        buildProfile(sess.user);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, sess: Session | null) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        buildProfile(sess.user);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  function buildProfile(user: User): void {
    setProfile({
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.full_name || user.user_metadata?.name || '',
      phone: user.user_metadata?.phone || user.phone || '',
      avatarUrl: user.user_metadata?.avatar_url || '',
      role: user.user_metadata?.role || 'client',
    });
  }

  async function signIn(email: string, password: string) {
    const supabase = getSupabase();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }

  async function signUp(email: string, password: string, name: string, phone?: string) {
    const supabase = getSupabase();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, phone: phone || '', role: 'client' },
      },
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }

  async function signInWithPhone(phone: string) {
    const supabase = getSupabase();
    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }

  async function verifyOtp(phone: string, token: string) {
    const supabase = getSupabase();
    const { error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }

  async function signOut() {
    const supabase = getSupabase();
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  }

  async function updateProfile(data: Partial<UserProfile>) {
    const supabase = getSupabase();
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: data.name,
        phone: data.phone,
        avatar_url: data.avatarUrl,
      },
    });
    if (error) return { success: false, error: error.message };
    if (profile) {
      setProfile({ ...profile, ...data });
    }
    return { success: true };
  }

  async function uploadAvatar(file: File) {
    const supabase = getSupabase();
    if (!user) return { success: false, error: 'Nao autenticado' };

    const ext = file.name.split('.').pop() || 'jpg';
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { cacheControl: '3600', upsert: true });

    if (uploadError) return { success: false, error: uploadError.message };

    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path);
    const url = urlData.publicUrl;

    // Update user metadata
    await supabase.auth.updateUser({ data: { avatar_url: url } });
    if (profile) {
      setProfile({ ...profile, avatarUrl: url });
    }

    return { success: true, url };
  }

  return (
    <AuthContext.Provider value={{
      user, profile, session, loading,
      signIn, signUp, signInWithPhone, verifyOtp, signOut, updateProfile, uploadAvatar,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
