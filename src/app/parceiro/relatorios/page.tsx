'use client';

import { BarChart3, TrendingUp, Package, DollarSign, Users, Clock } from 'lucide-react';

const weekData = [
  { day: 'Seg', orders: 18, revenue: 9200 },
  { day: 'Ter', orders: 22, revenue: 11400 },
  { day: 'Qua', orders: 15, revenue: 7800 },
  { day: 'Qui', orders: 28, revenue: 14500 },
  { day: 'Sex', orders: 35, revenue: 18200 },
  { day: 'Sab', orders: 42, revenue: 22100 },
  { day: 'Dom', orders: 38, revenue: 19800 },
];

const maxOrders = Math.max(...weekData.map(d => d.orders));

export default function PartnerReportsPage() {
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-6">Relatorios</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Pedidos (Semana)', value: '198', change: '+12%', icon: Package, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Receita (Semana)', value: '103.000 MT', change: '+8%', icon: DollarSign, color: 'text-secondary-500', bg: 'bg-secondary-50' },
          { label: 'Clientes Unicos', value: '156', change: '+5%', icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' },
          { label: 'Tempo Medio', value: '22 min', change: '-3 min', icon: Clock, color: 'text-primary-500', bg: 'bg-primary-50' },
        ].map(({ label, value, change, icon: Icon, color, bg }) => (
          <div key={label} className="card p-4">
            <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-2`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className="text-lg font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-xs text-secondary-600 mt-1 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />{change}
            </p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="card p-6 mb-6">
        <h3 className="font-semibold text-gray-900 text-sm mb-4">Pedidos por dia (esta semana)</h3>
        <div className="flex items-end justify-between gap-2 h-40">
          {weekData.map(({ day, orders }) => (
            <div key={day} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] font-medium text-gray-600">{orders}</span>
              <div
                className="w-full bg-primary-500 rounded-t-lg transition-all hover:bg-primary-600"
                style={{ height: `${(orders / maxOrders) * 100}%`, minHeight: '8px' }}
              />
              <span className="text-[10px] text-gray-500 mt-1">{day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Items */}
      <div className="card p-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Pratos mais pedidos</h3>
        <div className="space-y-3">
          {[
            { name: 'Frango Piri-Piri', orders: 89, revenue: '33.820 MT' },
            { name: 'Matapa com Camarao', orders: 67, revenue: '30.150 MT' },
            { name: 'Camarao Grelhado', orders: 45, revenue: '29.250 MT' },
            { name: 'Xima com Caril', orders: 38, revenue: '12.160 MT' },
            { name: 'Rissois de Camarao', orders: 34, revenue: '6.120 MT' },
          ].map((item, idx) => (
            <div key={item.name} className="flex items-center gap-3">
              <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                {idx + 1}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-500">{item.orders} pedidos</p>
              </div>
              <span className="text-xs font-semibold text-gray-900">{item.revenue}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
