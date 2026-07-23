'use client';

import { MapPin, Users, Store } from 'lucide-react';

const cities = [
  { name: 'Maputo', bairros: ['Polana', 'Sommerschield', 'Alto Mae', 'Malhangalene', 'Costa do Sol', 'Matola'], restaurants: 89, drivers: 45, orders: 12400 },
  { name: 'Matola', bairros: ['Machava', 'Fomento', 'Matola Gare', 'Km 15'], restaurants: 34, drivers: 22, orders: 4200 },
  { name: 'Beira', bairros: ['Ponta Gea', 'Macurungo', 'Manga', 'Chaimite'], restaurants: 22, drivers: 15, orders: 2800 },
  { name: 'Nampula', bairros: ['Centro', 'Muhala', 'Namicopo'], restaurants: 11, drivers: 7, orders: 980 },
];

export default function AdminCitiesPage() {
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-6">Cidades e Bairros</h2>

      <div className="space-y-4">
        {cities.map((city) => (
          <div key={city.name} className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{city.name}</h3>
                  <p className="text-xs text-gray-500">{city.bairros.length} bairros ativos</p>
                </div>
              </div>
              <div className="flex gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Store className="w-3 h-3" />{city.restaurants}</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" />{city.drivers}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {city.bairros.map((b) => (
                <span key={b} className="px-2.5 py-1 bg-gray-100 rounded-lg text-xs text-gray-600">{b}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
