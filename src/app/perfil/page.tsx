'use client';

import { useState } from 'react';
import {
  User, MapPin, CreditCard, Clock, Heart, Tag, Users, Headphones,
  ChevronRight, Bell, Shield, Moon, LogOut, Star, Package
} from 'lucide-react';

const menuItems = [
  { icon: Clock, label: 'Histórico de pedidos', count: '12', color: 'text-blue-500', bg: 'bg-blue-50' },
  { icon: Heart, label: 'Favoritos', count: '5', color: 'text-red-500', bg: 'bg-red-50' },
  { icon: MapPin, label: 'Endereços', count: '3', color: 'text-secondary-500', bg: 'bg-secondary-50' },
  { icon: CreditCard, label: 'Métodos de pagamento', count: '2', color: 'text-purple-500', bg: 'bg-purple-50' },
  { icon: Tag, label: 'Cupões', count: '4', color: 'text-primary-500', bg: 'bg-primary-50' },
  { icon: Users, label: 'Convide amigos', count: '', color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { icon: Headphones, label: 'Apoio ao cliente', count: '', color: 'text-teal-500', bg: 'bg-teal-50' },
];

const orderHistory = [
  { id: 'ORD-001', restaurant: "Mundo's Restaurant", items: 'Matapa com Camarão, 2M Cerveja', total: 550, date: '22 Jul 2026', status: 'Entregue' },
  { id: 'ORD-002', restaurant: 'Pizza House Maputo', items: 'Pizza Margherita, Sumo de Mango', total: 480, date: '20 Jul 2026', status: 'Entregue' },
  { id: 'ORD-003', restaurant: 'Frango Piri-Piri', items: 'Frango Piri-Piri, Arroz', total: 430, date: '18 Jul 2026', status: 'Entregue' },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('menu');

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Profile Header */}
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">AM</span>
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900">António Machel</h1>
            <p className="text-sm text-gray-500">+258 84 123 4567</p>
            <p className="text-xs text-gray-400">antonio.machel@email.com</p>
          </div>
          <button className="text-sm text-primary-500 font-medium">Editar</button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">12</p>
            <p className="text-xs text-gray-500">Pedidos</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">5</p>
            <p className="text-xs text-gray-500">Favoritos</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-primary-500">250 MT</p>
            <p className="text-xs text-gray-500">Carteira</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('menu')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            activeTab === 'menu' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Menu
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            activeTab === 'orders' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Pedidos
        </button>
      </div>

      {activeTab === 'menu' ? (
        <>
          {/* Menu Items */}
          <div className="space-y-2 mb-6">
            {menuItems.map(({ icon: Icon, label, count, color, bg }) => (
              <button
                key={label}
                className="w-full card flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <span className="flex-1 text-sm font-medium text-gray-700">{label}</span>
                {count && (
                  <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {count}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            ))}
          </div>

          {/* Settings */}
          <div className="card p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 text-sm mb-2">Definições</h3>
            <button className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition-colors">
              <Bell className="w-4 h-4 text-gray-500" />
              <span className="flex-1 text-sm text-gray-700">Notificações</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
            <button className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition-colors">
              <Shield className="w-4 h-4 text-gray-500" />
              <span className="flex-1 text-sm text-gray-700">Privacidade</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
            <button className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition-colors">
              <Moon className="w-4 h-4 text-gray-500" />
              <span className="flex-1 text-sm text-gray-700">Modo escuro</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
            <button className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition-colors text-red-500">
              <LogOut className="w-4 h-4" />
              <span className="flex-1 text-sm font-medium">Terminar sessão</span>
            </button>
          </div>
        </>
      ) : (
        /* Order History */
        <div className="space-y-3">
          {orderHistory.map((order) => (
            <div key={order.id} className="card p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{order.restaurant}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{order.items}</p>
                </div>
                <span className="bg-secondary-50 text-secondary-700 text-xs font-medium px-2 py-0.5 rounded-full">
                  {order.status}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-400">{order.date}</span>
                <span className="font-bold text-sm text-gray-900">{order.total} MT</span>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 bg-primary-50 text-primary-600 text-xs font-semibold py-2 rounded-lg hover:bg-primary-100 transition-colors">
                  Pedir novamente
                </button>
                <button className="flex items-center gap-1 bg-gray-50 text-gray-600 text-xs font-semibold py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors">
                  <Star className="w-3 h-3" /> Avaliar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
