'use client';

import { useState } from 'react';
import {
  Users, Store, Bike, Package, Tag, AlertCircle, DollarSign,
  MapPin, Bell, BarChart3, Settings, TrendingUp, TrendingDown,
  Search, Filter, Download, ChevronRight, Activity
} from 'lucide-react';

const stats = [
  { label: 'Clientes', value: '12.450', change: '+8%', trend: 'up', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
  { label: 'Restaurantes', value: '156', change: '+3', trend: 'up', icon: Store, color: 'text-primary-500', bg: 'bg-primary-50' },
  { label: 'Entregadores', value: '89', change: '+12', trend: 'up', icon: Bike, color: 'text-secondary-500', bg: 'bg-secondary-50' },
  { label: 'Pedidos Hoje', value: '342', change: '+22%', trend: 'up', icon: Package, color: 'text-purple-500', bg: 'bg-purple-50' },
  { label: 'Receita Hoje', value: '245.600 MT', change: '+18%', trend: 'up', icon: DollarSign, color: 'text-green-500', bg: 'bg-green-50' },
  { label: 'Reclamações', value: '5', change: '-2', trend: 'down', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
];

const sidebarItems = [
  { icon: BarChart3, label: 'Dashboard', active: true },
  { icon: Users, label: 'Clientes' },
  { icon: Store, label: 'Restaurantes' },
  { icon: Bike, label: 'Entregadores' },
  { icon: Package, label: 'Pedidos' },
  { icon: Tag, label: 'Promoções' },
  { icon: AlertCircle, label: 'Reclamações' },
  { icon: DollarSign, label: 'Financeiro' },
  { icon: MapPin, label: 'Cidades/Bairros' },
  { icon: Bell, label: 'Notificações' },
  { icon: Settings, label: 'Definições' },
];

const recentOrders = [
  { id: 'ORD-2341', customer: 'António M.', restaurant: "Mundo's Restaurant", total: '610 MT', status: 'Entregue', time: '14:32' },
  { id: 'ORD-2340', customer: 'Maria S.', restaurant: 'Pizza House', total: '480 MT', status: 'A caminho', time: '14:28' },
  { id: 'ORD-2339', customer: 'João P.', restaurant: 'Sushi Master', total: '890 MT', status: 'Preparando', time: '14:25' },
  { id: 'ORD-2338', customer: 'Ana L.', restaurant: 'Café Central', total: '220 MT', status: 'Confirmado', time: '14:20' },
  { id: 'ORD-2337', customer: 'Carlos F.', restaurant: 'Frango Piri-Piri', total: '430 MT', status: 'Entregue', time: '14:15' },
  { id: 'ORD-2336', customer: 'Sara M.', restaurant: 'Doce Tentação', total: '350 MT', status: 'Entregue', time: '14:10' },
];

const topRestaurants = [
  { name: "Mundo's Restaurant", orders: 45, revenue: '28.500 MT', rating: 4.8 },
  { name: 'Frango Piri-Piri', orders: 38, revenue: '22.100 MT', rating: 4.7 },
  { name: 'Pizza House Maputo', orders: 32, revenue: '19.800 MT', rating: 4.5 },
  { name: 'Café Central', orders: 28, revenue: '8.400 MT', rating: 4.6 },
];

export default function AdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} hidden lg:block min-h-screen bg-white border-r border-gray-100 transition-all duration-300`}>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            {sidebarOpen && (
              <div>
                <span className="font-bold text-gray-900 text-sm">MyFood</span>
                <p className="text-[10px] text-gray-500">Painel Admin</p>
              </div>
            )}
          </div>

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
                <Icon className="w-4 h-4 flex-shrink-0" />
                {sidebarOpen && label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
              <p className="text-xs text-gray-500">Visão geral da plataforma</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center bg-gray-50 rounded-xl px-3 py-2">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input type="text" placeholder="Pesquisar..." className="bg-transparent text-sm outline-none w-40" />
              </div>
              <button className="p-2 hover:bg-gray-50 rounded-xl relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button className="p-2 hover:bg-gray-50 rounded-xl">
                <Download className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
            {stats.map(({ label, value, change, trend, icon: Icon, color, bg }) => (
              <div key={label} className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <span className={`text-xs font-medium flex items-center gap-0.5 ${
                    trend === 'up' ? 'text-secondary-600' : 'text-red-500'
                  }`}>
                    {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {change}
                  </span>
                </div>
                <p className="text-lg font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <div className="lg:col-span-2 card">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-gray-900 text-sm">Pedidos Recentes</h2>
                <div className="flex gap-2">
                  <button className="p-1.5 hover:bg-gray-50 rounded-lg">
                    <Filter className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="text-xs text-primary-500 font-medium">Ver todos</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">ID</th>
                      <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Cliente</th>
                      <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 hidden sm:table-cell">Restaurante</th>
                      <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Total</th>
                      <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Status</th>
                      <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 hidden sm:table-cell">Hora</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-xs font-mono text-gray-900">{order.id}</td>
                        <td className="px-4 py-3 text-xs text-gray-700">{order.customer}</td>
                        <td className="px-4 py-3 text-xs text-gray-500 hidden sm:table-cell">{order.restaurant}</td>
                        <td className="px-4 py-3 text-xs font-semibold text-gray-900">{order.total}</td>
                        <td className="px-4 py-3">
                          <OrderStatus status={order.status} />
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-400 hidden sm:table-cell">{order.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Restaurants */}
            <div className="card">
              <div className="p-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900 text-sm">Top Restaurantes</h2>
                <p className="text-xs text-gray-500">Hoje</p>
              </div>
              <div className="p-4 space-y-3">
                {topRestaurants.map((restaurant, idx) => (
                  <div key={restaurant.name} className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{restaurant.name}</p>
                      <p className="text-xs text-gray-500">{restaurant.orders} pedidos</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-gray-900">{restaurant.revenue}</p>
                      <div className="flex items-center gap-0.5 justify-end">
                        <Activity className="w-3 h-3 text-yellow-400" />
                        <span className="text-[10px] text-gray-500">{restaurant.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Chart Placeholder */}
          <div className="card mt-6 p-6">
            <h2 className="font-bold text-gray-900 text-sm mb-4">Desempenho Semanal</h2>
            <div className="h-48 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-primary-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Gráfico de desempenho</p>
                <p className="text-xs text-gray-400">Pedidos, Receita, Utilizadores ativos</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[
              { label: 'Nova Promoção', icon: Tag, color: 'bg-primary-50 text-primary-600' },
              { label: 'Notificação Push', icon: Bell, color: 'bg-blue-50 text-blue-600' },
              { label: 'Relatório', icon: Download, color: 'bg-secondary-50 text-secondary-600' },
              { label: 'Definições', icon: Settings, color: 'bg-purple-50 text-purple-600' },
            ].map(({ label, icon: Icon, color }) => (
              <button key={label} className="card p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-gray-700">{label}</span>
              </button>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

function OrderStatus({ status }: { status: string }) {
  const styles: Record<string, string> = {
    'Entregue': 'bg-secondary-100 text-secondary-700',
    'A caminho': 'bg-blue-100 text-blue-700',
    'Preparando': 'bg-yellow-100 text-yellow-700',
    'Confirmado': 'bg-purple-100 text-purple-700',
  };

  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}
