'use client';

import { Search, Filter, Users } from 'lucide-react';

const clients = [
  { id: 1, name: 'Antonio Machel', email: 'antonio@email.com', phone: '+258 84 123 4567', orders: 12, spent: '6.800 MT', joined: 'Jan 2026' },
  { id: 2, name: 'Maria Santos', email: 'maria@email.com', phone: '+258 84 987 6543', orders: 28, spent: '15.200 MT', joined: 'Nov 2025' },
  { id: 3, name: 'Joao Pedro', email: 'joao@email.com', phone: '+258 84 555 1234', orders: 8, spent: '4.100 MT', joined: 'Mar 2026' },
  { id: 4, name: 'Ana Lucia', email: 'ana@email.com', phone: '+258 84 444 5678', orders: 45, spent: '24.500 MT', joined: 'Jun 2025' },
  { id: 5, name: 'Carlos Fernandes', email: 'carlos@email.com', phone: '+258 84 333 9876', orders: 19, spent: '9.800 MT', joined: 'Fev 2026' },
  { id: 6, name: 'Sara Machel', email: 'sara@email.com', phone: '+258 84 222 3456', orders: 6, spent: '3.200 MT', joined: 'Jul 2026' },
  { id: 7, name: 'Luis Alberto', email: 'luis@email.com', phone: '+258 84 111 7890', orders: 33, spent: '18.700 MT', joined: 'Ago 2025' },
  { id: 8, name: 'Rita Costa', email: 'rita@email.com', phone: '+258 84 666 5432', orders: 15, spent: '8.400 MT', joined: 'Dez 2025' },
];

export default function AdminClientsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Clientes</h2>
          <p className="text-sm text-gray-500">{clients.length} clientes registados</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="card p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Pesquisar clientes..." className="input-field pl-10 text-sm" />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 rounded-xl text-sm font-medium text-gray-600">
          <Filter className="w-4 h-4" /> Filtros
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Cliente</th>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 hidden sm:table-cell">Telefone</th>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Pedidos</th>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Gasto Total</th>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 hidden md:table-cell">Desde</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">{client.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{client.name}</p>
                      <p className="text-xs text-gray-500">{client.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-gray-600 hidden sm:table-cell">{client.phone}</td>
                <td className="px-4 py-3 text-xs font-semibold text-gray-900">{client.orders}</td>
                <td className="px-4 py-3 text-xs font-semibold text-gray-900">{client.spent}</td>
                <td className="px-4 py-3 text-xs text-gray-500 hidden md:table-cell">{client.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
