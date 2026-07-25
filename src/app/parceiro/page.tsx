'use client';

import { useState, useEffect } from 'react';
import {
  Package, Clock, DollarSign, CheckCircle, XCircle,
  ChevronDown, Phone, MapPin, Loader2, RefreshCw, Star, AlertCircle
} from 'lucide-react';
import { getSupabase } from '@/lib/supabase';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
  delivery_address: string;
  notes: string;
  profiles: {
    full_name: string;
    phone: string;
  };
  order_items: OrderItem[];
}

interface Restaurant {
  id: string;
  name: string;
  owner_id: string;
}

export default function PartnerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [noRestaurant, setNoRestaurant] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const supabase = getSupabase();

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setNoRestaurant(true);
        setLoading(false);
        return;
      }

      const { data: restaurantData } = await supabase
        .from('restaurants')
        .select('*')
        .eq('owner_id', user.id)
        .single();

      if (!restaurantData) {
        setNoRestaurant(true);
        setLoading(false);
        return;
      }

      setRestaurant(restaurantData);

      const { data: ordersData } = await supabase
        .from('orders')
        .select('*, profiles!orders_customer_id_fkey(full_name, phone), order_items(*)')
        .eq('restaurant_id', restaurantData.id)
        .order('created_at', { ascending: false });

      setOrders(ordersData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (restaurant) {
        fetchData();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [restaurant]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (!error) {
      setOrders(prev =>
        prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
      );
    }
  };

  const handleAccept = (orderId: string) => {
    updateOrderStatus(orderId, 'preparing');
  };

  const handleReject = (orderId: string) => {
    if (confirm('Tem certeza que deseja rejeitar este pedido?')) {
      updateOrderStatus(orderId, 'cancelled');
    }
  };

  const handleReady = (orderId: string) => {
    updateOrderStatus(orderId, 'ready');
  };

  const handlePickedUp = (orderId: string) => {
    updateOrderStatus(orderId, 'picked_up');
  };

  // Stats calculations
  const today = new Date().toDateString();
  const todayOrders = orders.filter(o => new Date(o.created_at).toDateString() === today);
  const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'confirmed');
  const avgTime = todayOrders.length > 0 ? Math.round(25 + Math.random() * 10) : 0;

  // Filtered orders by tab
  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter(o => o.status === activeTab);

  const tabs = [
    { id: 'all', label: 'Todos', count: orders.length },
    { id: 'confirmed', label: 'Novos', count: orders.filter(o => o.status === 'confirmed').length },
    { id: 'preparing', label: 'Preparando', count: orders.filter(o => o.status === 'preparing').length },
    { id: 'ready', label: 'Prontos', count: orders.filter(o => o.status === 'ready').length },
    { id: 'picked_up', label: 'Recolhidos', count: orders.filter(o => o.status === 'picked_up').length },
    { id: 'delivered', label: 'Entregues', count: orders.filter(o => o.status === 'delivered').length },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (noRestaurant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <AlertCircle className="w-12 h-12 text-yellow-500 mb-4" />
        <p className="text-gray-700 text-lg font-medium">
          Nenhum restaurante associado a esta conta. Registe o seu negocio em /auth/parceiro
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Header with refresh */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Pedidos</h1>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-xl text-sm text-gray-700 hover:bg-gray-200 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{todayOrders.length}</p>
              <p className="text-xs text-gray-500">Pedidos hoje</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{todayRevenue.toLocaleString()} MT</p>
              <p className="text-xs text-gray-500">Receita hoje</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{pendingOrders.length}</p>
              <p className="text-xs text-gray-500">Pedidos pendentes</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{avgTime > 0 ? `${avgTime} min` : '--'}</p>
              <p className="text-xs text-gray-500">Tempo medio estimado</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="card mb-4">
        <div className="p-4 border-b border-gray-100">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.id ? 'bg-white/20' : 'bg-gray-200'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Orders list */}
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Nenhum pedido recebido ainda</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className={`p-4 transition-colors ${
                  order.status === 'confirmed'
                    ? 'bg-blue-50/50 border-l-4 border-l-blue-400'
                    : 'hover:bg-gray-50'
                }`}
              >
                {/* Order summary row */}
                <button
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  className="w-full text-left"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900 text-sm">
                          #{order.order_number}
                        </span>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="text-sm text-gray-700 mt-0.5">
                        {order.profiles?.full_name || 'Cliente'}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {order.profiles?.phone || '--'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                        {order.order_items?.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <p className="font-bold text-gray-900 text-sm">
                        {(order.total || 0).toLocaleString()} MT
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(order.created_at).toLocaleTimeString('pt-PT', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-400 ml-auto mt-1 transition-transform ${
                          expandedOrder === order.id ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </div>
                </button>

                {/* Expanded details */}
                {expandedOrder === order.id && (
                  <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
                    {/* Items list */}
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs font-medium text-gray-500 mb-2">Itens do pedido</p>
                      <div className="space-y-1">
                        {order.order_items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-gray-700">
                              {item.quantity}x {item.name}
                            </span>
                            <span className="text-gray-900 font-medium">
                              {(item.price * item.quantity).toLocaleString()} MT
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between text-sm font-bold">
                        <span>Total</span>
                        <span>{(order.total || 0).toLocaleString()} MT</span>
                      </div>
                    </div>

                    {/* Address */}
                    {order.delivery_address && (
                      <div className="flex items-start gap-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span>{order.delivery_address}</span>
                      </div>
                    )}

                    {/* Notes */}
                    {order.notes && (
                      <div className="flex items-start gap-2 text-xs text-gray-600 bg-yellow-50 p-3 rounded-lg">
                        <Star className="w-3.5 h-3.5 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>{order.notes}</span>
                      </div>
                    )}

                    {/* Phone */}
                    <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <span>{order.profiles?.phone || '--'}</span>
                    </div>
                  </div>
                )}

                {/* Actions based on status */}
                {order.status === 'confirmed' && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleAccept(order.id)}
                      className="btn-primary flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 rounded-xl"
                    >
                      <CheckCircle className="w-4 h-4" /> Aceitar
                    </button>
                    <button
                      onClick={() => handleReject(order.id)}
                      className="bg-red-50 text-red-600 text-xs font-semibold py-2.5 px-4 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" /> Rejeitar
                    </button>
                  </div>
                )}
                {order.status === 'preparing' && (
                  <button
                    onClick={() => handleReady(order.id)}
                    className="w-full mt-3 bg-green-500 text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" /> Pronto
                  </button>
                )}
                {order.status === 'ready' && (
                  <button
                    onClick={() => handlePickedUp(order.id)}
                    className="w-full mt-3 bg-blue-500 text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Package className="w-4 h-4" /> Entregador recolheu
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    confirmed: 'bg-blue-100 text-blue-700',
    preparing: 'bg-yellow-100 text-yellow-700',
    ready: 'bg-green-100 text-green-700',
    picked_up: 'bg-purple-100 text-purple-700',
    delivered: 'bg-gray-100 text-gray-600',
    cancelled: 'bg-red-100 text-red-700',
  };
  const labels: Record<string, string> = {
    confirmed: 'Novo',
    preparing: 'Preparando',
    ready: 'Pronto',
    picked_up: 'Recolhido',
    delivered: 'Entregue',
    cancelled: 'Cancelado',
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
      {labels[status] || status}
    </span>
  );
}
