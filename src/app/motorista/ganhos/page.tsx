'use client';

import { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabase';
import { DollarSign, TrendingUp, Calendar, Loader2, RefreshCw, Wallet, ArrowUpRight } from 'lucide-react';

interface OrderData {
  total: number;
  created_at: string;
}

export default function GanhosPage() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchEarnings = async () => {
    setLoading(true);
    try {
      const supabase = getSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('total, created_at')
        .eq('driver_id', user.id)
        .eq('status', 'delivered');

      if (ordersError) {
        console.error('Erro ao buscar ganhos:', ordersError);
        return;
      }

      setOrders(ordersData || []);

      const { data: driverData, error: driverError } = await supabase
        .from('drivers')
        .select('balance')
        .eq('user_id', user.id)
        .single();

      if (!driverError && driverData) {
        setBalance(driverData.balance || 0);
      }
    } catch (err) {
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart.getTime() - 6 * 24 * 60 * 60 * 1000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const totalEarnings = orders.reduce((sum, o) => sum + (o.total * 0.15), 0);

  const todayEarnings = orders
    .filter((o) => new Date(o.created_at) >= todayStart)
    .reduce((sum, o) => sum + (o.total * 0.15), 0);

  const weekEarnings = orders
    .filter((o) => new Date(o.created_at) >= weekStart)
    .reduce((sum, o) => sum + (o.total * 0.15), 0);

  const monthEarnings = orders
    .filter((o) => new Date(o.created_at) >= monthStart)
    .reduce((sum, o) => sum + (o.total * 0.15), 0);

  // Last 7 days bar chart data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(todayStart.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
    const nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);
    const dayEarnings = orders
      .filter((o) => {
        const orderDate = new Date(o.created_at);
        return orderDate >= date && orderDate < nextDate;
      })
      .reduce((sum, o) => sum + (o.total * 0.15), 0);

    return {
      label: date.toLocaleDateString('pt-MZ', { weekday: 'short' }),
      value: dayEarnings,
    };
  });

  const maxDayEarning = Math.max(...last7Days.map((d) => d.value), 1);

  const handleWithdrawal = () => {
    alert('Funcionalidade de levantamento em breve! O seu saldo actual é de ' + balance.toFixed(2) + ' MT.');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="p-4 pb-24 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Meus Ganhos</h1>
        <button
          onClick={fetchEarnings}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <RefreshCw className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="card p-8 text-center">
          <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Nenhum ganho registado</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-5 h-5 text-purple-500" />
                <span className="text-xs text-gray-500">Saldo disponível</span>
              </div>
              <p className="text-xl font-bold text-gray-800">{balance.toFixed(2)} MT</p>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <span className="text-xs text-gray-500">Ganhos hoje</span>
              </div>
              <p className="text-xl font-bold text-gray-800">{todayEarnings.toFixed(2)} MT</p>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span className="text-xs text-gray-500">Ganhos esta semana</span>
              </div>
              <p className="text-xl font-bold text-gray-800">{weekEarnings.toFixed(2)} MT</p>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                <span className="text-xs text-gray-500">Ganhos este mês</span>
              </div>
              <p className="text-xl font-bold text-gray-800">{monthEarnings.toFixed(2)} MT</p>
            </div>
          </div>

          {/* Total Earnings */}
          <div className="card p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total de ganhos</p>
                <p className="text-2xl font-bold text-green-600">{totalEarnings.toFixed(2)} MT</p>
              </div>
              <ArrowUpRight className="w-6 h-6 text-green-500" />
            </div>
          </div>

          {/* Bar Chart - Last 7 Days */}
          <div className="card p-4 mb-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Últimos 7 dias</h2>
            <div className="flex items-end justify-between gap-2 h-32">
              {last7Days.map((day, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <span className="text-xs text-gray-500 mb-1">
                    {day.value > 0 ? `${day.value.toFixed(0)}` : ''}
                  </span>
                  <div
                    className="w-full bg-orange-400 rounded-t-sm min-h-[4px] transition-all"
                    style={{
                      height: `${(day.value / maxDayEarning) * 100}%`,
                    }}
                  />
                  <span className="text-xs text-gray-400 mt-1">{day.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Withdrawal Button */}
          <button
            onClick={handleWithdrawal}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <Wallet className="w-5 h-5" />
            Levantar saldo
          </button>
        </>
      )}
    </div>
  );
}
