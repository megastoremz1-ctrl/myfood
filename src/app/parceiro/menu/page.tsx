'use client';

import { useState } from 'react';
import { Plus, Edit3, Trash2, Eye, EyeOff, Search } from 'lucide-react';
import { menuItems } from '@/data/mock';

export default function PartnerMenuPage() {
  const [items, setItems] = useState(menuItems.map(i => ({ ...i, available: true })));
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');

  const categories = ['all', 'Entradas', 'Pratos Principais', 'Bebidas', 'Sobremesas'];

  const filtered = items.filter(i => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'all' || i.category === filterCat;
    return matchSearch && matchCat;
  });

  const toggleAvailability = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, available: !i.available } : i));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Gestao de Menu</h2>
          <p className="text-sm text-gray-500">{items.length} itens no menu</p>
        </div>
        <button className="btn-primary text-sm py-2.5 px-4 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novo item
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar no menu..."
              className="input-field pl-10 text-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap ${
                  filterCat === cat ? 'bg-secondary-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {cat === 'all' ? 'Todos' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items List */}
      <div className="space-y-2">
        {filtered.map((item) => (
          <div key={item.id} className={`card p-4 flex items-center gap-4 ${!item.available ? 'opacity-60' : ''}`}>
            <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
              <p className="text-xs text-gray-500 truncate">{item.description}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm font-bold text-primary-600">{item.price} MT</span>
                <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{item.category}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={() => toggleAvailability(item.id)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  item.available ? 'bg-secondary-50 text-secondary-500 hover:bg-secondary-100' : 'bg-red-50 text-red-500 hover:bg-red-100'
                }`}
                title={item.available ? 'Desativar' : 'Ativar'}
              >
                {item.available ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button className="w-8 h-8 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center hover:bg-blue-100">
                <Edit3 className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
