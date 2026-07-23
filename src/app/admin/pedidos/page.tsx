'use client';

import { useState } from 'react';
import {
  Package, Search, Filter, Eye, X, Clock, MapPin, CreditCard,
  Truck, User, Store, DollarSign, Calendar, AlertTriangle, CheckCircle
} from 'lucide-react';

type OrderStatus = 'confirmed' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';

interface Order {
  id: string;
  customer: string;
  restaurant: string;
  driver: string | null;
  items: string;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  createdAt: string;
  deliveryAddress: string;
}

const initialOrders: Order[] = [
  {
    id: 'PED-001',
    customer: 'Carlos Silva',
    restaurant: 'Pizzaria Bella',
    driver: 'João Santos',
    items: '1x Pizza Margherita, 1x Refrigerante',
    total: 52.90,
    status: 'delivered',
    paymentMethod: 'Cartão de Crédito',
    createdAt: '08:30',
    deliveryAddress: 'Rua das Flores, 123 - Centro'
  },
  {
    id: 'PED-002',
    customer: 'Ana Oliveira',
    restaurant: 'Sushi House',
    driver: 'Pedro Lima',
    items: '2x Combo Sushi, 1x Missoshiru',
    total: 89.90,
    status: 'on_the_way',
    paymentMethod: 'PIX',
    createdAt: '09:15',
    deliveryAddress: 'Av. Brasil, 456 - Jardim América'
  },

  {
    id: 'PED-003',
    customer: 'Roberto Mendes',
    restaurant: 'Burger King Express',
    driver: null,
    items: '2x Whopper, 1x Batata Grande, 2x Milk Shake',
    total: 74.50,
    status: 'confirmed',
    paymentMethod: 'Cartão de Débito',
    createdAt: '09:45',
    deliveryAddress: 'Rua Amazonas, 789 - Vila Nova'
  },
  {
    id: 'PED-004',
    customer: 'Fernanda Costa',
    restaurant: 'Comida Mineira da Vovó',
    driver: 'Lucas Ferreira',
    items: '1x Feijão Tropeiro, 1x Frango com Quiabo, 2x Suco Natural',
    total: 62.00,
    status: 'preparing',
    paymentMethod: 'Dinheiro',
    createdAt: '10:00',
    deliveryAddress: 'Rua Minas Gerais, 321 - Savassi'
  },
  {
    id: 'PED-005',
    customer: 'Marcos Pereira',
    restaurant: 'Açaí Premium',
    driver: 'João Santos',
    items: '1x Açaí 700ml com Granola, 1x Açaí 500ml com Morango',
    total: 38.00,
    status: 'delivered',
    paymentMethod: 'PIX',
    createdAt: '10:30',
    deliveryAddress: 'Av. Contorno, 1500 - Funcionários'
  },
  {
    id: 'PED-006',
    customer: 'Juliana Almeida',
    restaurant: 'Pizzaria Bella',
    driver: null,
    items: '1x Pizza Calabresa Grande, 1x Guaraná 2L',
    total: 59.90,
    status: 'confirmed',
    paymentMethod: 'Cartão de Crédito',
    createdAt: '11:00',
    deliveryAddress: 'Rua Paraná, 88 - Lourdes'
  },

  {
    id: 'PED-007',
    customer: 'Paulo Ribeiro',
    restaurant: 'Churrascaria Gaúcha',
    driver: 'Maria Souza',
    items: '1x Picanha 400g, 1x Arroz, 1x Farofa, 1x Cerveja',
    total: 95.00,
    status: 'on_the_way',
    paymentMethod: 'Cartão de Crédito',
    createdAt: '11:30',
    deliveryAddress: 'Rua Espírito Santo, 200 - Centro'
  },
  {
    id: 'PED-008',
    customer: 'Tatiana Gomes',
    restaurant: 'Sushi House',
    driver: null,
    items: '1x Temaki Salmão, 1x Hot Roll, 1x Chá Gelado',
    total: 67.80,
    status: 'preparing',
    paymentMethod: 'PIX',
    createdAt: '12:00',
    deliveryAddress: 'Av. Afonso Pena, 3000 - Mangabeiras'
  },
  {
    id: 'PED-009',
    customer: 'Diego Martins',
    restaurant: 'Burger King Express',
    driver: 'Pedro Lima',
    items: '3x Big King, 3x Batata Média, 3x Refrigerante',
    total: 112.50,
    status: 'delivered',
    paymentMethod: 'Cartão de Débito',
    createdAt: '12:30',
    deliveryAddress: 'Rua Rio de Janeiro, 750 - Centro'
  },
  {
    id: 'PED-010',
    customer: 'Camila Rocha',
    restaurant: 'Comida Mineira da Vovó',
    driver: null,
    items: '1x Tutu de Feijão, 1x Lombo Assado, 1x Suco de Laranja',
    total: 45.00,
    status: 'cancelled',
    paymentMethod: 'Dinheiro',
    createdAt: '13:00',
    deliveryAddress: 'Rua Curitiba, 500 - Barro Preto'
  },

  {
    id: 'PED-011',
    customer: 'Rafaela Nunes',
    restaurant: 'Açaí Premium',
    driver: 'Lucas Ferreira',
    items: '2x Açaí 1L Completo, 1x Vitamina de Banana',
    total: 56.00,
    status: 'on_the_way',
    paymentMethod: 'PIX',
    createdAt: '13:30',
    deliveryAddress: 'Av. do Contorno, 800 - Santa Efigênia'
  },
  {
    id: 'PED-012',
    customer: 'Gustavo Lopes',
    restaurant: 'Churrascaria Gaúcha',
    driver: null,
    items: '1x Costela no Bafo, 1x Mandioca Frita, 2x Chopp',
    total: 108.00,
    status: 'preparing',
    paymentMethod: 'Cartão de Crédito',
    createdAt: '14:00',
    deliveryAddress: 'Rua Sergipe, 150 - Funcionários'
  },
  {
    id: 'PED-013',
    customer: 'Beatriz Souza',
    restaurant: 'Pizzaria Bella',
    driver: 'Maria Souza',
    items: '1x Pizza Quatro Queijos, 1x Calzone, 1x Suco',
    total: 78.90,
    status: 'delivered',
    paymentMethod: 'Cartão de Crédito',
    createdAt: '14:30',
    deliveryAddress: 'Rua Goiás, 400 - Serra'
  },
  {
    id: 'PED-014',
    customer: 'Thiago Araújo',
    restaurant: 'Sushi House',
    driver: null,
    items: '1x Combo Premium 30 peças, 1x Saquê',
    total: 132.00,
    status: 'cancelled',
    paymentMethod: 'PIX',
    createdAt: '15:00',
    deliveryAddress: 'Av. Raja Gabaglia, 1200 - Luxemburgo'
  },
];


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

type DateFilter = 'today' | 'week' | 'month';
type StatusFilter = 'all' | OrderStatus;

export default function AdminPedidosPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('today');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelInput, setShowCancelInput] = useState(false);


  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.restaurant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalToday = orders.length;
  const revenueToday = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);
  const averageOrder = revenueToday / (totalToday - orders.filter((o) => o.status === 'cancelled').length) || 0;
  const cancelledCount = orders.filter((o) => o.status === 'cancelled').length;

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handleCancelOrder = (orderId: string) => {
    if (!cancelReason.trim()) {
      alert('Por favor, informe o motivo do cancelamento.');
      return;
    }
    if (confirm(`Cancelar pedido ${orderId}? Motivo: ${cancelReason}`)) {
      handleStatusChange(orderId, 'cancelled');
      setCancelReason('');
      setShowCancelInput(false);
    }
  };

  const openModal = (order: Order) => {
    setSelectedOrder(order);
    setShowModal(true);
    setShowCancelInput(false);
    setCancelReason('');
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
    setShowCancelInput(false);
    setCancelReason('');
  };


  const statusTabs: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: 'Todos' },
    { key: 'confirmed', label: 'Confirmados' },
    { key: 'preparing', label: 'Preparando' },
    { key: 'on_the_way', label: 'A Caminho' },
    { key: 'delivered', label: 'Entregues' },
    { key: 'cancelled', label: 'Cancelados' },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Package className="w-7 h-7 text-orange-600" />
          <h1 className="text-2xl font-bold text-gray-800">Gestão de Pedidos</h1>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as DateFilter)}
            className="input-field text-sm py-1 px-3"
          >
            <option value="today">Hoje</option>
            <option value="week">Esta Semana</option>
            <option value="month">Este Mês</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-gray-500">Total Hoje</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{totalToday}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-xs text-gray-500">Receita Hoje</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">R$ {revenueToday.toFixed(2)}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-purple-600" />
            <span className="text-xs text-gray-500">Ticket Médio</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">R$ {averageOrder.toFixed(2)}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-red-600" />
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
              placeholder="Buscar por ID, cliente ou restaurante..."
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
                <th className="text-left p-3 font-medium text-gray-600">ID</th>
                <th className="text-left p-3 font-medium text-gray-600">Cliente</th>
                <th className="text-left p-3 font-medium text-gray-600 hidden md:table-cell">Restaurante</th>
                <th className="text-left p-3 font-medium text-gray-600 hidden lg:table-cell">Motorista</th>
                <th className="text-left p-3 font-medium text-gray-600 hidden xl:table-cell">Itens</th>
                <th className="text-left p-3 font-medium text-gray-600">Total</th>
                <th className="text-left p-3 font-medium text-gray-600">Status</th>
                <th className="text-left p-3 font-medium text-gray-600 hidden md:table-cell">Hora</th>
                <th className="text-left p-3 font-medium text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-mono text-xs font-medium">{order.id}</td>
                  <td className="p-3">{order.customer}</td>
                  <td className="p-3 hidden md:table-cell">{order.restaurant}</td>
                  <td className="p-3 hidden lg:table-cell">
                    {order.driver || <span className="text-gray-400 italic">Sem motorista</span>}
                  </td>
                  <td className="p-3 hidden xl:table-cell max-w-[200px] truncate">{order.items}</td>
                  <td className="p-3 font-medium">R$ {order.total.toFixed(2)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </td>
                  <td className="p-3 hidden md:table-cell text-gray-500">{order.createdAt}</td>
                  <td className="p-3">
                    <button
                      onClick={() => openModal(order)}
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
            <p>Nenhum pedido encontrado.</p>
          </div>
        )}
      </div>


      {/* Detail Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white rounded-t-xl">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg font-bold text-gray-800">Pedido {selectedOrder.id}</h2>
              </div>
              <button
                onClick={closeModal}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-4">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${statusColors[selectedOrder.status]}`}>
                  {statusLabels[selectedOrder.status]}
                </span>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {selectedOrder.createdAt}
                </span>
              </div>

              {/* Customer Info */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Informações do Cliente</h3>
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{selectedOrder.customer}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span className="text-sm">{selectedOrder.deliveryAddress}</span>
                  </div>
                </div>
              </div>

              {/* Restaurant & Driver */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Restaurante & Entrega</h3>
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{selectedOrder.restaurant}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{selectedOrder.driver || 'Nenhum motorista atribuído'}</span>
                  </div>
                </div>
              </div>


              {/* Items */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Itens do Pedido</h3>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm">{selectedOrder.items}</p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Pagamento</h3>
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{selectedOrder.paymentMethod}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-bold">R$ {selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Timeline</h3>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <span className="text-xs text-gray-500">{selectedOrder.createdAt}</span>
                      <span className="text-sm">Pedido confirmado</span>
                    </div>
                    {(selectedOrder.status === 'preparing' || selectedOrder.status === 'on_the_way' || selectedOrder.status === 'delivered') && (
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <span className="text-xs text-gray-500">--:--</span>
                        <span className="text-sm">Em preparação</span>
                      </div>
                    )}
                    {(selectedOrder.status === 'on_the_way' || selectedOrder.status === 'delivered') && (
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-xs text-gray-500">--:--</span>
                        <span className="text-sm">Saiu para entrega</span>
                      </div>
                    )}
                    {selectedOrder.status === 'delivered' && (
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-xs text-gray-500">--:--</span>
                        <span className="text-sm">Entregue</span>
                      </div>
                    )}
                    {selectedOrder.status === 'cancelled' && (
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <span className="text-xs text-gray-500">--:--</span>
                        <span className="text-sm">Cancelado</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>


              {/* Status Change */}
              {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'delivered' && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Alterar Status</h3>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)}
                    className="input-field w-full"
                  >
                    <option value="confirmed">Confirmado</option>
                    <option value="preparing">Preparando</option>
                    <option value="on_the_way">A Caminho</option>
                    <option value="delivered">Entregue</option>
                  </select>
                </div>
              )}

              {/* Cancel Order */}
              {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'delivered' && (
                <div className="space-y-2 border-t pt-4">
                  {!showCancelInput ? (
                    <button
                      onClick={() => setShowCancelInput(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      Cancelar Pedido
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Motivo do cancelamento:</label>
                      <textarea
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        placeholder="Informe o motivo do cancelamento..."
                        className="input-field w-full h-20 resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCancelOrder(selectedOrder.id)}
                          className="btn-primary flex-1 bg-red-600 hover:bg-red-700"
                        >
                          Confirmar Cancelamento
                        </button>
                        <button
                          onClick={() => { setShowCancelInput(false); setCancelReason(''); }}
                          className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Voltar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
