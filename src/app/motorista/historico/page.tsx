'use client';

import { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabase';
import { CheckCircle, Clock, DollarSign, Loader2, RefreshCw, Star, Package } from 'lucide-react';

interface DeliveryOrder {
  id: string;
  total: number;
  created_at: string;
  restaurants: { name: string } | null;
  profiles: { full_name: string } | null;
}

export default function HistoricoPage() {
  const [deliveries, setDeliveries] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const supabase = getSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('orders')
        .select('*, restaurants(name), profiles!orders_customer_id_fkey(full_name)')
        .eq('driver_id', user.id)
        .eq('status', 'delivered')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Erro ao buscar entregas:', error);
        return;
      }

      setDeliveries(data || []);
    } catch (err) {
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const totalDeliveries = deliveries.length;
  const totalEarnings = deliveries.reduce((sum, d) => sum + (d.total * 0.15), 0);
  const averagePerDelivery = totalDeliveries > 0 ? totalEarnings / totalDeliveries : 0;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-MZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
        <h1 className="text-2xl font-bold text-gray-800">Histórico de Entregas</h1>
        <button
          onClick={fetchDeliveries}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <RefreshCw className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="card p-3 text-center">
          <Package className="w-5 h-5 text-orange-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-800">{totalDeliveries}</p>
          <p className="text-xs text-gray-500">Total entregas</p>
        </div>
        <div className="card p-3 text-center">
          <DollarSign className="w-5 h-5 text-green-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-800">{totalEarnings.toFixed(2)} MT</p>
          <p className="text-xs text-gray-500">Total ganhos</p>
        </div>
        <div className="card p-3 text-center">
          <Star className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-800">{averagePerDelivery.toFixed(2)} MT</p>
          <p className="text-xs text-gray-500">Média/entrega</p>
        </div>
      </div>

      {/* Delivery List */}
      {deliveries.length === 0 ? (
        <div className="card p-8 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Nenhuma entrega concluída</p>
        </div>
      ) : (
        <div className="space-y-3">
          {deliveries.map((delivery) => (
            <div key={delivery.id} className="card p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="font-semibold text-gray-800">
                      {delivery.restaurants?.name || 'Restaurante'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 ml-6">
                    Cliente: {delivery.profiles?.full_name || 'Cliente'}
                  </p>
                  <div className="flex items-center gap-1 mt-1 ml-6">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-400">
                      {formatDate(delivery.created_at)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total: {delivery.total.toFixed(2)} MT</p>
                  <p className="text-sm font-bold text-green-600">
                    +{(delivery.total * 0.15).toFixed(2)} MT
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
