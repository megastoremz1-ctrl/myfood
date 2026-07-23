'use client';

import { useState } from 'react';
import { Bell, Send, Users, Store, Bike, Search, X, Check, Plus, Clock, User } from 'lucide-react';

const mockClients = [
  { id: 'c1', name: 'Antonio Machel' },
  { id: 'c2', name: 'Maria Santos' },
  { id: 'c3', name: 'Joao Pedro' },
  { id: 'c4', name: 'Ana Lucia' },
  { id: 'c5', name: 'Carlos Fernandes' },
  { id: 'c6', name: 'Sara Machel' },
  { id: 'c7', name: 'Luis Alberto' },
  { id: 'c8', name: 'Rita Costa' },
];

const mockRestaurants = [
  { id: 'r1', name: "Mundo's Restaurant" },
  { id: 'r2', name: 'Pizza House Maputo' },
  { id: 'r3', name: 'Sushi Master' },
  { id: 'r4', name: 'Cafe Central' },
  { id: 'r5', name: 'Frango Piri-Piri' },
  { id: 'r6', name: 'Burger King Maputo' },
];

const mockDrivers = [
  { id: 'd1', name: 'Carlos Muthemba' },
  { id: 'd2', name: 'Pedro Augusto' },
  { id: 'd3', name: 'Luis Bernardo' },
  { id: 'd4', name: 'Rita Fernandes' },
  { id: 'd5', name: 'Miguel Costa' },
];

interface SentNotification {
  id: string;
  title: string;
  message: string;
  targetType: string;
  targetNames: string[];
  sentAt: string;
}

type TargetMode = 'all' | 'all_clients' | 'all_restaurants' | 'all_drivers' | 'specific';
type SpecificType = 'clients' | 'restaurants' | 'drivers';

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetMode, setTargetMode] = useState<TargetMode>('all');
  const [specificType, setSpecificType] = useState<SpecificType>('clients');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [entitySearch, setEntitySearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [sent, setSent] = useState(false);
  const [tab, setTab] = useState<'compose' | 'history'>('compose');
  const [history, setHistory] = useState<SentNotification[]>([
    { id: 'h1', title: 'Promocao de verao!', message: 'Use VERAO50 para 50MT desconto', targetType: 'Todos clientes', targetNames: [], sentAt: '23 Jul, 14:30' },
    { id: 'h2', title: 'Novo menu disponivel', message: 'Actualizem os menus para o fim de semana', targetType: 'Todos restaurantes', targetNames: [], sentAt: '22 Jul, 10:00' },
    { id: 'h3', title: 'Bonus de entrega', message: 'Entregue 10 pedidos e ganhe 200 MT extra', targetType: 'Todos entregadores', targetNames: [], sentAt: '21 Jul, 08:00' },
  ]);

  const getEntityList = () => {
    if (specificType === 'clients') return mockClients;
    if (specificType === 'restaurants') return mockRestaurants;
    return mockDrivers;
  };

  const filteredEntities = getEntityList().filter(
    (e) => e.name.toLowerCase().includes(entitySearch.toLowerCase()) && !selectedIds.includes(e.id)
  );

  const getEntityName = (id: string) => {
    const all = [...mockClients, ...mockRestaurants, ...mockDrivers];
    return all.find((e) => e.id === id)?.name || id;
  };

  const addEntity = (id: string) => {
    setSelectedIds((prev) => [...prev, id]);
    setEntitySearch('');
    setShowDropdown(false);
  };

  const removeEntity = (id: string) => {
    setSelectedIds((prev) => prev.filter((e) => e !== id));
  };

  const selectAll = () => {
    setSelectedIds(getEntityList().map((e) => e.id));
  };

  const clearAll = () => {
    setSelectedIds([]);
  };

  const getTargetSummary = () => {
    switch (targetMode) {
      case 'all': return 'Todos os utilizadores da plataforma';
      case 'all_clients': return `Todos os clientes (${mockClients.length})`;
      case 'all_restaurants': return `Todos os restaurantes (${mockRestaurants.length})`;
      case 'all_drivers': return `Todos os entregadores (${mockDrivers.length})`;
      case 'specific': return `${selectedIds.length} ${specificType === 'clients' ? 'cliente(s)' : specificType === 'restaurants' ? 'restaurante(s)' : 'entregador(es)'} selecionado(s)`;
    }
  };

  const canSend = title.trim() && message.trim() && (targetMode !== 'specific' || selectedIds.length > 0);

  const handleSend = () => {
    if (!canSend) return;
    const newEntry: SentNotification = {
      id: `h-${Date.now()}`,
      title,
      message,
      targetType: targetMode === 'specific'
        ? `${selectedIds.length} ${specificType}`
        : targetMode === 'all' ? 'Todos' : targetMode.replace('all_', 'Todos '),
      targetNames: targetMode === 'specific' ? selectedIds.map(getEntityName) : [],
      sentAt: new Date().toLocaleString('pt-MZ', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
    };
    setHistory([newEntry, ...history]);
    setTitle('');
    setMessage('');
    setSelectedIds([]);
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">Notificacoes</h2>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          <button onClick={() => setTab('compose')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${tab === 'compose' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600'}`}>
            Compor
          </button>
          <button onClick={() => setTab('history')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${tab === 'history' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600'}`}>
            Historico ({history.length})
          </button>
        </div>
      </div>

      {tab === 'compose' ? (
        <div className="card p-5 space-y-5">
          {/* Target Mode */}
          <div>
            <label className="text-xs font-medium text-gray-700 mb-2 block">Enviar para</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {([
                { mode: 'all' as TargetMode, label: 'Todos', icon: Bell },
                { mode: 'all_clients' as TargetMode, label: 'Clientes', icon: Users },
                { mode: 'all_restaurants' as TargetMode, label: 'Restaurantes', icon: Store },
                { mode: 'all_drivers' as TargetMode, label: 'Entregadores', icon: Bike },
              ]).map(({ mode, label, icon: Icon }) => (
                <button
                  key={mode}
                  onClick={() => { setTargetMode(mode); setSelectedIds([]); }}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    targetMode === mode ? 'border-purple-500 bg-purple-50 text-purple-600' : 'border-gray-100 text-gray-600 hover:border-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Specific Entity Selection */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer mb-3">
              <input
                type="checkbox"
                checked={targetMode === 'specific'}
                onChange={(e) => {
                  if (e.target.checked) {
                    setTargetMode('specific');
                    setSelectedIds([]);
                  } else {
                    setTargetMode('all');
                    setSelectedIds([]);
                  }
                }}
                className="w-4 h-4 text-purple-500 rounded"
              />
              <span className="text-sm text-gray-700">Selecionar entidades especificas</span>
            </label>

            {targetMode === 'specific' && (
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                {/* Type selector */}
                <div className="flex gap-2">
                  {([
                    { type: 'clients' as SpecificType, label: 'Clientes', icon: Users },
                    { type: 'restaurants' as SpecificType, label: 'Restaurantes', icon: Store },
                    { type: 'drivers' as SpecificType, label: 'Entregadores', icon: Bike },
                  ]).map(({ type, label, icon: Icon }) => (
                    <button
                      key={type}
                      onClick={() => { setSpecificType(type); setSelectedIds([]); setEntitySearch(''); }}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        specificType === type ? 'bg-purple-500 text-white' : 'bg-white text-gray-600 border border-gray-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </button>
                  ))}
                </div>

                {/* Selected entities */}
                {selectedIds.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedIds.map((id) => (
                      <span key={id} className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-full">
                        <User className="w-3 h-3" />
                        {getEntityName(id)}
                        <button onClick={() => removeEntity(id)} className="hover:text-purple-900 ml-0.5">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Search input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={entitySearch}
                    onChange={(e) => { setEntitySearch(e.target.value); setShowDropdown(true); }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder={`Pesquisar ${specificType === 'clients' ? 'clientes' : specificType === 'restaurants' ? 'restaurantes' : 'entregadores'}...`}
                    className="input-field pl-10 text-sm w-full"
                  />
                </div>

                {/* Dropdown results */}
                {showDropdown && filteredEntities.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-xl max-h-40 overflow-y-auto shadow-sm">
                    {filteredEntities.map((entity) => (
                      <button
                        key={entity.id}
                        onClick={() => addEntity(entity.id)}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 flex items-center gap-2 border-b border-gray-50 last:border-0"
                      >
                        <Plus className="w-3.5 h-3.5 text-purple-500" />
                        {entity.name}
                      </button>
                    ))}
                  </div>
                )}

                {/* Quick actions */}
                <div className="flex items-center gap-3">
                  <button onClick={selectAll} className="text-xs text-purple-600 font-medium hover:underline">
                    Selecionar todos ({getEntityList().length})
                  </button>
                  {selectedIds.length > 0 && (
                    <button onClick={clearAll} className="text-xs text-red-500 font-medium hover:underline">
                      Limpar selecao
                    </button>
                  )}
                  <span className="text-[10px] text-gray-400 ml-auto">
                    {selectedIds.length}/{getEntityList().length}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Titulo *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Promocao especial!" className="input-field text-sm" />
          </div>

          {/* Message */}
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Mensagem *</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Escreva a mensagem..." className="input-field h-28 resize-none text-sm" />
            <p className="text-[10px] text-gray-400 mt-1 text-right">{message.length}/500</p>
          </div>

          {/* Summary */}
          <div className="bg-purple-50 rounded-xl p-3 flex items-center gap-3">
            <Bell className="w-5 h-5 text-purple-500 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-purple-700">Resumo do envio</p>
              <p className="text-xs text-purple-600">{getTargetSummary()}</p>
            </div>
          </div>

          {/* Send */}
          <button
            onClick={handleSend}
            disabled={!canSend}
            className={`w-full btn-primary text-sm flex items-center justify-center gap-2 ${!canSend ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {sent ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
            {sent ? 'Enviado com sucesso!' : 'Enviar notificacao'}
          </button>
        </div>
      ) : (
        /* History */
        <div className="space-y-3">
          {history.length === 0 ? (
            <div className="card p-12 text-center">
              <Bell className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Nenhuma notificacao enviada</p>
            </div>
          ) : (
            history.map((n) => (
              <div key={n.id} className="card p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{n.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                  </div>
                  <span className="text-[10px] bg-secondary-100 text-secondary-700 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                    Enviado
                  </span>
                </div>
                {n.targetNames.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {n.targetNames.map((name, i) => (
                      <span key={i} className="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">{name}</span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-3 text-[10px] text-gray-400 pt-2 border-t border-gray-100">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{n.sentAt}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{n.targetType}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
