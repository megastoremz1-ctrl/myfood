'use client';

import { useState } from 'react';
import {
  Package, Clock, CheckCircle, XCircle, TrendingUp, DollarSign,
  Menu as MenuIcon, Bell, Settings, ChefHat, BarChart3, Tag, History, Star
} from 'lucide-react';
import Link from 'next/link';

const orders = [
  { id: 'P-001', customer: 'António M.', items: 'Matapa com Camarão x1, Sumo de Mango x2', total: 610, time: '2 min atrás', status: 'new' },
  { id: 'P-002', customer: 'Maria S.', items: 'Frango Piri-Piri x2, 2M Cerveja x2', total: 960, time: '5 min atrás', status: 'new' },
  { id: 'P-003', customer: 'João P.', items: 'Camarão Grelhado x1', total: 650, time: '8 min atrás', status: 'preparing' },
  { id: 'P-004', customer: 'Ana L.', items: 'Xima com Caril x1, Pudim x1', total: 440, time: '15 min atrás', status: 'ready' },
  { id: 'P-005', customer: 'Carlos F.', items: 'Rissóis de Camarão x3', total: 540, time: '25 min atrás', status: 'delivered' },
];

const stats = [
  { label: 'Pedidos Hoje', value: '23', icon: Package, color: 'text-blue-500', bg: 'bg-blue-50' },
  { label: 'Receita Hoje', value: '12.450 MT', icon: DollarSign, color: 'text-secondary-500', bg: 'bg-secondary-50' },
  { label: 'Tempo Médio', value: '22 min', icon: Clock, color: 'text-primary-500', bg: 'bg-primary-50' },
  { label: 'Avaliação', value: '4.8', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50' },
];

const sidebarItems = [
  { icon: Package, label: 'Pedidos', active: true },
  { icon: MenuIcon, label: 'Menu' },
  { icon: Tag, label: 'Promoções' },
  { icon: BarChart3, label: 'Relatórios' },
  { icon: History, label: 'Financeiro' },
  { icon: Settings, label: 'Definições' },
];

export default function PartnerPage() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter((o) => o.status === activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Partner Header */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">MyFood Partner</h1>
              <p className="text-xs text-gray-500">Mundo&apos;s Restaurant</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 hover:bg-gray-50 rounded-xl">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-primary-600">MR</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-56 min-h-screen bg-white border-r border-gray-100 p-4">
          <nav className="space-y-1">
            {sidebarItems.map(({ icon: Icon, label, active }) => (
              <button
                key={label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {stats.map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="card p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{value}</p>
                    <p className="text-xs text-gray-500">{label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Orders */}
          <div className="card">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 mb-3">Pedidos</h2>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {[
                  { id: 'all', label: 'Todos' },
                  { id: 'new', label: 'Novos' },
                  { id: 'preparing', label: 'Preparando' },
                  { id: 'ready', label: 'Prontos' },
                  { id: 'delivered', label: 'Entregues' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 text-sm">{order.id}</span>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="text-sm text-gray-700 mt-0.5">{order.customer}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{order.items}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-sm">{order.total} MT</p>
                      <p className="text-xs text-gray-400">{order.time}</p>
                    </div>
                  </div>

                  {order.status === 'new' && (
                    <div className="flex gap-2 mt-3">
                      <button className="flex-1 bg-secondary-500 text-white text-xs font-semibold py-2 rounded-lg hover:bg-secondary-600 transition-colors flex items-center justify-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Aceitar
                      </button>
                      <button className="bg-red-50 text-red-500 text-xs font-semibold py-2 px-4 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Rejeitar
                      </button>
                    </div>
                  )}
                  {order.status === 'preparing' && (
                    <button className="w-full mt-3 bg-primary-500 text-white text-xs font-semibold py-2 rounded-lg hover:bg-primary-600 transition-colors">
                      Marcar como pronto
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    preparing: 'bg-yellow-100 text-yellow-700',
    ready: 'bg-secondary-100 text-secondary-700',
    delivered: 'bg-gray-100 text-gray-600',
  };

  const labels: Record<string, string> = {
    new: 'Novo',
    preparing: 'Preparando',
    ready: 'Pronto',
    delivered: 'Entregue',
  };

  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${styles[status] || ''}`}>
      {labels[status] || status}
    </span>
  );
}
