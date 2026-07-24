'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getSupabase } from '@/lib/supabase';

type AuthMode = 'login' | 'register';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = getSupabase();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      if (error.message.includes('Invalid login')) {
        setError('Email ou senha incorretos.');
      } else if (error.message.includes('Email not confirmed')) {
        setError('Confirme o seu email antes de entrar. Verifique a caixa de entrada.');
      } else {
        setError(error.message);
      }
    } else {
      router.push('/cliente');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    const supabase = getSupabase();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, role: 'client' },
      },
    });
    setLoading(false);

    if (error) {
      if (error.message.includes('already registered')) {
        setError('Este email ja esta registado. Tente entrar.');
      } else {
        setError(error.message);
      }
    } else {
      setSuccess('Conta criada com sucesso!');
      setTimeout(() => router.push('/auth/bem-vindo'), 1000);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');

    const supabase = getSupabase();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/cliente`,
      },
    });

    if (error) {
      setError('Erro ao conectar com Google. Tente novamente.');
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Digite o seu email acima primeiro');
      return;
    }
    setError('');
    const supabase = getSupabase();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset`,
    });
    if (error) {
      setError(error.message);
    } else {
      setSuccess('Email de recuperacao enviado! Verifique a sua caixa de entrada.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <img src="/logo.svg" alt="MyFood" className="h-10 mx-auto mb-4" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === 'login' ? 'Entrar na sua conta' : 'Criar conta'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {mode === 'login' ? 'Bem-vindo de volta ao MyFood' : 'Junte-se a milhares de utilizadores'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-secondary-50 border border-secondary-100 rounded-xl text-sm text-secondary-600">
              {success}
            </div>
          )}

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all mb-5"
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            {googleLoading ? 'Conectando...' : 'Continuar com Google'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">ou com email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Login Form */}
          {mode === 'login' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" className="input-field pl-10 text-sm" required />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Sua senha" className="input-field pl-10 pr-10 text-sm" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="text-right">
                <button type="button" onClick={handleForgotPassword} className="text-xs text-primary-500 font-medium hover:underline">
                  Esqueceu a senha?
                </button>
              </div>
              <button type="submit" disabled={loading} className="w-full btn-primary text-sm flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          )}

          {/* Register Form */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Nome completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" className="input-field pl-10 text-sm" required />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" className="input-field pl-10 text-sm" required />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 caracteres" className="input-field pl-10 pr-10 text-sm" required minLength={6} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Minimo 6 caracteres</p>
              </div>
              <button type="submit" disabled={loading} className="w-full btn-primary text-sm flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'Criando conta...' : 'Criar conta'}
              </button>
            </form>
          )}

          {/* Switch mode */}
          <div className="text-center mt-5 text-sm text-gray-500">
            {mode === 'login' ? (
              <p>Nao tem conta? <button onClick={() => { setMode('register'); setError(''); setSuccess(''); }} className="text-primary-500 font-semibold hover:underline">Criar conta</button></p>
            ) : (
              <p>Ja tem conta? <button onClick={() => { setMode('login'); setError(''); setSuccess(''); }} className="text-primary-500 font-semibold hover:underline">Entrar</button></p>
            )}
          </div>
        </div>

        {/* Back to portal */}
        <div className="text-center mt-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600">
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao portal
          </Link>
        </div>
      </div>
    </div>
  );
}
