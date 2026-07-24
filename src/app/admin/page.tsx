'use client';

import { useState, useEffect } from 'react';
import { Users, Store, Bike, Package, DollarSign, AlertCircle, TrendingUp, Loader2, Activity, RefreshCw } from 'lucide-react';
import { getAdminStats, getAllOrders } from '@/lib/db';
import { getSupabase } from '@/lib/supabase';

interface Stats {
  totalOrders: number;
  totalRestaurants: number;
  totalUsers: number;
  totalDrivers: number;
  totalRevenue: number;
  totalComplaints: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  restaurant: string;
  total: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [topRestaurants, setTopRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadData() {
    const supabase = getSupabase();

    // Get stats
    const [
      { count: totalOrders },
      { count: totalRestaurants },
      { count: totalUsers },
      { count: totalDrivers },
      { count: totalComplaints },
    ] = await Promise.all([
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('restaurants').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('drivers').select('*', { count: 'exact', head: true }),
      supabase.from('complaints').select('*', { count: 'exact', head: true }),
    ]);

    // Get total revenue
    const { data: revenueData } = await supabase
      .from('orders')
      .select('total')
      .eq('payment_status', 'paid');

    const totalRevenue = revenueData?.reduce((sum: number, o: any) => sum + parseFloat(o.total || 0), 0) || 0;

    setStats({
      totalOrders: totalOrders || 0,
      totalRestaurants: totalRestaurants || 0,
      totalUsers: totalUsers || 0,
      totalDrivers: totalDrivers || 0,
      totalRevenue,
      totalComplaints: totalComplaints || 0,
    });

    // Get recent orders
    const recentOrders = await getAllOrders({ limit: 10 });
    setOrders(recentOrders);

    // Get top restaurants
    const { data: restaurants } = await supabase
      .from('restaurants')
      .select('id, name, rating, total_reviews')
      .eq('status', 'active')
      .order('total_reviews', { ascending: false })
      .limit(5);

    if (restaurants) {
      setTopRestaurants(restaurants.map((r: any) => ({
        name: r.name,
        orders: r.total_reviews || 0,
        rating: parseFloat(r.rating) || 0,
      })));
    }
  }

  useEffect(() => {
    loadData().then(() => setLoading(false));
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      confirmed: 'Confirmado',
      preparing: 'Preparando',
      ready: 'Pronto',
      picked_up: 'Recolhido',
      on_the_way: 'A caminho',
      delivered: 'Entregue',
      cancelled: 'Cancelado',
      pending: 'Pendente',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      confirmed: 'bg-purple-100 text-purple-700',
      preparing: 'bg-yellow-100 text-yellow-700',
      ready: 'bg-blue-100 text-blue-700',
      picked_up: 'bg-indigo-100 text-indigo-700',
      on_the_way: 'bg-blue-100 text-blue-700',
      delivered: 'bg-secondary-100 text-secondary-700',
      cancelled: 'bg-red-100 text-red-700',
      pending: 'bg-gray-100 text-gray-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: 'Clientes', value: stats?.totalUsers || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Restaurantes', value: stats?.totalRestaurants || 0, icon: Store, color: 'text-primary-500', bg: 'bg-primary-50' },
    { label: 'Entregadores', value: stats?.totalDrivers || 0, icon: Bike, color: 'text-secondary-500', bg: 'bg-secondary-50' },
    { label: 'Pedidos', value: stats?.totalOrders || 0, icon: Package, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Receita Total', value: `${(stats?.totalRevenue || 0).toLocaleString()} MT`, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Reclamacoes', value: stats?.totalComplaints || 0, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
          <p className="text-xs text-gray-500">Dados em tempo real da plataforma</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 rounded-xl text-sm text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <TrendingUp className="w-3 h-3 text-secondary-500" />
            </div>
            <p className="text-lg font-bold text-gray-900">{typeof value === 'number' ? value.toLocaleString() : value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 card">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 text-sm">Pedidos Recentes</h2>
            <span className="text-xs text-gray-400">{orders.length} pedidos</span>
          </div>

          {orders.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Nenhum pedido ainda</p>
              <p className="text-xs text-gray-400">Os pedidos aparecerao aqui em tempo real</p>
            </div>
          ) : (
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
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-xs font-mono text-gray-900">{order.orderNumber || order.id.slice(0, 8)}</td>
                      <td className="px-4 py-3 text-xs text-gray-700">{order.customer}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 hidden sm:table-cell">{order.restaurant}</td>
                      <td className="px-4 py-3 text-xs font-semibold text-gray-900">{order.total} MT</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Restaurants */}
        <div className="card">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 text-sm">Top Restaurantes</h2>
          </div>

          {topRestaurants.length === 0 ? (
            <div className="p-6 text-center">
              <Store className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-500">Nenhum restaurante activo</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {topRestaurants.map((r: any, idx: number) => (
                <div key={r.name} className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{r.name}</p>
                    <p className="text-xs text-gray-500">{r.orders} avaliacoes</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-0.5 justify-end">
                      <Activity className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs font-semibold text-gray-700">{r.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
