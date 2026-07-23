'use client';

import { useState, Suspense } from 'react';
import {
  User, MapPin, CreditCard, Clock, Heart, Tag, Users, Headphones,
  ChevronRight, Bell, LogOut, Star, Plus, Trash2, Check, ArrowLeft, Home
} from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { restaurants } from '@/data/mock';

export default function ProfilePageWrapper() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Carregando...</div>}>
      <ProfilePage />
    </Suspense>
  );
}

function ProfilePage() {
  const [activeTab, setActiveTab] = useState('menu');
  const {
    favorites, orderHistory, addresses, addAddress, removeAddress, setDefaultAddress,
    notifications, markNotificationRead
  } = useStore();
  const [newLabel, setNewLabel] = useState('');
  const [newAddr, setNewAddr] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const favoriteRestaurants = restaurants.filter((r) => favorites.includes(r.id));

  const handleAddAddress = () => {
    if (newLabel && newAddr) {
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
          <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">AM</span>
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900">Antonio Machel</h1>
            <p className="text-sm text-gray-500">+258 84 123 4567</p>
            <p className="text-xs text-gray-400">antonio.machel@email.com</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-5 pt-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{orderHistory.length}</p>
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
            { icon: CreditCard, label: 'Metodos de pagamento', color: 'text-purple-500', bg: 'bg-purple-50', count: 4 },
            { icon: Tag, label: 'Cupoes disponiveis', color: 'text-primary-500', bg: 'bg-primary-50', count: 3 },
            { icon: Users, label: 'Convide amigos', color: 'text-indigo-500', bg: 'bg-indigo-50' },
            { icon: Bell, label: 'Notificacoes', color: 'text-teal-500', bg: 'bg-teal-50', count: notifications.filter(n => !n.read).length },
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
                <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {count}
                </span>
              )}
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          ))}

          <div className="pt-4">
            <button className="w-full flex items-center gap-3 p-3 hover:bg-red-50 rounded-xl transition-colors text-red-500">
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Terminar sessao</span>
            </button>
          </div>

          <div className="pt-2 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600">
              <Home className="w-4 h-4" />
              Voltar ao portal
            </Link>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-3">
          {orderHistory.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Nenhum pedido ainda</p>
            </div>
          ) : (
            orderHistory.map((order) => (
              <div key={order.id} className="card p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{order.restaurant}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">#{order.id}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    order.status === 'delivered' ? 'bg-secondary-50 text-secondary-700' : 'bg-blue-50 text-blue-700'
                  }`}>
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
          {addresses.map((addr) => (
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
                  <button
                    onClick={() => setDefaultAddress(addr.id)}
                    className="w-7 h-7 bg-secondary-50 rounded-full flex items-center justify-center hover:bg-secondary-100"
                    title="Definir como padrao"
                  >
                    <Check className="w-3.5 h-3.5 text-secondary-500" />
                  </button>
                )}
                <button
                  onClick={() => removeAddress(addr.id)}
                  className="w-7 h-7 bg-red-50 rounded-full flex items-center justify-center hover:bg-red-100"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                </button>
              </div>
            </div>
          ))}

          {showAddForm ? (
            <div className="card p-4 space-y-3">
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Nome (ex: Casa, Trabalho)"
                className="input-field text-sm"
              />
              <input
                type="text"
                value={newAddr}
                onChange={(e) => setNewAddr(e.target.value)}
                placeholder="Endereco completo"
                className="input-field text-sm"
              />
              <div className="flex gap-2">
                <button onClick={handleAddAddress} className="flex-1 btn-primary text-sm py-2.5">
                  Guardar
                </button>
                <button onClick={() => setShowAddForm(false)} className="px-4 py-2.5 bg-gray-100 rounded-xl text-sm font-medium text-gray-600">
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full card p-4 flex items-center justify-center gap-2 text-primary-500 font-medium text-sm hover:bg-primary-50 transition-colors"
            >
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
              <p className="text-gray-400 text-xs mt-1">Toque no coracao em qualquer restaurante</p>
            </div>
          ) : (
            <div className="space-y-3">
              {favoriteRestaurants.map((r) => (
                <Link key={r.id} href={`/cliente/restaurante/${r.id}`} className="card p-3 flex items-center gap-3">
                  <img src={r.logo} alt={r.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{r.name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                      <span className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />{r.rating}
                      </span>
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
