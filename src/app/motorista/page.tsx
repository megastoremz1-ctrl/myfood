'use client';

import { useState, useEffect } from 'react';
import { Power, Package, MapPin, Phone, CheckCircle, DollarSign, Clock, Loader2, RefreshCw, Navigation, Star } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';

interface Driver {
  id: string;
  is_online: boolean;
  full_name: string;
  phone: string;
  vehicle_type: string;
  rating: number;
}

interface Order {
  id: string;
  total: number;
  status: string;
  delivery_address: string;
  created_at: string;
  driver_id: string | null;
  actual_delivery_time: string | null;
  restaurants: {
    name: string;
    address: string;
  };
  profiles: {
    full_name: string;
    phone?: string;
  };
}

export default function DriverPage() {
  const [driver, setDriver] = useState<Driver | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [availableDeliveries, setAvailableDeliveries] = useState<Order[]>([]);
  const [activeDelivery, setActiveDelivery] = useState<Order | null>(null);
  const [deliveriesToday, setDeliveriesToday] = useState(0);
  const [earningsToday, setEarningsToday] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const supabase = getSupabase();

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      const { data: driverData } = await supabase
        .from('drivers')
        .select('*')
        .eq('id', user.id)
        .single();

      if (driverData) {
        setDriver(driverData);
        setIsOnline(driverData.is_online);
      }

      const { data: available } = await supabase
        .from('orders')
        .select('*, restaurants(name, address), profiles!orders_customer_id_fkey(full_name)')
        .eq('status', 'ready')
        .is('driver_id', null)
        .order('created_at', { ascending: false });

      if (available) {
        setAvailableDeliveries(available as Order[]);
      }

      const { data: active } = await supabase
        .from('orders')
        .select('*, restaurants(name, address), profiles!orders_customer_id_fkey(full_name, phone)')
        .eq('driver_id', user.id)
        .in('status', ['picked_up', 'on_the_way'])
        .single();

      if (active) {
        setActiveDelivery(active as Order);
      }

      // Stats: deliveries today
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const { count: todayCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('driver_id', user.id)
        .eq('status', 'delivered')
        .gte('actual_delivery_time', todayStart.toISOString());

      setDeliveriesToday(todayCount || 0);

      // Earnings today (sum of total * 0.15 for delivered today)
      const { data: deliveredToday } = await supabase
        .from('orders')
        .select('total')
        .eq('driver_id', user.id)
        .eq('status', 'delivered')
        .gte('actual_delivery_time', todayStart.toISOString());

      if (deliveredToday) {
        const totalEarnings = deliveredToday.reduce((sum, order) => sum + (order.total * 0.15), 0);
        setEarningsToday(totalEarnings);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleToggleOnline = async () => {
    if (!userId) return;
    const supabase = getSupabase();
    const newStatus = !isOnline;

    const { error } = await supabase
      .from('drivers')
      .update({ is_online: newStatus })
      .eq('id', userId);

    if (!error) {
      setIsOnline(newStatus);
    }
  };

  const handleAcceptDelivery = async (orderId: string) => {
    if (!userId) return;
    const supabase = getSupabase();

    const { error } = await supabase
      .from('orders')
      .update({ driver_id: userId, status: 'picked_up' })
      .eq('id', orderId);

    if (!error) {
      await loadData();
    }
  };

  const handleCompleteDelivery = async (orderId: string) => {
    if (!userId) return;
    const supabase = getSupabase();

    const { error } = await supabase
      .from('orders')
      .update({ status: 'delivered', actual_delivery_time: new Date().toISOString() })
      .eq('id', orderId);

    if (!error) {
      setActiveDelivery(null);
      await loadData();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Online Toggle */}
      <div className="card p-4 mb-4 flex items-center justify-between">
        <div>
          <p className="font-semibold text-gray-900 text-sm">
            {isOnline ? 'Esta online' : 'Esta offline'}
          </p>
          <p className="text-xs text-gray-500">
            {isOnline ? 'A receber pedidos de entrega' : 'Fique online para receber entregas'}
          </p>
        </div>
        <button
          onClick={handleToggleOnline}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${
            isOnline
              ? 'bg-secondary-500 text-white shadow-lg shadow-secondary-200'
              : 'bg-gray-200 text-gray-600'
          }`}
        >
          <Power className="w-4 h-4" />
          {isOnline ? 'Online' : 'Offline'}
        </button>
      </div>

      {!isOnline ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Power className="w-8 h-8 text-gray-300" />
          </div>
          <h2 className="font-bold text-gray-700 mb-1">Esta offline</h2>
          <p className="text-sm text-gray-500">Fique online para receber entregas</p>
        </div>
      ) : (
        <>
          {/* Today Stats */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {[
              { label: 'Entregas', value: deliveriesToday.toString(), icon: Package, color: 'text-blue-500' },
              { label: 'Ganhos', value: `${earningsToday.toFixed(0)} MT`, icon: DollarSign, color: 'text-secondary-500' },
              { label: 'Rating', value: driver?.rating?.toFixed(1) || '0.0', icon: Star, color: 'text-yellow-500' },
              { label: 'Status', value: 'Ativo', icon: Clock, color: 'text-primary-500' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="card p-3 text-center">
                <Icon className={`w-4 h-4 ${color} mx-auto mb-1`} />
                <p className="text-xs font-bold text-gray-900">{value}</p>
                <p className="text-[9px] text-gray-500">{label}</p>
              </div>
            ))}
          </div>

          {/* Refresh Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-500 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
          </div>

          {/* Active Delivery */}
          {activeDelivery && (
            <div className="card p-4 mb-6 border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-secondary-600">
                  Entrega ativa
                </span>
              </div>

              {/* Map placeholder */}
              <div className="h-32 bg-gradient-to-br from-blue-50 to-secondary-50 rounded-xl flex items-center justify-center mb-4">
                <div className="text-center">
                  <Navigation className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                  <p className="text-[10px] text-gray-600">Navegacao GPS ativa</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-primary-500 rounded-full" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500">Restaurante</p>
                    <p className="text-sm font-medium text-gray-900">{activeDelivery.restaurants?.name}</p>
                    <p className="text-xs text-gray-500">{activeDelivery.restaurants?.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-3 h-3 text-secondary-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500">Cliente</p>
                    <p className="text-sm font-medium text-gray-900">{activeDelivery.profiles?.full_name}</p>
                    <p className="text-xs text-gray-500">{activeDelivery.delivery_address}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleCompleteDelivery(activeDelivery.id)}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Confirmar entrega
                </button>
                {activeDelivery.profiles?.phone && (
                  <a
                    href={`tel:${activeDelivery.profiles.phone}`}
                    className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center hover:bg-blue-100"
                  >
                    <Phone className="w-4 h-4 text-blue-500" />
                  </a>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs text-gray-500">
                <span>Ganho: {(activeDelivery.total * 0.15).toFixed(0)} MT</span>
                <span className="font-semibold text-secondary-600">Total pedido: {activeDelivery.total.toFixed(0)} MT</span>
              </div>
            </div>
          )}

          {/* Available Deliveries */}
          {!activeDelivery && (
            <div>
              <h3 className="font-semibold text-gray-900 text-sm mb-3">
                Entregas disponiveis ({availableDeliveries.length})
              </h3>

              {availableDeliveries.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Package className="w-7 h-7 text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-500">Nenhuma entrega disponivel no momento</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {availableDeliveries.map((delivery) => (
                    <div key={delivery.id} className="card p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{delivery.restaurants?.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{delivery.profiles?.full_name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-secondary-600 text-sm">+{(delivery.total * 0.15).toFixed(0)} MT</p>
                          <p className="text-xs text-gray-400">15% de {delivery.total.toFixed(0)} MT</p>
                        </div>
                      </div>
                      <div className="space-y-1.5 mb-3">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <div className="w-1.5 h-1.5 bg-primary-500 rounded-full flex-shrink-0" />
                          <span className="truncate">{delivery.restaurants?.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <div className="w-1.5 h-1.5 bg-secondary-500 rounded-full flex-shrink-0" />
                          <span className="truncate">{delivery.delivery_address}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAcceptDelivery(delivery.id)}
                        className="btn-primary w-full"
                      >
                        Aceitar entrega
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
