'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bike, Mail, Lock, User, Phone, MapPin, Loader2, ArrowLeft, Eye, EyeOff, Check } from 'lucide-react';
import Link from 'next/link';
import { getSupabase } from '@/lib/supabase';

type Mode = 'login' | 'register';

export default function DriverAuthPage() {
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

  // Register - Step 1
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  // Register - Step 2
  const [vehicleType, setVehicleType] = useState('Moto');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [city, setCity] = useState('Maputo');
  const [bairro, setBairro] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const supabase = getSupabase();
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      if (err.message.includes('Invalid login')) {
        setError('Email ou senha incorretos.');
      } else {
        setError(err.message);
      }
    } else {
      router.push('/motorista');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (step === 1) {
      if (!fullName || !email || !password || !phone) {
        setError('Preencha todos os campos.');
        return;
      }
      if (password.length < 6) {
        setError('A senha deve ter no minimo 6 caracteres.');
        return;
      }
      setStep(2);
      return;
    }

    if (!vehicleType || !vehiclePlate || !city || !bairro) {
      setError('Preencha todos os campos do veiculo e localizacao.');
      return;
    }

    setLoading(true);
    const supabase = getSupabase();

    // Create user account
    const { data: authData, error: authErr } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone, role: 'driver' },
      },
    });

    if (authErr) {
      setLoading(false);
      if (authErr.message.includes('already')) {
        setError('Este email ja esta registado. Tente fazer login.');
      } else {
        setError(authErr.message);
      }
      return;
    }

    // Create driver entry
    if (authData.user) {
      const { error: insertErr } = await supabase.from('drivers').insert({
        id: authData.user.id,
        vehicle_type: vehicleType,
        vehicle_plate: vehiclePlate,
      });

      if (insertErr) {
        setLoading(false);
        setError('Erro ao registar dados do motorista. Tente novamente.');
        return;
      }
    }

    setLoading(false);
    setSuccess('Registo concluido! Pode aceder ao painel de entregas.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/">
            <img src="/logo-driver.svg" alt="MyFood Driver" className="h-10 mx-auto mb-4" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === 'login' ? 'Aceder ao painel' : step === 1 ? 'Registar motorista' : 'Dados do veiculo'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {mode === 'login'
              ? 'Entre para gerir as suas entregas'
              : step === 1
              ? 'Passo 1/2 - Dados pessoais'
              : 'Passo 2/2 - Veiculo e localizacao'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-100 rounded-xl text-center">
              <Check className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-blue-700 font-medium">{success}</p>
              <Link
                href="/auth/motorista"
                onClick={() => {
                  setMode('login');
                  setSuccess('');
                }}
                className="text-xs text-blue-600 underline mt-2 inline-block"
              >
                Ir para login
              </Link>
            </div>
          )}

          {/* Login Form */}
          {!success && mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="input-field pl-10 text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua senha"
                    className="input-field pl-10 pr-10 text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all text-sm flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bike className="w-4 h-4" />}
                {loading ? 'Entrando...' : 'Entrar no painel'}
              </button>
            </form>
          )}

          {/* Register Step 1 */}
          {!success && mode === 'register' && step === 1 && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Nome completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="input-field pl-10 text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="input-field pl-10 text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 caracteres"
                    className="input-field pl-10 pr-10 text-sm"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Telefone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+258 84 000 0000"
                    className="input-field pl-10 text-sm"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all text-sm"
              >
                Proximo passo
              </button>
            </form>
          )}

          {/* Register Step 2 */}
          {!success && mode === 'register' && step === 2 && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Tipo de veiculo</label>
                <div className="relative">
                  <Bike className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="input-field pl-10 text-sm"
                  >
                    <option value="Moto">Moto</option>
                    <option value="Bicicleta">Bicicleta</option>
                    <option value="Carro">Carro</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Placa do veiculo</label>
                <div className="relative">
                  <Bike className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={vehiclePlate}
                    onChange={(e) => setVehiclePlate(e.target.value)}
                    placeholder="Ex: MAA-1234"
                    className="input-field pl-10 text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Cidade</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="input-field pl-10 text-sm"
                  >
                    <option value="Maputo">Maputo</option>
                    <option value="Matola">Matola</option>
                    <option value="Beira">Beira</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Bairro</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                    placeholder="Ex: Sommerschield"
                    className="input-field pl-10 text-sm"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-xl text-sm"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {loading ? 'Registando...' : 'Registar'}
                </button>
              </div>
            </form>
          )}

          {/* Switch mode */}
          {!success && (
            <div className="text-center mt-5 text-sm text-gray-500">
              {mode === 'login' ? (
                <p>
                  Novo motorista?{' '}
                  <button
                    onClick={() => {
                      setMode('register');
                      setStep(1);
                      setError('');
                    }}
                    className="text-blue-500 font-semibold hover:underline"
                  >
                    Criar conta
                  </button>
                </p>
              ) : (
                <p>
                  Ja tem conta?{' '}
                  <button
                    onClick={() => {
                      setMode('login');
                      setError('');
                    }}
                    className="text-blue-500 font-semibold hover:underline"
                  >
                    Entrar
                  </button>
                </p>
              )}
            </div>
          )}
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
