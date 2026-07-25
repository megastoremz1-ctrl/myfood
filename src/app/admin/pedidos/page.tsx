'use client';

import { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabase';
import {
  Package, Search, Filter, Loader2, RefreshCw, DollarSign, Eye, X, Check, Clock
} from 'lucide-react';

type OrderStatus = 'confirmed' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';
type StatusFilter = 'all' | OrderStatus;

interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  restaurant_id: string;
  total: number;
  status: OrderStatus;
  payment_method: string;
  payment_status: string;
  created_at: string;
  delivery_address: string;
  notes: string | null;
  profiles: { full_name: string } | null;
  restaurants: { name: string } | null;
}

const statusLabels: Record<OrderStatus, string> = {
  confirmed: 'Confirmado',
  preparing: 'Preparando',
  on_the_way: 'A Caminho',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};

const statusColors: Record<OrderStatus, string> = {
  confirmed: 'bg-purple-100 text-purple-800',
  preparing: 'bg-yellow-100 text-yellow-800',
  on_the_way: 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusTabs: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'confirmed', label: 'Confirmados' },
  { key: 'preparing', label: 'Preparando' },
  { key: 'on_the_way', label: 'A Caminho' },
  { key: 'delivered', label: 'Entregues' },
  { key: 'cancelled', label: 'Cancelados' },
];

export default function AdminPedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('orders')
      .select('*, profiles!orders_customer_id_fkey(full_name), restaurants(name)')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } else {
      setOrders((data as Order[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingStatus(orderId);
    const supabase = getSupabase();
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
    } else {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    }
    setUpdatingStatus(null);
  };

  const filteredOrders = orders.filter((order) => {
    const customerName = order.profiles?.full_name || '';
    const matchesSearch =
      order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const totalOrders = orders.length;
  const totalRevenue = orders
    .filter((o) => o.payment_status === 'paid')
    .reduce((sum, o) => sum + (o.total || 0), 0);
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;
  const cancelledCount = orders.filter((o) => o.status === 'cancelled').length;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value || 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
          <p className="text-gray-500 text-sm">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Package className="w-7 h-7 text-orange-600" />
          <h1 className="text-2xl font-bold text-gray-800">Gestão de Pedidos</h1>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-gray-500">Total Pedidos</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{totalOrders}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-xs text-gray-500">Receita Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-1">
            <Check className="w-4 h-4 text-green-600" />
            <span className="text-xs text-gray-500">Entregues</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{deliveredCount}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-1">
            <X className="w-4 h-4 text-red-600" />
            <span className="text-xs text-gray-500">Cancelados</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{cancelledCount}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por número do pedido ou cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 font-medium">Filtros:</span>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2 mt-4">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                statusFilter === tab.key
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-3 font-medium text-gray-600">Pedido</th>
                <th className="text-left p-3 font-medium text-gray-600">Cliente</th>
                <th className="text-left p-3 font-medium text-gray-600 hidden md:table-cell">Restaurante</th>
                <th className="text-left p-3 font-medium text-gray-600">Total</th>
                <th className="text-left p-3 font-medium text-gray-600">Status</th>
                <th className="text-left p-3 font-medium text-gray-600 hidden md:table-cell">Pagamento</th>
                <th className="text-left p-3 font-medium text-gray-600 hidden lg:table-cell">Pag. Status</th>
                <th className="text-left p-3 font-medium text-gray-600 hidden md:table-cell">Data</th>
                <th className="text-left p-3 font-medium text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-mono text-xs font-medium">{order.order_number || '-'}</td>
                  <td className="p-3">{order.profiles?.full_name || '-'}</td>
                  <td className="p-3 hidden md:table-cell">{order.restaurants?.name || '-'}</td>
                  <td className="p-3 font-medium">{formatCurrency(order.total)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                  </td>
                  <td className="p-3 hidden md:table-cell text-gray-600">{order.payment_method || '-'}</td>
                  <td className="p-3 hidden lg:table-cell text-gray-600">{order.payment_status || '-'}</td>
                  <td className="p-3 hidden md:table-cell text-gray-500 text-xs">{formatDate(order.created_at)}</td>
                  <td className="p-3">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-1.5 rounded-lg hover:bg-orange-50 text-orange-600 transition-colors"
                      title="Ver detalhes"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredOrders.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Nenhum pedido encontrado</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white rounded-t-xl">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg font-bold text-gray-800">
                  Pedido {selectedOrder.order_number || selectedOrder.id}
                </h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-4">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${statusColors[selectedOrder.status] || 'bg-gray-100 text-gray-800'}`}>
                  {statusLabels[selectedOrder.status] || selectedOrder.status}
                </span>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDate(selectedOrder.created_at)}
                </span>
              </div>

              {/* Order Info */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Informações do Pedido</h3>
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Número:</span>
                    <span className="font-medium">{selectedOrder.order_number || '-'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Cliente:</span>
                    <span className="font-medium">{selectedOrder.profiles?.full_name || '-'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Restaurante:</span>
                    <span className="font-medium">{selectedOrder.restaurants?.name || '-'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total:</span>
                    <span className="font-bold text-green-700">{formatCurrency(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Pagamento</h3>
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Método:</span>
                    <span className="font-medium">{selectedOrder.payment_method || '-'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Status:</span>
                    <span className="font-medium">{selectedOrder.payment_status || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              {selectedOrder.delivery_address && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Endereço de Entrega</h3>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm">{selectedOrder.delivery_address}</p>
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Observações</h3>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm">{selectedOrder.notes}</p>
                  </div>
                </div>
              )}

              {/* Status Change */}
              {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'delivered' && (
                <div className="space-y-2 border-t pt-4">
                  <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Alterar Status</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedOrder.status === 'confirmed' && (
                      <button
                        onClick={() => handleStatusChange(selectedOrder.id, 'preparing')}
                        disabled={updatingStatus === selectedOrder.id}
                        className="flex items-center gap-1 px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium disabled:opacity-50"
                      >
                        {updatingStatus === selectedOrder.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                        Preparando
                      </button>
                    )}
                    {(selectedOrder.status === 'confirmed' || selectedOrder.status === 'preparing') && (
                      <button
                        onClick={() => handleStatusChange(selectedOrder.id, 'on_the_way')}
                        disabled={updatingStatus === selectedOrder.id}
                        className="flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium disabled:opacity-50"
                      >
                        {updatingStatus === selectedOrder.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                        A Caminho
                      </button>
                    )}
                    {(selectedOrder.status === 'confirmed' || selectedOrder.status === 'preparing' || selectedOrder.status === 'on_the_way') && (
                      <button
                        onClick={() => handleStatusChange(selectedOrder.id, 'delivered')}
                        disabled={updatingStatus === selectedOrder.id}
                        className="flex items-center gap-1 px-3 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium disabled:opacity-50"
                      >
                        {updatingStatus === selectedOrder.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                        Entregue
                      </button>
                    )}
                    <button
                      onClick={() => handleStatusChange(selectedOrder.id, 'cancelled')}
                      disabled={updatingStatus === selectedOrder.id}
                      className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium disabled:opacity-50"
                    >
                      {updatingStatus === selectedOrder.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
