'use client';

import { Search, Filter } from 'lucide-react';

const orders = [
  { id: 'ORD-2341', customer: 'Antonio M.', restaurant: "Mundo's", driver: 'Carlos M.', total: '610 MT', status: 'Entregue', time: '14:32' },
  { id: 'ORD-2340', customer: 'Maria S.', restaurant: 'Pizza House', driver: 'Pedro A.', total: '480 MT', status: 'A caminho', time: '14:28' },
  { id: 'ORD-2339', customer: 'Joao P.', restaurant: 'Sushi Master', driver: '-', total: '890 MT', status: 'Preparando', time: '14:25' },
  { id: 'ORD-2338', customer: 'Ana L.', restaurant: 'Cafe Central', driver: '-', total: '220 MT', status: 'Confirmado', time: '14:20' },
  { id: 'ORD-2337', customer: 'Carlos F.', restaurant: 'Frango PP', driver: 'Luis B.', total: '430 MT', status: 'Entregue', time: '14:15' },
  { id: 'ORD-2336', customer: 'Sara M.', restaurant: 'Doce Tentacao', driver: 'Rita F.', total: '350 MT', status: 'Entregue', time: '14:10' },
  { id: 'ORD-2335', customer: 'Luis A.', restaurant: "Mundo's", driver: 'Carlos M.', total: '720 MT', status: 'Entregue', time: '13:55' },
  { id: 'ORD-2334', customer: 'Rita C.', restaurant: 'Frango PP', driver: 'Pedro A.', total: '380 MT', status: 'Entregue', time: '13:40' },
];

export default function AdminOrdersPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">Pedidos</h2>
        <p className="text-sm text-gray-500">342 pedidos hoje</p>
      </div>

      <div className="card p-4 mb-4 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Pesquisar pedido..." className="input-field pl-10 text-sm" />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 rounded-xl text-sm font-medium text-gray-600">
          <Filter className="w-4 h-4" /> Filtros
        </button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">ID</th>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Cliente</th>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 hidden sm:table-cell">Restaurante</th>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 hidden md:table-cell">Entregador</th>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Total</th>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-xs font-mono text-gray-900">{o.id}</td>
                <td className="px-4 py-3 text-xs text-gray-700">{o.customer}</td>
                <td className="px-4 py-3 text-xs text-gray-500 hidden sm:table-cell">{o.restaurant}</td>
                <td className="px-4 py-3 text-xs text-gray-500 hidden md:table-cell">{o.driver}</td>
                <td className="px-4 py-3 text-xs font-semibold text-gray-900">{o.total}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    o.status === 'Entregue' ? 'bg-secondary-100 text-secondary-700' :
                    o.status === 'A caminho' ? 'bg-blue-100 text-blue-700' :
                    o.status === 'Preparando' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>{o.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
