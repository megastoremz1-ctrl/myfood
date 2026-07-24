'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { signUp, signIn, signInWithPhone, verifyPhoneOtp } from '@/lib/auth';

type AuthMode = 'login' | 'register' | 'phone' | 'otp';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn(email, password);
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Erro ao entrar. Verifique os dados.');
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

    const result = await signUp(email, password, { name, phone, role: 'client' });
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Erro ao registar.');
    } else {
      setSuccess('Conta criada com sucesso!');
      setTimeout(() => router.push('/auth/bem-vindo'), 1000);
    }
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signInWithPhone(phone);
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Erro ao enviar codigo.');
    } else {
      setSuccess('Codigo enviado para ' + phone);
      setMode('otp');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await verifyPhoneOtp(phone, otpCode);
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Codigo invalido.');
    } else {
      router.push('/cliente');
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
            {mode === 'login' && 'Entrar na sua conta'}
            {mode === 'register' && 'Criar conta'}
            {mode === 'phone' && 'Entrar com telefone'}
            {mode === 'otp' && 'Verificar codigo'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {mode === 'login' && 'Bem-vindo de volta ao MyFood'}
            {mode === 'register' && 'Junte-se a milhares de utilizadores'}
            {mode === 'phone' && 'Receba um codigo SMS no seu telefone'}
            {mode === 'otp' && `Enviamos um codigo para ${phone}`}
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
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="text-right">
                <button type="button" className="text-xs text-primary-500 font-medium hover:underline">Esqueceu a senha?</button>
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
                <label className="text-xs font-medium text-gray-700 mb-1 block">Telefone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+258 84 000 0000" className="input-field pl-10 text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 caracteres" className="input-field pl-10 pr-10 text-sm" required minLength={6} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full btn-primary text-sm flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'Criando conta...' : 'Criar conta'}
              </button>
            </form>
          )}

          {/* Phone Login */}
          {mode === 'phone' && (
            <form onSubmit={handlePhoneLogin} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Numero de telefone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+258 84 000 0000" className="input-field pl-10 text-sm" required />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Enviaremos um codigo SMS para este numero</p>
              </div>
              <button type="submit" disabled={loading} className="w-full btn-primary text-sm flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'Enviando...' : 'Enviar codigo SMS'}
              </button>
            </form>
          )}

          {/* OTP Verification */}
          {mode === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Codigo de verificacao</label>
                <input type="text" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} placeholder="000000" className="input-field text-center text-lg font-mono tracking-widest" maxLength={6} required autoFocus />
                <p className="text-[10px] text-gray-400 mt-1 text-center">Digite o codigo de 6 digitos enviado para {phone}</p>
              </div>
              <button type="submit" disabled={loading} className="w-full btn-primary text-sm flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'Verificando...' : 'Verificar'}
              </button>
              <button type="button" onClick={() => setMode('phone')} className="w-full text-sm text-gray-500 hover:text-gray-700">
                Reenviar codigo
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">ou</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Alternative Methods */}
          <div className="space-y-2">
            {mode !== 'phone' && mode !== 'otp' && (
              <button
                onClick={() => { setMode('phone'); setError(''); setSuccess(''); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Phone className="w-4 h-4" /> Entrar com telefone
              </button>
            )}
            {(mode === 'phone' || mode === 'otp') && (
              <button
                onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Mail className="w-4 h-4" /> Entrar com email
              </button>
            )}
          </div>

          {/* Switch mode */}
          <div className="text-center mt-5 text-sm text-gray-500">
            {mode === 'login' ? (
              <p>Nao tem conta? <button onClick={() => { setMode('register'); setError(''); }} className="text-primary-500 font-semibold hover:underline">Criar conta</button></p>
            ) : mode === 'register' ? (
              <p>Ja tem conta? <button onClick={() => { setMode('login'); setError(''); }} className="text-primary-500 font-semibold hover:underline">Entrar</button></p>
            ) : null}
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
