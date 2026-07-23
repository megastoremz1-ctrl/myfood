'use client';

import { useState } from 'react';
import {
  Search,
  Filter,
  Users,
  UserCheck,
  UserX,
  Eye,
  X,
  Download,
  ArrowUpDown,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  DollarSign,
} from 'lucide-react';

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: string;
  joinDate: string;
  status: 'active' | 'blocked';
  lastOrder: string;
}

const initialClients: Client[] = [
  { id: 1, name: 'Antonio Machel', email: 'antonio@email.com', phone: '+258 84 123 4567', orders: 12, totalSpent: '6.800 MT', joinDate: '2026-01-15', status: 'active', lastOrder: '2026-07-10' },
  { id: 2, name: 'Maria Santos', email: 'maria@email.com', phone: '+258 84 987 6543', orders: 28, totalSpent: '15.200 MT', joinDate: '2025-11-03', status: 'active', lastOrder: '2026-07-12' },
  { id: 3, name: 'Joao Pedro', email: 'joao@email.com', phone: '+258 84 555 1234', orders: 8, totalSpent: '4.100 MT', joinDate: '2026-03-20', status: 'active', lastOrder: '2026-06-28' },
  { id: 4, name: 'Ana Lucia', email: 'ana@email.com', phone: '+258 84 444 5678', orders: 45, totalSpent: '24.500 MT', joinDate: '2025-06-10', status: 'active', lastOrder: '2026-07-14' },
  { id: 5, name: 'Carlos Fernandes', email: 'carlos@email.com', phone: '+258 84 333 9876', orders: 19, totalSpent: '9.800 MT', joinDate: '2026-02-08', status: 'blocked', lastOrder: '2026-05-15' },
  { id: 6, name: 'Sara Machel', email: 'sara@email.com', phone: '+258 84 222 3456', orders: 6, totalSpent: '3.200 MT', joinDate: '2026-07-01', status: 'active', lastOrder: '2026-07-11' },
  { id: 7, name: 'Luis Alberto', email: 'luis@email.com', phone: '+258 84 111 7890', orders: 33, totalSpent: '18.700 MT', joinDate: '2025-08-22', status: 'active', lastOrder: '2026-07-09' },
  { id: 8, name: 'Rita Costa', email: 'rita@email.com', phone: '+258 84 666 5432', orders: 15, totalSpent: '8.400 MT', joinDate: '2025-12-14', status: 'blocked', lastOrder: '2026-04-20' },
  { id: 9, name: 'Fernando Nhaca', email: 'fernando@email.com', phone: '+258 84 777 2345', orders: 22, totalSpent: '11.900 MT', joinDate: '2025-09-05', status: 'active', lastOrder: '2026-07-13' },
  { id: 10, name: 'Beatriz Tembe', email: 'beatriz@email.com', phone: '+258 84 888 6789', orders: 3, totalSpent: '1.500 MT', joinDate: '2026-07-05', status: 'active', lastOrder: '2026-07-08' },
];

function parseSpent(spent: string): number {
  return parseFloat(spent.replace(/[^0-9.]/g, '').replace('.', '')) || 0;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-MZ', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'orders' | 'totalSpent' | 'joinDate'>('name');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Stats
  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'active').length;
  const blockedClients = clients.filter(c => c.status === 'blocked').length;
  const now = new Date();
  const newThisMonth = clients.filter(c => {
    const joinDate = new Date(c.joinDate);
    return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
  }).length;

  // Filtered and sorted clients
  const filteredClients = clients
    .filter(client => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        client.name.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query) ||
        client.phone.includes(query);
      const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'orders':
          return b.orders - a.orders;
        case 'totalSpent':
          return parseSpent(b.totalSpent) - parseSpent(a.totalSpent);
        case 'joinDate':
          return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
        default:
          return 0;
      }
    });

  const handleBlockToggle = (client: Client) => {
    const action = client.status === 'active' ? 'bloquear' : 'desbloquear';
    const confirmed = confirm(`Tem certeza que deseja ${action} o cliente "${client.name}"?`);
    if (confirmed) {
      setClients(prev =>
        prev.map(c =>
          c.id === client.id
            ? { ...c, status: c.status === 'active' ? 'blocked' : 'active' }
            : c
        )
      );
      if (selectedClient && selectedClient.id === client.id) {
        setSelectedClient({
          ...client,
          status: client.status === 'active' ? 'blocked' : 'active',
        });
      }
    }
  };

  const handleExport = () => {
    alert('Exportacao de clientes iniciada! O ficheiro CSV sera enviado para o seu email.');
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Gestao de Clientes</h2>
          <p className="text-sm text-gray-500">{filteredClients.length} de {totalClients} clientes</p>
        </div>
        <button onClick={handleExport} className="btn-primary flex items-center gap-2 text-sm">
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Exportar</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-lg font-bold text-gray-900">{totalClients}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Activos</p>
              <p className="text-lg font-bold text-gray-900">{activeClients}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <UserX className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Bloqueados</p>
              <p className="text-lg font-bold text-gray-900">{blockedClients}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Novos (mes)</p>
              <p className="text-lg font-bold text-gray-900">{newThisMonth}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="card p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar por nome, email ou telefone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10 text-sm w-full"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <Filter className="w-4 h-4" /> Filtros
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-500 mb-1 block">Estado</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'blocked')}
                className="input-field text-sm w-full"
              >
                <option value="all">Todos</option>
                <option value="active">Activos</option>
                <option value="blocked">Bloqueados</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-500 mb-1 block">Ordenar por</label>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'orders' | 'totalSpent' | 'joinDate')}
                  className="input-field text-sm w-full"
                >
                  <option value="name">Nome</option>
                  <option value="orders">Pedidos</option>
                  <option value="totalSpent">Gasto Total</option>
                  <option value="joinDate">Data de Registo</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Table */}
      <div className="card overflow-x-auto hidden md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Cliente</th>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Telefone</th>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Pedidos</th>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Gasto Total</th>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Registo</th>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Estado</th>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Accoes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredClients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">
                        {client.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{client.name}</p>
                      <p className="text-xs text-gray-500">{client.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{client.phone}</td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">{client.orders}</td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">{client.totalSpent}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{formatDate(client.joinDate)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      client.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {client.status === 'active' ? 'Activo' : 'Bloqueado'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedClient(client)}
                      className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Ver detalhes"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleBlockToggle(client)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        client.status === 'active'
                          ? 'hover:bg-red-50 text-gray-400 hover:text-red-600'
                          : 'hover:bg-green-50 text-gray-400 hover:text-green-600'
                      }`}
                      title={client.status === 'active' ? 'Bloquear' : 'Desbloquear'}
                    >
                      {client.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Nenhum cliente encontrado</p>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filteredClients.map((client) => (
          <div key={client.id} className="card p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">
                    {client.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{client.name}</p>
                  <p className="text-xs text-gray-500">{client.email}</p>
                </div>
              </div>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  client.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {client.status === 'active' ? 'Activo' : 'Bloqueado'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div className="flex items-center gap-1.5 text-gray-500">
                <Phone className="w-3.5 h-3.5" />
                <span>{client.phone}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-500">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{client.orders} pedidos</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-500">
                <DollarSign className="w-3.5 h-3.5" />
                <span>{client.totalSpent}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-500">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(client.joinDate)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
              <button
                onClick={() => setSelectedClient(client)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" /> Ver Detalhes
              </button>
              <button
                onClick={() => handleBlockToggle(client)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                  client.status === 'active'
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                }`}
              >
                {client.status === 'active' ? (
                  <><UserX className="w-3.5 h-3.5" /> Bloquear</>
                ) : (
                  <><UserCheck className="w-3.5 h-3.5" /> Desbloquear</>
                )}
              </button>
            </div>
          </div>
        ))}
        {filteredClients.length === 0 && (
          <div className="card p-8 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Nenhum cliente encontrado</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedClient(null)}>
          <div
            className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Detalhes do Cliente</h3>
              <button
                onClick={() => setSelectedClient(null)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Client Info */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-600">
                    {selectedClient.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900">{selectedClient.name}</h4>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                      selectedClient.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {selectedClient.status === 'active' ? 'Activo' : 'Bloqueado'}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{selectedClient.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{selectedClient.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">Membro desde {formatDate(selectedClient.joinDate)}</span>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h5 className="text-sm font-semibold text-gray-900 mb-3">Resumo de Pedidos</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <ShoppingBag className="w-4 h-4 text-blue-500" />
                      <span className="text-xs text-gray-500">Total de Pedidos</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{selectedClient.orders}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="text-xs text-gray-500">Total Gasto</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{selectedClient.totalSpent}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      <span className="text-xs text-gray-500">Ultimo Pedido</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{formatDate(selectedClient.lastOrder)}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-4 h-4 text-orange-500" />
                      <span className="text-xs text-gray-500">Media/Pedido</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedClient.orders > 0
                        ? `${Math.round(parseSpent(selectedClient.totalSpent) / selectedClient.orders).toLocaleString('pt-MZ')} MT`
                        : '0 MT'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleBlockToggle(selectedClient)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    selectedClient.status === 'active'
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {selectedClient.status === 'active' ? (
                    <><UserX className="w-4 h-4" /> Bloquear Cliente</>
                  ) : (
                    <><UserCheck className="w-4 h-4" /> Desbloquear Cliente</>
                  )}
                </button>
                <button
                  onClick={() => setSelectedClient(null)}
                  className="px-6 py-3 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
