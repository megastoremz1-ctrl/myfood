'use client';

import { Users, Store, Bike, Package, DollarSign, AlertCircle, TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react';

const stats = [
  { label: 'Clientes', value: '12.450', change: '+8%', trend: 'up', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
  { label: 'Restaurantes', value: '156', change: '+3', trend: 'up', icon: Store, color: 'text-primary-500', bg: 'bg-primary-50' },
  { label: 'Entregadores', value: '89', change: '+12', trend: 'up', icon: Bike, color: 'text-secondary-500', bg: 'bg-secondary-50' },
  { label: 'Pedidos Hoje', value: '342', change: '+22%', trend: 'up', icon: Package, color: 'text-purple-500', bg: 'bg-purple-50' },
  { label: 'Receita Hoje', value: '245.600 MT', change: '+18%', trend: 'up', icon: DollarSign, color: 'text-green-500', bg: 'bg-green-50' },
  { label: 'Reclamacoes', value: '5', change: '-2', trend: 'down', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
];

const recentOrders = [
  { id: 'ORD-2341', customer: 'Antonio M.', restaurant: "Mundo's", total: '610 MT', status: 'Entregue', time: '14:32' },
  { id: 'ORD-2340', customer: 'Maria S.', restaurant: 'Pizza House', total: '480 MT', status: 'A caminho', time: '14:28' },
  { id: 'ORD-2339', customer: 'Joao P.', restaurant: 'Sushi Master', total: '890 MT', status: 'Preparando', time: '14:25' },
  { id: 'ORD-2338', customer: 'Ana L.', restaurant: 'Cafe Central', total: '220 MT', status: 'Confirmado', time: '14:20' },
  { id: 'ORD-2337', customer: 'Carlos F.', restaurant: 'Frango PP', total: '430 MT', status: 'Entregue', time: '14:15' },
];

const topRestaurants = [
  { name: "Mundo's Restaurant", orders: 45, revenue: '28.500 MT', rating: 4.8 },
  { name: 'Frango Piri-Piri', orders: 38, revenue: '22.100 MT', rating: 4.7 },
  { name: 'Pizza House Maputo', orders: 32, revenue: '19.800 MT', rating: 4.5 },
  { name: 'Cafe Central', orders: 28, revenue: '8.400 MT', rating: 4.6 },
];

export default function AdminDashboard() {
  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        {stats.map(({ label, value, change, trend, icon: Icon, color, bg }) => (
          <div key={label} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <span className={`text-xs font-medium flex items-center gap-0.5 ${trend === 'up' ? 'text-secondary-600' : 'text-secondary-600'}`}>
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
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs font-mono text-gray-900">{order.id}</td>
                    <td className="px-4 py-3 text-xs text-gray-700">{order.customer}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 hidden sm:table-cell">{order.restaurant}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-gray-900">{order.total}</td>
                    <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
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
          </div>
          <div className="p-4 space-y-3">
            {topRestaurants.map((r, idx) => (
              <div key={r.name} className="flex items-center gap-3">
                <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{r.name}</p>
                  <p className="text-xs text-gray-500">{r.orders} pedidos</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-gray-900">{r.revenue}</p>
                  <div className="flex items-center gap-0.5 justify-end">
                    <Activity className="w-3 h-3 text-yellow-400" />
                    <span className="text-[10px] text-gray-500">{r.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="card mt-6 p-6">
        <h3 className="font-bold text-gray-900 text-sm mb-4">Desempenho Semanal</h3>
        <div className="flex items-end justify-between gap-3 h-40">
          {[65, 40, 78, 52, 90, 100, 85].map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-purple-500 rounded-t-lg hover:bg-purple-600 transition-colors" style={{ height: `${val}%` }} />
              <span className="text-[10px] text-gray-500">{['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'][i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
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
