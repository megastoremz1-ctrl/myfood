'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Package, DollarSign, Loader2, RefreshCw, Star } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';

interface OrderItem {
  name: string;
  quantity: number;
}

interface Order {
  total: number;
  status: string;
  created_at: string;
  order_items: OrderItem[];
}

interface DayData {
  day: string;
  count: number;
}

export default function RelatoriosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = getSupabase();

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: restaurant } = await supabase
        .from('restaurants')
        .select('id')
        .eq('owner_id', user.id)
        .single();

      if (!restaurant) return;


      const { data: orders } = await supabase
        .from('orders')
        .select('total, status, created_at, order_items(name, quantity)')
        .eq('restaurant_id', restaurant.id);

      setOrders(orders || []);
    } catch (error) {
      console.error('Erro ao carregar relatorios:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate stats
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const averageOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const deliveryRate = totalOrders > 0
    ? orders.filter((o) => o.status === 'delivered').length / totalOrders * 100
    : 0;


  // Orders by status
  const statusCounts = {
    confirmed: orders.filter((o) => o.status === 'confirmed').length,
    preparing: orders.filter((o) => o.status === 'preparing').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  };

  // Top items
  const itemCounts: Record<string, number> = {};
  orders.forEach((order) => {
    if (order.order_items) {
      order.order_items.forEach((item) => {
        itemCounts[item.name] = (itemCounts[item.name] || 0) + (item.quantity || 1);
      });
    }
  });
  const topItems = Object.entries(itemCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);


  // Orders per day (last 7 days)
  const last7Days: DayData[] = [];
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const count = orders.filter((o) => o.created_at?.startsWith(dateStr)).length;
    last7Days.push({ day: dayNames[date.getDay()], count });
  }
  const maxDayOrders = Math.max(...last7Days.map((d) => d.count), 1);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }


  if (orders.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-7 h-7 text-orange-500" />
              Relatorios
            </h1>
            <button
              onClick={fetchData}
              className="inline-flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Atualizar
            </button>
          </div>
          <div className="text-center py-12">
            <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-lg">Nenhum dado disponivel</p>
            <p className="text-gray-400 text-sm mt-1">Os dados aparecerão quando houver pedidos</p>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-7 h-7 text-orange-500" />
              Relatorios
            </h1>
            <p className="text-gray-500 mt-1">Acompanhe o desempenho do seu restaurante</p>
          </div>
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </button>
        </div>


        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total pedidos</p>
                <p className="text-xl font-bold text-gray-900">{totalOrders}</p>
              </div>
            </div>
          </div>
          <div className="card bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Receita total</p>
                <p className="text-xl font-bold text-gray-900">{totalRevenue.toFixed(2)} MT</p>
              </div>
            </div>
          </div>
          <div className="card bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Ticket medio</p>
                <p className="text-xl font-bold text-gray-900">{averageOrder.toFixed(2)} MT</p>
              </div>
            </div>
          </div>
          <div className="card bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Taxa de entrega</p>
                <p className="text-xl font-bold text-gray-900">{deliveryRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>


        {/* Orders by Status */}
        <div className="card bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Pedidos por Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-700">{statusCounts.confirmed}</p>
              <p className="text-xs text-blue-600">Confirmados</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-700">{statusCounts.preparing}</p>
              <p className="text-xs text-yellow-600">Preparando</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-700">{statusCounts.delivered}</p>
              <p className="text-xs text-green-600">Entregues</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-700">{statusCounts.cancelled}</p>
              <p className="text-xs text-red-600">Cancelados</p>
            </div>
          </div>
        </div>


        {/* Bar Chart - Last 7 Days */}
        <div className="card bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Pedidos por dia (ultimos 7 dias)</h3>
          <div className="flex items-end justify-between gap-2 h-40">
            {last7Days.map((data, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-medium text-gray-600">{data.count}</span>
                <div
                  className="w-full bg-orange-500 rounded-t-lg transition-all hover:bg-orange-600"
                  style={{ height: `${(data.count / maxDayOrders) * 100}%`, minHeight: '4px' }}
                />
                <span className="text-xs text-gray-500 mt-1">{data.day}</span>
              </div>
            ))}
          </div>
        </div>


        {/* Top 5 Items */}
        <div className="card bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-orange-500" />
            Top 5 Itens Mais Pedidos
          </h3>
          {topItems.length === 0 ? (
            <p className="text-gray-400 text-sm">Nenhum item registrado</p>
          ) : (
            <div className="space-y-3">
              {topItems.map(([name, count], idx) => (
                <div key={name} className="flex items-center gap-3">
                  <span className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center text-xs font-bold text-orange-600">
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{name}</p>
                    <p className="text-xs text-gray-500">{count} pedidos</p>
                  </div>
                  <div className="w-24 bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-orange-500"
                      style={{ width: `${(count / (topItems[0]?.[1] || 1)) * 100}%` }}
                    />
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
