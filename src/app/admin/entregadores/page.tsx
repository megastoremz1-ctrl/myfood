'use client';

import { Search, Star } from 'lucide-react';

const drivers = [
  { id: 1, name: 'Carlos Muthemba', phone: '+258 84 777 8888', vehicle: 'Honda PCX', rating: 4.9, deliveries: 342, earnings: '28.500 MT', status: 'online' },
  { id: 2, name: 'Pedro Augusto', phone: '+258 84 666 7777', vehicle: 'Yamaha NMAX', rating: 4.7, deliveries: 289, earnings: '24.100 MT', status: 'delivering' },
  { id: 3, name: 'Luis Bernardo', phone: '+258 84 555 6666', vehicle: 'Honda Dio', rating: 4.8, deliveries: 456, earnings: '38.200 MT', status: 'online' },
  { id: 4, name: 'Rita Fernandes', phone: '+258 84 444 5555', vehicle: 'Suzuki Burgman', rating: 4.6, deliveries: 178, earnings: '14.800 MT', status: 'offline' },
  { id: 5, name: 'Miguel Costa', phone: '+258 84 333 4444', vehicle: 'Honda PCX', rating: 4.9, deliveries: 512, earnings: '42.600 MT', status: 'online' },
  { id: 6, name: 'Ana Mabote', phone: '+258 84 222 3333', vehicle: 'Bicicleta', rating: 4.5, deliveries: 95, earnings: '7.200 MT', status: 'offline' },
];

export default function AdminDriversPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Entregadores</h2>
          <p className="text-sm text-gray-500">{drivers.length} entregadores ({drivers.filter(d => d.status !== 'offline').length} online)</p>
        </div>
      </div>

      <div className="card p-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Pesquisar entregadores..." className="input-field pl-10 text-sm" />
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Entregador</th>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 hidden sm:table-cell">Veiculo</th>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Rating</th>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 hidden sm:table-cell">Entregas</th>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {drivers.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-900">{d.name}</p>
                  <p className="text-xs text-gray-500">{d.phone}</p>
                </td>
                <td className="px-4 py-3 text-xs text-gray-600 hidden sm:table-cell">{d.vehicle}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-semibold">{d.rating}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-gray-600 hidden sm:table-cell">{d.deliveries}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    d.status === 'online' ? 'bg-secondary-100 text-secondary-700' :
                    d.status === 'delivering' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {d.status === 'online' ? 'Online' : d.status === 'delivering' ? 'Entregando' : 'Offline'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
