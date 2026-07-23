'use client';

import { Search, Star, Store } from 'lucide-react';
import { restaurants } from '@/data/mock';

export default function AdminRestaurantsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Restaurantes</h2>
          <p className="text-sm text-gray-500">{restaurants.length} restaurantes parceiros</p>
        </div>
      </div>

      <div className="card p-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Pesquisar restaurantes..." className="input-field pl-10 text-sm" />
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Restaurante</th>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Rating</th>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 hidden sm:table-cell">Reviews</th>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 hidden sm:table-cell">Taxa</th>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {restaurants.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={r.logo} alt={r.name} className="w-8 h-8 rounded-lg object-cover" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{r.name}</p>
                      <p className="text-xs text-gray-500">{r.distance}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-semibold">{r.rating}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-gray-600 hidden sm:table-cell">{r.reviews}</td>
                <td className="px-4 py-3 text-xs text-gray-600 hidden sm:table-cell">{r.deliveryFee} MT</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    r.isOpen ? 'bg-secondary-100 text-secondary-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {r.isOpen ? 'Aberto' : 'Fechado'}
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
