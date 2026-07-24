'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, Store, Phone, MapPin, Clock, Loader2, ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { getSupabase } from '@/lib/supabase';

type Mode = 'login' | 'register';

export default function PartnerAuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);

  // Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register
  const [restaurantName, setRestaurantName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [openTime, setOpenTime] = useState('08:00');
  const [closeTime, setCloseTime] = useState('22:00');
  const [category, setCategory] = useState('mocambicana');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const supabase = getSupabase();
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError('Email ou senha incorretos.');
    } else {
      router.push('/parceiro');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (step === 1) {
      if (!ownerName || !email || !password || password.length < 6) {
        setError('Preencha todos os campos. Senha minimo 6 caracteres.');
        return;
      }
      setStep(2);
      return;
    }

    if (!restaurantName || !phone || !address) {
      setError('Preencha todos os campos do restaurante.');
      return;
    }

    setLoading(true);
    const supabase = getSupabase();

    // Create user account
    const { data: authData, error: authErr } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: ownerName, phone, role: 'partner' },
      },
    });

    if (authErr) {
      setLoading(false);
      setError(authErr.message.includes('already') ? 'Este email ja esta registado.' : authErr.message);
      return;
    }

    // Create restaurant entry
    if (authData.user) {
      await supabase.from('restaurants').insert({
        owner_id: authData.user.id,
        name: restaurantName,
        phone,
        address,
        opening_time: openTime,
        closing_time: closeTime,
        status: 'pending',
        is_open: false,
      });
    }

    setLoading(false);
    setSuccess('Restaurante registado! A sua conta sera analisada em ate 24h.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/">
            <img src="/logo-partner.svg" alt="MyFood Partner" className="h-10 mx-auto mb-4" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === 'login' ? 'Aceder ao painel' : step === 1 ? 'Registar restaurante' : 'Dados do restaurante'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {mode === 'login' ? 'Gira o seu restaurante no MyFood' : step === 1 ? 'Passo 1/2 - Conta do proprietario' : 'Passo 2/2 - Informacoes do restaurante'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">{error}</div>}
          {success && (
            <div className="mb-4 p-4 bg-secondary-50 border border-secondary-100 rounded-xl text-center">
              <Check className="w-8 h-8 text-secondary-500 mx-auto mb-2" />
              <p className="text-sm text-secondary-700 font-medium">{success}</p>
              <Link href="/auth/parceiro" onClick={() => { setMode('login'); setSuccess(''); }} className="text-xs text-secondary-600 underline mt-2 inline-block">Ir para login</Link>
            </div>
          )}

          {!success && mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Email do proprietario</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@restaurante.com" className="input-field pl-10 text-sm" required />
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
              <button type="submit" disabled={loading} className="w-full bg-secondary-500 hover:bg-secondary-600 text-white font-semibold py-3 px-6 rounded-xl transition-all text-sm flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Store className="w-4 h-4" />}
                {loading ? 'Entrando...' : 'Entrar no painel'}
              </button>
            </form>
          )}

          {!success && mode === 'register' && step === 1 && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Nome do proprietario</label>
                <div className="relative">
                  <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="Seu nome completo" className="input-field pl-10 text-sm" required />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@restaurante.com" className="input-field pl-10 text-sm" required />
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
              <button type="submit" className="w-full bg-secondary-500 hover:bg-secondary-600 text-white font-semibold py-3 px-6 rounded-xl transition-all text-sm">
                Proximo passo
              </button>
            </form>
          )}

          {!success && mode === 'register' && step === 2 && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Nome do restaurante</label>
                <div className="relative">
                  <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} placeholder="Ex: Restaurante Mundo" className="input-field pl-10 text-sm" required />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Telefone do restaurante</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+258 84 000 0000" className="input-field pl-10 text-sm" required />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Endereco</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Av. Julius Nyerere, 456, Maputo" className="input-field pl-10 text-sm" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Abre as</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="time" value={openTime} onChange={(e) => setOpenTime(e.target.value)} className="input-field pl-10 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Fecha as</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="time" value={closeTime} onChange={(e) => setCloseTime(e.target.value)} className="input-field pl-10 text-sm" />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Categoria principal</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field text-sm">
                  <option value="mocambicana">Comida Mocambicana</option>
                  <option value="fast-food">Fast Food</option>
                  <option value="pizza">Pizza</option>
                  <option value="frango">Frango</option>
                  <option value="sushi">Sushi</option>
                  <option value="cafes">Cafes</option>
                  <option value="sobremesas">Sobremesas</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setStep(1)} className="flex-1 bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-xl text-sm">
                  Voltar
                </button>
                <button type="submit" disabled={loading} className="flex-1 bg-secondary-500 hover:bg-secondary-600 text-white font-semibold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {loading ? 'Registando...' : 'Registar'}
                </button>
              </div>
            </form>
          )}

          {!success && (
            <div className="text-center mt-5 text-sm text-gray-500">
              {mode === 'login' ? (
                <p>Novo parceiro? <button onClick={() => { setMode('register'); setStep(1); setError(''); }} className="text-secondary-500 font-semibold hover:underline">Registar restaurante</button></p>
              ) : (
                <p>Ja tem conta? <button onClick={() => { setMode('login'); setError(''); }} className="text-secondary-500 font-semibold hover:underline">Entrar</button></p>
              )}
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600">
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao portal
          </Link>
        </div>
      </div>
    </div>
  );
}
