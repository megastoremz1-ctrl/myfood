'use client';

import { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  Loader2,
  RefreshCw,
  ArrowUpRight,
  Calendar,
} from 'lucide-react';
import { getSupabase } from '@/lib/supabase';

interface Order {
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
}

export default function PartnerFinancePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [commission, setCommission] = useState(0);
  const [netEarnings, setNetEarnings] = useState(0);
  const [monthRevenue, setMonthRevenue] = useState(0);

  const fetchFinancialData = async () => {
    setLoading(true);
    try {
      const supabase = getSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: restaurant } = await supabase
        .from('restaurants')
        .select('id')
        .eq('owner_id', user.id)
        .single();

      if (!restaurant) return;

      const { data: ordersData } = await supabase
        .from('orders')
        .select('total, status, payment_status, created_at')
        .eq('restaurant_id', restaurant.id)
        .eq('payment_status', 'paid');

      if (ordersData) {
        setOrders(ordersData);

        const total = ordersData.reduce((sum: number, order: Order) => sum + (order.total || 0), 0);
        setTotalRevenue(total);
        setCommission(total * 0.15);
        setNetEarnings(total * 0.85);

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const thisMonthOrders = ordersData.filter(
          (order: Order) => new Date(order.created_at) >= startOfMonth
        );
        const thisMonthTotal = thisMonthOrders.reduce((sum: number, order: Order) => sum + (order.total || 0), 0);
        setMonthRevenue(thisMonthTotal);
      }
    } catch (error) {
      console.error('Erro ao carregar dados financeiros:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">Financeiro</h2>
        <button
          onClick={fetchFinancialData}
          className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-xl hover:bg-gray-200 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Atualizar
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="card p-4 text-center">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-xl font-bold text-gray-900">{netEarnings.toLocaleString()} MT</p>
          <p className="text-xs text-gray-500 mt-1">Saldo disponivel</p>
        </div>

        <div className="card p-4 text-center">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-xl font-bold text-gray-900">{totalRevenue.toLocaleString()} MT</p>
          <p className="text-xs text-gray-500 mt-1">Receita total</p>
        </div>

        <div className="card p-4 text-center">
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-2">
            <DollarSign className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-xl font-bold text-gray-900">{commission.toLocaleString()} MT</p>
          <p className="text-xs text-gray-500 mt-1">Comissao MyFood (15%)</p>
        </div>

        <div className="card p-4 text-center">
          <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-2">
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-xl font-bold text-gray-900">{monthRevenue.toLocaleString()} MT</p>
          <p className="text-xs text-gray-500 mt-1">Receita este mes</p>
        </div>
      </div>

      {/* Transactions List */}
      <div className="card">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 text-sm">Transacoes</h3>
          <span className="text-xs text-gray-400">{orders.length} transacoes</span>
        </div>
        <div className="divide-y divide-gray-50">
          {orders.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">
              Nenhuma transacao encontrada
            </div>
          ) : (
            orders.map((order, index) => (
              <div key={index} className="px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-green-50">
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 truncate">
                    Pedido - {order.total.toLocaleString()} MT
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-[11px] text-gray-400">
                      {new Date(order.created_at).toLocaleDateString('pt-MZ', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-green-50 text-green-700">
                      {order.status}
                    </span>
                  </div>
                </div>
                <span className="text-sm font-semibold whitespace-nowrap text-green-600">
                  +{order.total.toLocaleString()} MT
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
