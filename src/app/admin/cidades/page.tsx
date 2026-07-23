'use client';

import { useState } from 'react';
import { MapPin, Plus, Trash2, Edit3, Save, X, ChevronDown, ChevronRight, Navigation, Building, Search } from 'lucide-react';

interface ReferencePoint {
  id: string;
  name: string;
  description: string;
}

interface Bairro {
  id: string;
  name: string;
  referencePoints: ReferencePoint[];
}

interface City {
  id: string;
  name: string;
  bairros: Bairro[];
  active: boolean;
}

const initialCities: City[] = [
  {
    id: 'city-1',
    name: 'Maputo',
    active: true,
    bairros: [
      { id: 'b1', name: 'Polana', referencePoints: [
        { id: 'rp1', name: 'Hotel Polana', description: 'Em frente ao Hotel Polana Serena' },
        { id: 'rp2', name: 'Embaixada dos EUA', description: 'Ao lado da embaixada americana' },
      ]},
      { id: 'b2', name: 'Sommerschield', referencePoints: [
        { id: 'rp3', name: 'Shoprite Sommerschield', description: 'Junto ao supermercado Shoprite' },
      ]},
      { id: 'b3', name: 'Alto Mae', referencePoints: [
        { id: 'rp4', name: 'Mercado Central', description: 'Proximo ao mercado central' },
        { id: 'rp5', name: 'Hospital Central', description: 'Em frente ao HCM' },
      ]},
      { id: 'b4', name: 'Malhangalene', referencePoints: [] },
      { id: 'b5', name: 'Costa do Sol', referencePoints: [
        { id: 'rp6', name: 'Praia da Costa do Sol', description: 'Na avenida principal da praia' },
      ]},
    ],
  },
  {
    id: 'city-2',
    name: 'Matola',
    active: true,
    bairros: [
      { id: 'b6', name: 'Machava', referencePoints: [
        { id: 'rp7', name: 'Estadio da Machava', description: 'Junto ao estadio' },
      ]},
      { id: 'b7', name: 'Fomento', referencePoints: [] },
      { id: 'b8', name: 'Matola Gare', referencePoints: [] },
    ],
  },
  {
    id: 'city-3',
    name: 'Beira',
    active: true,
    bairros: [
      { id: 'b9', name: 'Ponta Gea', referencePoints: [] },
      { id: 'b10', name: 'Macurungo', referencePoints: [] },
    ],
  },
];

export default function AdminCidadesPage() {
  const [cities, setCities] = useState<City[]>(initialCities);
  const [expandedCity, setExpandedCity] = useState<string | null>('city-1');
  const [expandedBairro, setExpandedBairro] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Add city
  const [showAddCity, setShowAddCity] = useState(false);
  const [newCityName, setNewCityName] = useState('');

  // Add bairro
  const [addingBairroTo, setAddingBairroTo] = useState<string | null>(null);
  const [newBairroName, setNewBairroName] = useState('');

  // Add reference point
  const [addingRefTo, setAddingRefTo] = useState<string | null>(null);
  const [newRefName, setNewRefName] = useState('');
  const [newRefDesc, setNewRefDesc] = useState('');

  // Edit
  const [editingCity, setEditingCity] = useState<string | null>(null);
  const [editCityName, setEditCityName] = useState('');
  const [editingBairro, setEditingBairro] = useState<string | null>(null);
  const [editBairroName, setEditBairroName] = useState('');

  const totalBairros = cities.reduce((sum, c) => sum + c.bairros.length, 0);
  const totalRefs = cities.reduce((sum, c) => sum + c.bairros.reduce((s, b) => s + b.referencePoints.length, 0), 0);

  // Filter
  const filteredCities = search
    ? cities.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.bairros.some(b => b.name.toLowerCase().includes(search.toLowerCase()))
      )
    : cities;

  // CRUD handlers
  const handleAddCity = () => {
    if (!newCityName.trim()) return;
    const newCity: City = { id: `city-${Date.now()}`, name: newCityName.trim(), bairros: [], active: true };
    setCities([...cities, newCity]);
    setNewCityName('');
    setShowAddCity(false);
    setExpandedCity(newCity.id);
  };

  const handleDeleteCity = (id: string) => {
    if (confirm('Tem certeza que deseja eliminar esta cidade e todos os seus bairros?')) {
      setCities(cities.filter(c => c.id !== id));
    }
  };

  const handleToggleCity = (id: string) => {
    setCities(cities.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  const handleSaveEditCity = (id: string) => {
    if (!editCityName.trim()) return;
    setCities(cities.map(c => c.id === id ? { ...c, name: editCityName.trim() } : c));
    setEditingCity(null);
  };

  const handleAddBairro = (cityId: string) => {
    if (!newBairroName.trim()) return;
    const newBairro: Bairro = { id: `b-${Date.now()}`, name: newBairroName.trim(), referencePoints: [] };
    setCities(cities.map(c => c.id === cityId ? { ...c, bairros: [...c.bairros, newBairro] } : c));
    setNewBairroName('');
    setAddingBairroTo(null);
  };

  const handleDeleteBairro = (cityId: string, bairroId: string) => {
    if (confirm('Eliminar este bairro e todos os seus pontos de referencia?')) {
      setCities(cities.map(c => c.id === cityId ? { ...c, bairros: c.bairros.filter(b => b.id !== bairroId) } : c));
    }
  };

  const handleSaveEditBairro = (cityId: string, bairroId: string) => {
    if (!editBairroName.trim()) return;
    setCities(cities.map(c => c.id === cityId ? {
      ...c,
      bairros: c.bairros.map(b => b.id === bairroId ? { ...b, name: editBairroName.trim() } : b)
    } : c));
    setEditingBairro(null);
  };

  const handleAddRef = (cityId: string, bairroId: string) => {
    if (!newRefName.trim()) return;
    const newRef: ReferencePoint = { id: `rp-${Date.now()}`, name: newRefName.trim(), description: newRefDesc.trim() };
    setCities(cities.map(c => c.id === cityId ? {
      ...c,
      bairros: c.bairros.map(b => b.id === bairroId ? { ...b, referencePoints: [...b.referencePoints, newRef] } : b)
    } : c));
    setNewRefName('');
    setNewRefDesc('');
    setAddingRefTo(null);
  };

  const handleDeleteRef = (cityId: string, bairroId: string, refId: string) => {
    setCities(cities.map(c => c.id === cityId ? {
      ...c,
      bairros: c.bairros.map(b => b.id === bairroId ? { ...b, referencePoints: b.referencePoints.filter(r => r.id !== refId) } : b)
    } : c));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Cidades, Bairros e Pontos de Referencia</h2>
          <p className="text-sm text-gray-500">{cities.length} cidades, {totalBairros} bairros, {totalRefs} pontos de referencia</p>
        </div>
        <button onClick={() => setShowAddCity(true)} className="btn-primary text-sm py-2.5 px-4 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nova Cidade
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="card p-4 text-center">
          <Building className="w-5 h-5 text-blue-500 mx-auto mb-1" />
          <p className="text-xl font-bold text-gray-900">{cities.length}</p>
          <p className="text-xs text-gray-500">Cidades</p>
        </div>
        <div className="card p-4 text-center">
          <MapPin className="w-5 h-5 text-secondary-500 mx-auto mb-1" />
          <p className="text-xl font-bold text-gray-900">{totalBairros}</p>
          <p className="text-xs text-gray-500">Bairros</p>
        </div>
        <div className="card p-4 text-center">
          <Navigation className="w-5 h-5 text-primary-500 mx-auto mb-1" />
          <p className="text-xl font-bold text-gray-900">{totalRefs}</p>
          <p className="text-xs text-gray-500">Pontos Ref.</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar cidade ou bairro..." className="input-field pl-10 text-sm" />
      </div>

      {/* Add City Form */}
      {showAddCity && (
        <div className="card p-4 mb-4 border-2 border-dashed border-purple-200 bg-purple-50/50">
          <h4 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
            <Building className="w-4 h-4 text-purple-500" /> Adicionar Nova Cidade
          </h4>
          <div className="flex gap-2">
            <input type="text" value={newCityName} onChange={(e) => setNewCityName(e.target.value)} placeholder="Nome da cidade (ex: Nampula)" className="input-field text-sm flex-1" onKeyDown={(e) => e.key === 'Enter' && handleAddCity()} autoFocus />
            <button onClick={handleAddCity} className="btn-primary text-sm px-4 py-2.5 flex items-center gap-1.5">
              <Save className="w-4 h-4" /> Guardar
            </button>
            <button onClick={() => { setShowAddCity(false); setNewCityName(''); }} className="px-3 py-2.5 bg-gray-100 rounded-xl text-sm text-gray-600 hover:bg-gray-200">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Cities List */}
      <div className="space-y-3">
        {filteredCities.map((city) => (
          <div key={city.id} className="card overflow-hidden">
            {/* City Header */}
            <div className="p-4 flex items-center gap-3 bg-gray-50/50">
              <button onClick={() => setExpandedCity(expandedCity === city.id ? null : city.id)} className="flex-shrink-0">
                {expandedCity === city.id ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
              </button>
              <Building className="w-5 h-5 text-blue-500 flex-shrink-0" />

              {editingCity === city.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <input type="text" value={editCityName} onChange={(e) => setEditCityName(e.target.value)} className="input-field text-sm flex-1" onKeyDown={(e) => e.key === 'Enter' && handleSaveEditCity(city.id)} autoFocus />
                  <button onClick={() => handleSaveEditCity(city.id)} className="p-1.5 bg-secondary-50 text-secondary-500 rounded-lg hover:bg-secondary-100"><Save className="w-4 h-4" /></button>
                  <button onClick={() => setEditingCity(null)} className="p-1.5 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200"><X className="w-4 h-4" /></button>
                </div>
              ) : (
                <>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900">{city.name}</h3>
                    <p className="text-xs text-gray-500">{city.bairros.length} bairros, {city.bairros.reduce((s, b) => s + b.referencePoints.length, 0)} pontos ref.</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${city.active ? 'bg-secondary-100 text-secondary-700' : 'bg-gray-100 text-gray-600'}`}>
                    {city.active ? 'Activa' : 'Inactiva'}
                  </span>
                  <button onClick={() => handleToggleCity(city.id)} className={`p-1.5 rounded-lg text-xs ${city.active ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-secondary-50 text-secondary-500 hover:bg-secondary-100'}`} title={city.active ? 'Desativar' : 'Ativar'}>
                    {city.active ? 'Desativar' : 'Ativar'}
                  </button>
                  <button onClick={() => { setEditingCity(city.id); setEditCityName(city.name); }} className="p-1.5 bg-blue-50 text-blue-500 rounded-lg hover:bg-blue-100"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => handleDeleteCity(city.id)} className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
                </>
              )}
            </div>

            {/* Bairros */}
            {expandedCity === city.id && (
              <div className="border-t border-gray-100">
                {city.bairros.map((bairro) => (
                  <div key={bairro.id} className="border-b border-gray-50 last:border-0">
                    {/* Bairro row */}
                    <div className="px-4 py-3 pl-12 flex items-center gap-3">
                      <button onClick={() => setExpandedBairro(expandedBairro === bairro.id ? null : bairro.id)} className="flex-shrink-0">
                        {expandedBairro === bairro.id ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
                      </button>
                      <MapPin className="w-4 h-4 text-secondary-500 flex-shrink-0" />

                      {editingBairro === bairro.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input type="text" value={editBairroName} onChange={(e) => setEditBairroName(e.target.value)} className="input-field text-sm flex-1" onKeyDown={(e) => e.key === 'Enter' && handleSaveEditBairro(city.id, bairro.id)} autoFocus />
                          <button onClick={() => handleSaveEditBairro(city.id, bairro.id)} className="p-1 bg-secondary-50 text-secondary-500 rounded"><Save className="w-3.5 h-3.5" /></button>
                          <button onClick={() => setEditingBairro(null)} className="p-1 bg-gray-100 text-gray-500 rounded"><X className="w-3.5 h-3.5" /></button>
                        </div>
                      ) : (
                        <>
                          <span className="flex-1 text-sm text-gray-800 font-medium">{bairro.name}</span>
                          <span className="text-[10px] text-gray-400">{bairro.referencePoints.length} pts ref.</span>
                          <button onClick={() => { setEditingBairro(bairro.id); setEditBairroName(bairro.name); }} className="p-1 text-blue-400 hover:text-blue-600"><Edit3 className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDeleteBairro(city.id, bairro.id)} className="p-1 text-red-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                        </>
                      )}
                    </div>

                    {/* Reference Points */}
                    {expandedBairro === bairro.id && (
                      <div className="pl-20 pr-4 pb-3 space-y-1.5">
                        {bairro.referencePoints.map((ref) => (
                          <div key={ref.id} className="flex items-center gap-2 bg-orange-50/50 rounded-lg px-3 py-2">
                            <Navigation className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-800">{ref.name}</p>
                              {ref.description && <p className="text-[10px] text-gray-500">{ref.description}</p>}
                            </div>
                            <button onClick={() => handleDeleteRef(city.id, bairro.id, ref.id)} className="p-1 text-red-400 hover:text-red-600"><Trash2 className="w-3 h-3" /></button>
                          </div>
                        ))}

                        {/* Add reference point */}
                        {addingRefTo === bairro.id ? (
                          <div className="bg-primary-50/50 border border-dashed border-primary-200 rounded-lg p-3 space-y-2">
                            <input type="text" value={newRefName} onChange={(e) => setNewRefName(e.target.value)} placeholder="Nome do ponto (ex: Shoprite)" className="input-field text-xs" autoFocus />
                            <input type="text" value={newRefDesc} onChange={(e) => setNewRefDesc(e.target.value)} placeholder="Descricao (ex: Junto ao supermercado)" className="input-field text-xs" onKeyDown={(e) => e.key === 'Enter' && handleAddRef(city.id, bairro.id)} />
                            <div className="flex gap-2">
                              <button onClick={() => handleAddRef(city.id, bairro.id)} className="text-xs bg-primary-500 text-white px-3 py-1.5 rounded-lg hover:bg-primary-600 flex items-center gap-1"><Save className="w-3 h-3" /> Guardar</button>
                              <button onClick={() => { setAddingRefTo(null); setNewRefName(''); setNewRefDesc(''); }} className="text-xs text-gray-500 px-3 py-1.5 bg-gray-100 rounded-lg">Cancelar</button>
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => setAddingRefTo(bairro.id)} className="flex items-center gap-1.5 text-xs text-primary-500 font-medium hover:text-primary-600 py-1.5 px-2 rounded-lg hover:bg-primary-50">
                            <Plus className="w-3.5 h-3.5" /> Adicionar ponto de referencia
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {/* Add bairro */}
                <div className="px-4 py-3 pl-12">
                  {addingBairroTo === city.id ? (
                    <div className="flex gap-2">
                      <input type="text" value={newBairroName} onChange={(e) => setNewBairroName(e.target.value)} placeholder="Nome do bairro (ex: Baixa)" className="input-field text-sm flex-1" onKeyDown={(e) => e.key === 'Enter' && handleAddBairro(city.id)} autoFocus />
                      <button onClick={() => handleAddBairro(city.id)} className="text-xs bg-secondary-500 text-white px-3 py-2 rounded-lg hover:bg-secondary-600 flex items-center gap-1"><Save className="w-3.5 h-3.5" /> Guardar</button>
                      <button onClick={() => { setAddingBairroTo(null); setNewBairroName(''); }} className="text-xs text-gray-500 px-3 py-2 bg-gray-100 rounded-lg">Cancelar</button>
                    </div>
                  ) : (
                    <button onClick={() => setAddingBairroTo(city.id)} className="flex items-center gap-1.5 text-sm text-secondary-500 font-medium hover:text-secondary-600 py-1.5 px-2 rounded-lg hover:bg-secondary-50">
                      <Plus className="w-4 h-4" /> Adicionar bairro
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredCities.length === 0 && (
        <div className="card p-12 text-center">
          <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Nenhuma cidade encontrada</p>
        </div>
      )}
    </div>
  );
}
