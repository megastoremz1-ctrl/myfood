'use client';

import { Tag, Plus, Calendar, Users, Percent } from 'lucide-react';

const promos = [
  { id: '1', code: 'BEMVINDO', desc: 'Primeira entrega gratis', discount: '100 MT', uses: 1234, active: true, expires: '2026-12-31' },
  { id: '2', code: 'PIZZA30', desc: '30% off em pizzas', discount: '30%', uses: 567, active: true, expires: '2026-07-30' },
  { id: '3', code: 'MYFOOD50', desc: '50 MT desconto', discount: '200 MT', uses: 89, active: true, expires: '2026-08-15' },
  { id: '4', code: 'VERAO2026', desc: 'Promocao de verao', discount: '15%', uses: 2345, active: false, expires: '2026-03-31' },
];

export default function AdminPromosPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">Promocoes</h2>
        <button className="btn-primary text-sm py-2.5 px-4 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nova
        </button>
      </div>

      <div className="space-y-3">
        {promos.map((p) => (
          <div key={p.id} className={`card p-4 ${!p.active ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                  <Tag className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-sm font-mono">{p.code}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      p.active ? 'bg-secondary-100 text-secondary-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {p.active ? 'Ativa' : 'Expirada'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{p.desc}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Percent className="w-3 h-3" />{p.discount}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{p.uses} usos</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{p.expires}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
