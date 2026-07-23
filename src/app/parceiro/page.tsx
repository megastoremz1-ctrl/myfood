'use client';

import { useState, useEffect } from 'react';
import {
  Package, Clock, CheckCircle, XCircle, DollarSign, Star, Phone, MapPin, Timer,
  ChevronDown, AlertCircle, Printer, RefreshCw, Bell, Eye
} from 'lucide-react';
import { useStore, PartnerOrder } from '@/store/useStore';

export default function PartnerOrdersPage() {
  const { partnerOrders, updatePartnerOrderStatus } = useStore();
  const [activeTab, setActiveTab] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [detailOrder, setDetailOrder] = useState<PartnerOrder | null>(null);
  const [prepTimes, setPrepTimes] = useState<Record<string, number>>({});
  const [sound, setSound] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [now, setNow] = useState(Date.now());

  // Simulated live counter
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const filteredOrders = activeTab === 'all'
    ? partnerOrders
    : partnerOrders.filter((o) => o.status === activeTab);

  const newCount = partnerOrders.filter((o) => o.status === 'new').length;
  const preparingCount = partnerOrders.filter((o) => o.status === 'preparing').length;
  const readyCount = partnerOrders.filter((o) => o.status === 'ready').length;
  const pickedUpCount = partnerOrders.filter((o) => o.status === 'picked_up').length;
  const deliveredCount = partnerOrders.filter((o) => o.status === 'delivered').length;
  const rejectedCount = partnerOrders.filter((o) => o.status === 'rejected').length;

  const todayRevenue = partnerOrders
    .filter(o => o.status !== 'rejected')
    .reduce((sum, o) => sum + o.total, 0);

  const handleAccept = (id: string) => {
    updatePartnerOrderStatus(id, 'accepted');
    setTimeout(() => updatePartnerOrderStatus(id, 'preparing'), 300);
  };

  const handleReject = (id: string) => {
    if (confirm('Tem certeza que deseja rejeitar este pedido?')) {
      updatePartnerOrderStatus(id, 'rejected');
    }
  };

  const handleReady = (id: string) => {
    updatePartnerOrderStatus(id, 'ready');
  };

  const handlePickedUp = (id: string) => {
    updatePartnerOrderStatus(id, 'picked_up');
  };

  const handleDelivered = (id: string) => {
    updatePartnerOrderStatus(id, 'delivered');
  };

  const getPrepTime = (id: string) => prepTimes[id] || 15;
  const setPrepTime = (id: string, time: number) => setPrepTimes(prev => ({ ...prev, [id]: time }));

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Pedidos Hoje', value: partnerOrders.length.toString(), icon: Package, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Receita Hoje', value: `${todayRevenue.toLocaleString()} MT`, icon: DollarSign, color: 'text-secondary-500', bg: 'bg-secondary-50' },
          { label: 'Tempo Medio', value: '22 min', icon: Clock, color: 'text-primary-500', bg: 'bg-primary-50' },
          { label: 'Avaliacao', value: '4.8', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSound(!sound)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${sound ? 'bg-secondary-100 text-secondary-700' : 'bg-gray-100 text-gray-500'}`}
          >
            <Bell className="w-3.5 h-3.5" /> Som {sound ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${autoRefresh ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}
          >
            <RefreshCw className="w-3.5 h-3.5" /> Auto
          </button>
        </div>
        {newCount > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            {newCount} novo{newCount > 1 ? 's' : ''}!
          </span>
        )}
      </div>

      {/* Orders */}
      <div className="card">
        <div className="p-4 border-b border-gray-100">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'all', label: 'Todos', count: partnerOrders.length },
              { id: 'new', label: 'Novos', count: newCount },
              { id: 'preparing', label: 'Preparando', count: preparingCount },
              { id: 'ready', label: 'Prontos', count: readyCount },
              { id: 'picked_up', label: 'Recolhidos', count: pickedUpCount },
              { id: 'delivered', label: 'Entregues', count: deliveredCount },
              { id: 'rejected', label: 'Rejeitados', count: rejectedCount },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === tab.id ? 'bg-secondary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white/20' : 'bg-gray-200'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Nenhum pedido neste filtro</p>
            <p className="text-gray-400 text-xs mt-1">Os pedidos novos aparecem aqui automaticamente</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredOrders.map((order) => (
              <div key={order.id} className={`p-4 transition-colors ${order.status === 'new' ? 'bg-blue-50/50 border-l-4 border-l-blue-400' : 'hover:bg-gray-50'}`}>
                <button onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)} className="w-full text-left">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 text-sm">{order.id}</span>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="text-sm text-gray-700 mt-0.5">{order.customer}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{order.items}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <p className="font-bold text-gray-900 text-sm">{order.total} MT</p>
                      <p className="text-xs text-gray-400">{order.time} atras</p>
                      <ChevronDown className={`w-4 h-4 text-gray-400 ml-auto mt-1 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                </button>

                {expandedOrder === order.id && (
                  <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span>{order.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span className="truncate">{order.address}</span>
                      </div>
                    </div>
                    {order.prepTime && (
                      <div className="flex items-center gap-2 text-xs text-gray-600 bg-yellow-50 p-2 rounded-lg">
                        <Timer className="w-3.5 h-3.5 text-yellow-500" />
                        <span>Preparo estimado: {order.prepTime} min</span>
                      </div>
                    )}
                    <div className="flex gap-2 pt-1">
                      <button onClick={() => setDetailOrder(order)} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-lg text-xs text-gray-600 hover:bg-gray-200">
                        <Eye className="w-3.5 h-3.5" /> Detalhes
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-lg text-xs text-gray-600 hover:bg-gray-200">
                        <Printer className="w-3.5 h-3.5" /> Imprimir
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                {order.status === 'new' && (
                  <div className="mt-3 space-y-3">
                    <div className="flex items-center gap-2">
                      <Timer className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-600">Preparo:</span>
                      <div className="flex gap-1">
                        {[10, 15, 20, 25, 30, 45].map(t => (
                          <button
                            key={t}
                            onClick={() => setPrepTime(order.id, t)}
                            className={`px-2 py-1 rounded text-[10px] font-medium ${getPrepTime(order.id) === t ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                          >
                            {t}m
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleAccept(order.id)} className="flex-1 bg-secondary-500 text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-secondary-600 transition-colors flex items-center justify-center gap-1.5">
                        <CheckCircle className="w-4 h-4" /> Aceitar ({getPrepTime(order.id)}min)
                      </button>
                      <button onClick={() => handleReject(order.id)} className="bg-red-50 text-red-500 text-xs font-semibold py-2.5 px-4 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-1.5">
                        <XCircle className="w-4 h-4" /> Rejeitar
                      </button>
                    </div>
                  </div>
                )}
                {order.status === 'preparing' && (
                  <button onClick={() => handleReady(order.id)} className="w-full mt-3 bg-primary-500 text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-primary-600 transition-colors flex items-center justify-center gap-1.5">
                    <CheckCircle className="w-4 h-4" /> Pronto para recolha
                  </button>
                )}
                {order.status === 'ready' && (
                  <button onClick={() => handlePickedUp(order.id)} className="w-full mt-3 bg-blue-500 text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-1.5">
                    <Package className="w-4 h-4" /> Confirmar recolha
                  </button>
                )}
                {order.status === 'picked_up' && (
                  <button onClick={() => handleDelivered(order.id)} className="w-full mt-3 bg-secondary-500 text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-secondary-600 transition-colors flex items-center justify-center gap-1.5">
                    <CheckCircle className="w-4 h-4" /> Marcar como entregue
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {detailOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDetailOrder(null)} />
          <div className="relative bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-gray-900">Pedido {detailOrder.id}</h3>
              <button onClick={() => setDetailOrder(null)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <XCircle className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Cliente</span>
                  <span className="font-medium text-gray-900">{detailOrder.customer}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Telefone</span>
                  <span className="font-medium text-gray-900">{detailOrder.phone}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Endereco</span>
                  <span className="font-medium text-gray-900 text-right max-w-[200px]">{detailOrder.address}</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-2">Itens do pedido</p>
                <p className="text-sm text-gray-900">{detailOrder.items}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-900">{detailOrder.total} MT</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Comissao MyFood (15%)</span>
                  <span className="text-red-500">-{Math.round(detailOrder.total * 0.15)} MT</span>
                </div>
                <div className="flex justify-between text-sm font-bold border-t border-gray-200 pt-2">
                  <span className="text-gray-900">Recebe</span>
                  <span className="text-secondary-600">{Math.round(detailOrder.total * 0.85)} MT</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Estado</span>
                <StatusBadge status={detailOrder.status} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Recebido ha</span>
                <span className="text-sm text-gray-900">{detailOrder.time}</span>
              </div>
            </div>
            <button onClick={() => setDetailOrder(null)} className="w-full mt-6 bg-gray-100 text-gray-700 font-medium text-sm py-2.5 rounded-xl hover:bg-gray-200">
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    accepted: 'bg-green-100 text-green-700',
    preparing: 'bg-yellow-100 text-yellow-700',
    ready: 'bg-secondary-100 text-secondary-700',
    picked_up: 'bg-purple-100 text-purple-700',
    delivered: 'bg-gray-100 text-gray-600',
    rejected: 'bg-red-100 text-red-700',
  };
  const labels: Record<string, string> = {
    new: 'Novo',
    accepted: 'Aceite',
    preparing: 'Preparando',
    ready: 'Pronto',
    picked_up: 'Recolhido',
    delivered: 'Entregue',
    rejected: 'Rejeitado',
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
      {labels[status] || status}
    </span>
  );
}
