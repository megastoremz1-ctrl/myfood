'use client';

import { useState, useRef, Suspense, useEffect } from 'react';
import {
  User, MapPin, CreditCard, Clock, Heart, Tag, Users, Headphones,
  ChevronRight, Bell, LogOut, Star, Plus, Trash2, Check, Home, Camera,
  Edit3, Save, X, Loader2, Shield, Mail, Phone, Moon, Globe
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/components/auth/AuthProvider';
import { useTheme } from '@/components/providers/ThemeProvider';
import ThemeToggle from '@/components/ui/ThemeToggle';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { getUserOrders, getUserFavorites, getUserAddresses, addUserAddress, deleteUserAddress } from '@/lib/db';
import { restaurants } from '@/data/mock';

export default function ProfilePageWrapper() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Carregando...</div>}>
      <ProfilePage />
    </Suspense>
  );
}

function ProfilePage() {
  const router = useRouter();
  const { profile, user, loading: authLoading, signOut, updateProfile, uploadAvatar } = useAuth();
  const { t } = useTheme();
  const { favorites, orderHistory, addresses, addAddress, removeAddress, setDefaultAddress } = useStore();

  const [activeTab, setActiveTab] = useState('menu');
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newAddr, setNewAddr] = useState('');
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [dbAddresses, setDbAddresses] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const favoriteRestaurants = restaurants.filter((r) => favorites.includes(r.id));

  // Load real data from DB
  useEffect(() => {
    if (user) {
      setLoadingData(true);
      Promise.all([getUserOrders(), getUserAddresses()]).then(([orders, addrs]) => {
        setDbOrders(orders);
        setDbAddresses(addrs);
        setLoadingData(false);
      });
    }
  }, [user]);

  // Use DB orders if available, otherwise fallback to store
  const displayOrders = dbOrders.length > 0 ? dbOrders : orderHistory.map(o => ({
    ...o,
    orderNumber: o.id,
    restaurantLogo: null,
  }));
  const displayAddresses = dbAddresses.length > 0 ? dbAddresses.map((a: any) => ({
    id: a.id,
    label: a.label,
    address: a.address,
    isDefault: a.is_default,
  })) : addresses;

  // If not logged in, show login prompt
  if (!authLoading && !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <User className="w-10 h-10 text-primary-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Entre na sua conta</h2>
        <p className="text-gray-500 text-sm mb-6">Faca login para ver o seu perfil, historico e favoritos</p>
        <Link href="/auth" className="btn-primary inline-flex items-center gap-2">
          <User className="w-4 h-4" /> Entrar ou criar conta
        </Link>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Imagem muito grande. Maximo 5MB.');
      return;
    }
    setUploadingAvatar(true);
    const result = await uploadAvatar(file);
    setUploadingAvatar(false);
    if (!result.success) {
      alert(result.error || 'Erro ao fazer upload');
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    await updateProfile({ name: editName, phone: editPhone });
    setSaving(false);
    setEditMode(false);
  };

  const startEdit = () => {
    setEditName(profile?.name || '');
    setEditPhone(profile?.phone || '');
    setEditMode(true);
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const handleAddAddress = async () => {
    if (newLabel && newAddr) {
      // Try DB first
      if (user) {
        const result = await addUserAddress({ label: newLabel, address: newAddr });
        if (result) {
          setDbAddresses(prev => [...prev, result]);
        }
      }
      // Also add to local store
      addAddress({ id: `a-${Date.now()}`, label: newLabel, address: newAddr, isDefault: false });
      setNewLabel('');
      setNewAddr('');
      setShowAddForm(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Profile Header */}
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.name} className="w-18 h-18 rounded-full object-cover border-3 border-primary-100" style={{ width: 72, height: 72 }} />
            ) : (
              <div className="w-[72px] h-[72px] bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {profile?.name ? profile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
                </span>
              </div>
            )}
            <button
              onClick={() => avatarInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary-500 rounded-full flex items-center justify-center border-2 border-white hover:bg-primary-600 transition-colors"
            >
              {uploadingAvatar ? (
                <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
              ) : (
                <Camera className="w-3.5 h-3.5 text-white" />
              )}
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {editMode ? (
              <div className="space-y-2">
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Nome completo" className="input-field text-sm py-2" />
                <input type="tel" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="+258 84 000 0000" className="input-field text-sm py-2" />
                <div className="flex gap-2">
                  <button onClick={handleSaveProfile} disabled={saving} className="flex items-center gap-1 bg-primary-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-primary-600">
                    {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                    Guardar
                  </button>
                  <button onClick={() => setEditMode(false)} className="flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-medium">
                    <X className="w-3 h-3" /> Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-lg font-bold text-gray-900">{profile?.name || 'Utilizador'}</h1>
                {profile?.phone && (
                  <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                    <Phone className="w-3 h-3" /> {profile.phone}
                  </p>
                )}
                <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3 h-3" /> {profile?.email}
                </p>
              </>
            )}
          </div>

          {!editMode && (
            <button onClick={startEdit} className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-primary-500 transition-colors">
              <Edit3 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-5 pt-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{displayOrders.length}</p>
            <p className="text-xs text-gray-500">Pedidos</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{favorites.length}</p>
            <p className="text-xs text-gray-500">Favoritos</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-primary-500">250 MT</p>
            <p className="text-xs text-gray-500">Carteira</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto no-scrollbar">
        {[
          { id: 'menu', label: 'Menu' },
          { id: 'orders', label: 'Pedidos' },
          { id: 'addresses', label: 'Enderecos' },
          { id: 'favorites', label: 'Favoritos' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Menu Tab */}
      {activeTab === 'menu' && (
        <div className="space-y-2">
          {[
            { icon: Clock, label: 'Historico de pedidos', action: () => setActiveTab('orders'), color: 'text-blue-500', bg: 'bg-blue-50' },
            { icon: Heart, label: 'Favoritos', action: () => setActiveTab('favorites'), color: 'text-red-500', bg: 'bg-red-50', count: favorites.length },
            { icon: MapPin, label: 'Enderecos', action: () => setActiveTab('addresses'), color: 'text-secondary-500', bg: 'bg-secondary-50', count: addresses.length },
            { icon: CreditCard, label: 'Metodos de pagamento', color: 'text-purple-500', bg: 'bg-purple-50' },
            { icon: Tag, label: 'Cupoes disponiveis', color: 'text-primary-500', bg: 'bg-primary-50' },
            { icon: Users, label: 'Convide amigos', color: 'text-indigo-500', bg: 'bg-indigo-50' },
            { icon: Shield, label: 'Seguranca da conta', color: 'text-teal-500', bg: 'bg-teal-50' },
            { icon: Headphones, label: 'Apoio ao cliente', color: 'text-cyan-500', bg: 'bg-cyan-50' },
          ].map(({ icon: Icon, label, action, color, bg, count }) => (
            <button
              key={label}
              onClick={action}
              className="w-full card flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <span className="flex-1 text-sm font-medium text-gray-700">{label}</span>
              {count !== undefined && count > 0 && (
                <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full">{count}</span>
              )}
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          ))}

          <div className="pt-4 space-y-2">
            {/* Theme & Language */}
            <div className="card p-4 space-y-4 mb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                    <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('profile_dark_mode')}</span>
                </div>
                <ThemeToggle />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                    <Globe className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('profile_language')}</span>
                </div>
                <LanguageToggle />
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors text-red-500"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Terminar sessao</span>
            </button>
            <Link href="/" className="flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-gray-600 py-2">
              <Home className="w-4 h-4" /> Voltar ao portal
            </Link>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-3">
          {displayOrders.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Nenhum pedido ainda</p>
              <Link href="/cliente" className="text-primary-500 text-sm font-medium mt-2 inline-block">Fazer primeiro pedido</Link>
            </div>
          ) : (
            displayOrders.map((order: any) => (
              <div key={order.id} className="card p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{order.restaurant}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">#{order.id}</p>
                  </div>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary-50 text-secondary-700">
                    {order.status === 'delivered' ? 'Entregue' : 'Em andamento'}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                  <span className="font-bold text-sm text-gray-900">{order.total} MT</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <Link href="/cliente" className="flex-1 bg-primary-50 text-primary-600 text-xs font-semibold py-2 rounded-lg hover:bg-primary-100 transition-colors text-center">
                    Pedir novamente
                  </Link>
                  <button className="flex items-center gap-1 bg-gray-50 text-gray-600 text-xs font-semibold py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors">
                    <Star className="w-3 h-3" /> Avaliar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Addresses Tab */}
      {activeTab === 'addresses' && (
        <div className="space-y-3">
          {displayAddresses.map((addr: any) => (
            <div key={addr.id} className="card p-4 flex items-center gap-3">
              <MapPin className={`w-5 h-5 flex-shrink-0 ${addr.isDefault ? 'text-primary-500' : 'text-gray-400'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900">{addr.label}</p>
                  {addr.isDefault && (
                    <span className="text-[10px] bg-primary-100 text-primary-600 px-1.5 py-0.5 rounded-full font-medium">Padrao</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate">{addr.address}</p>
              </div>
              <div className="flex gap-1">
                {!addr.isDefault && (
                  <button onClick={() => setDefaultAddress(addr.id)} className="w-7 h-7 bg-secondary-50 rounded-full flex items-center justify-center hover:bg-secondary-100">
                    <Check className="w-3.5 h-3.5 text-secondary-500" />
                  </button>
                )}
                <button onClick={() => removeAddress(addr.id)} className="w-7 h-7 bg-red-50 rounded-full flex items-center justify-center hover:bg-red-100">
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                </button>
              </div>
            </div>
          ))}

          {showAddForm ? (
            <div className="card p-4 space-y-3">
              <input type="text" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="Nome (ex: Casa, Trabalho)" className="input-field text-sm" />
              <input type="text" value={newAddr} onChange={(e) => setNewAddr(e.target.value)} placeholder="Endereco completo" className="input-field text-sm" />
              <div className="flex gap-2">
                <button onClick={handleAddAddress} className="flex-1 btn-primary text-sm py-2.5">Guardar</button>
                <button onClick={() => setShowAddForm(false)} className="px-4 py-2.5 bg-gray-100 rounded-xl text-sm font-medium text-gray-600">Cancelar</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowAddForm(true)} className="w-full card p-4 flex items-center justify-center gap-2 text-primary-500 font-medium text-sm hover:bg-primary-50 transition-colors">
              <Plus className="w-4 h-4" /> Adicionar endereco
            </button>
          )}
        </div>
      )}

      {/* Favorites Tab */}
      {activeTab === 'favorites' && (
        <div>
          {favoriteRestaurants.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Nenhum favorito ainda</p>
              <Link href="/cliente" className="text-primary-500 text-sm font-medium mt-2 inline-block">Explorar restaurantes</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {favoriteRestaurants.map((r) => (
                <Link key={r.id} href={`/cliente/restaurante/${r.id}`} className="card p-3 flex items-center gap-3">
                  <img src={r.logo} alt={r.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{r.name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                      <span className="flex items-center gap-0.5"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />{r.rating}</span>
                      <span>{r.deliveryTime}</span>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${r.isOpen ? 'bg-secondary-50 text-secondary-700' : 'bg-red-50 text-red-700'}`}>
                    {r.isOpen ? 'Aberto' : 'Fechado'}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
