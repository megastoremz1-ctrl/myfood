'use client';

import { useState } from 'react';
import {
  Package, Clock, CheckCircle, XCircle, DollarSign, Star, Phone, MapPin, Timer, ChevronDown
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { PartnerOrder } from '@/store/useStore';

const stats = [
  { label: 'Pedidos Hoje', value: '23', icon: Package, color: 'text-blue-500', bg: 'bg-blue-50' },
  { label: 'Receita Hoje', value: '12.450 MT', icon: DollarSign, color: 'text-secondary-500', bg: 'bg-secondary-50' },
  { label: 'Tempo Medio', value: '22 min', icon: Clock, color: 'text-primary-500', bg: 'bg-primary-50' },
  { label: 'Avaliacao', value: '4.8', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50' },
];

export default function PartnerOrdersPage() {
  const { partnerOrders, updatePartnerOrderStatus } = useStore();
  const [activeTab, setActiveTab] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [prepTime, setPrepTime] = useState(15);

  const filteredOrders = activeTab === 'all'
    ? partnerOrders
    : partnerOrders.filter((o) => o.status === activeTab);

  const handleAccept = (id: string) => {
    updatePartnerOrderStatus(id, 'accepted');
    setTimeout(() => updatePartnerOrderStatus(id, 'preparing'), 500);
  };

  const handleReject = (id: string) => {
    updatePartnerOrderStatus(id, 'rejected');
  };

  const handleReady = (id: string) => {
    updatePartnerOrderStatus(id, 'ready');
  };

  const handlePickedUp = (id: string) => {
    updatePartnerOrderStatus(id, 'picked_up');
  };

  const newCount = partnerOrders.filter((o) => o.status === 'new').length;
  const preparingCount = partnerOrders.filter((o) => o.status === 'preparing').length;

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
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

      {/* Orders */}
      <div className="card">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900">Pedidos</h2>
            {newCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full animate-pulse">
                {newCount} novo{newCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'all', label: 'Todos', count: partnerOrders.length },
              { id: 'new', label: 'Novos', count: newCount },
              { id: 'preparing', label: 'Preparando', count: preparingCount },
              { id: 'ready', label: 'Prontos', count: partnerOrders.filter(o => o.status === 'ready').length },
              { id: 'picked_up', label: 'Recolhidos', count: partnerOrders.filter(o => o.status === 'picked_up').length },
              { id: 'delivered', label: 'Entregues', count: partnerOrders.filter(o => o.status === 'delivered').length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-secondary-500 text-white'
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

        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Nenhum pedido neste filtro</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                expanded={expandedOrder === order.id}
                onToggle={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                onAccept={() => handleAccept(order.id)}
                onReject={() => handleReject(order.id)}
                onReady={() => handleReady(order.id)}
                onPickedUp={() => handlePickedUp(order.id)}
                prepTime={prepTime}
                setPrepTime={setPrepTime}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OrderCard({
  order, expanded, onToggle, onAccept, onReject, onReady, onPickedUp, prepTime, setPrepTime
}: {
  order: PartnerOrder;
  expanded: boolean;
  onToggle: () => void;
  onAccept: () => void;
  onReject: () => void;
  onReady: () => void;
  onPickedUp: () => void;
  prepTime: number;
  setPrepTime: (t: number) => void;
}) {
  return (
    <div className={`p-4 transition-colors ${order.status === 'new' ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}>
      <button onClick={onToggle} className="w-full text-left">
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 text-sm">{order.id}</span>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-sm text-gray-700 mt-0.5">{order.customer}</p>
            <p className="text-xs text-gray-500 mt-0.5">{order.items}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-bold text-gray-900 text-sm">{order.total} MT</p>
            <p className="text-xs text-gray-400">{order.time} atras</p>
            <ChevronDown className={`w-4 h-4 text-gray-400 ml-auto mt-1 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </button>

      {/* Expanded Details */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Phone className="w-3.5 h-3.5" />
            <span>{order.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <MapPin className="w-3.5 h-3.5" />
            <span>{order.address}</span>
          </div>
          {order.prepTime && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Timer className="w-3.5 h-3.5" />
              <span>Tempo de preparo: {order.prepTime} min</span>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      {order.status === 'new' && (
        <div className="mt-3 space-y-3">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-600">Tempo de preparo:</span>
            <select
              value={prepTime}
              onChange={(e) => setPrepTime(Number(e.target.value))}
              className="text-xs border border-gray-200 rounded-lg px-2 py-1"
            >
              <option value={10}>10 min</option>
              <option value={15}>15 min</option>
              <option value={20}>20 min</option>
              <option value={25}>25 min</option>
              <option value={30}>30 min</option>
              <option value={45}>45 min</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onAccept}
              className="flex-1 bg-secondary-500 text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-secondary-600 transition-colors flex items-center justify-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" /> Aceitar pedido
            </button>
            <button
              onClick={onReject}
              className="bg-red-50 text-red-500 text-xs font-semibold py-2.5 px-4 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-1.5"
            >
              <XCircle className="w-4 h-4" /> Rejeitar
            </button>
          </div>
        </div>
      )}
      {order.status === 'preparing' && (
        <button
          onClick={onReady}
          className="w-full mt-3 bg-primary-500 text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-primary-600 transition-colors"
        >
          Marcar como pronto para recolha
        </button>
      )}
      {order.status === 'ready' && (
        <button
          onClick={onPickedUp}
          className="w-full mt-3 bg-blue-500 text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-blue-600 transition-colors"
        >
          Confirmar recolha pelo entregador
        </button>
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
