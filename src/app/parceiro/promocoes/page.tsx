'use client';

import { useState } from 'react';
import { Tag, Plus, Calendar, Percent, Trash2 } from 'lucide-react';

const initialPromos = [
  { id: '1', name: '30% OFF Pizzas', type: 'percentage', value: 30, active: true, validUntil: '2026-07-30', uses: 45 },
  { id: '2', name: 'Entrega Gratis', type: 'free_delivery', value: 0, active: true, validUntil: '2026-08-15', uses: 123 },
  { id: '3', name: '50 MT Desconto', type: 'fixed', value: 50, active: false, validUntil: '2026-07-20', uses: 89 },
];

export default function PartnerPromosPage() {
  const [promos, setPromos] = useState(initialPromos);

  const toggleActive = (id: string) => {
    setPromos(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Promocoes</h2>
          <p className="text-sm text-gray-500">{promos.filter(p => p.active).length} promocoes ativas</p>
        </div>
        <button className="btn-primary text-sm py-2.5 px-4 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nova promocao
        </button>
      </div>

      <div className="space-y-3">
        {promos.map((promo) => (
          <div key={promo.id} className={`card p-4 ${!promo.active ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${promo.active ? 'bg-primary-50' : 'bg-gray-100'}`}>
                  {promo.type === 'percentage' ? <Percent className="w-5 h-5 text-primary-500" /> : <Tag className="w-5 h-5 text-primary-500" />}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{promo.name}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Ate {promo.validUntil}
                    </span>
                    <span>{promo.uses} usos</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleActive(promo.id)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${promo.active ? 'bg-secondary-500' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${promo.active ? 'left-5' : 'left-0.5'}`} />
                </button>
                <button className="w-7 h-7 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
