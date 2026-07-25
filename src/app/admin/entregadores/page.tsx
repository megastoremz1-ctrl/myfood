'use client';

import { useState, useEffect } from 'react';
import { Bike, Search, Filter, Loader2, RefreshCw, Star, Phone, MapPin } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';

interface Driver {
  id: string;
  vehicle_type: string | null;
  vehicle_plate: string | null;
  is_online: boolean;
  rating: number | null;
  total_deliveries: number | null;
  balance: number | null;
  created_at: string;
  profiles: {
    full_name: string | null;
    phone: string | null;
    role: string | null;
  } | null;
}

type FilterType = 'all' | 'online' | 'offline';

export default function AdminDriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const fetchDrivers = async () => {
    setLoading(true);
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('drivers')
      .select('*, profiles(full_name, phone, role)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao carregar entregadores:', error);
      setDrivers([]);
    } else {
      setDrivers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const filteredDrivers = drivers.filter((driver) => {
    const name = driver.profiles?.full_name || '';
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());

    if (filter === 'online') return matchesSearch && driver.is_online;
    if (filter === 'offline') return matchesSearch && !driver.is_online;
    return matchesSearch;
  });

  const totalDrivers = drivers.length;
  const onlineDrivers = drivers.filter((d) => d.is_online).length;
  const offlineDrivers = drivers.filter((d) => !d.is_online).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Entregadores</h2>
          <p className="text-sm text-gray-500">Gestão de entregadores da plataforma</p>
        </div>
        <button
          onClick={fetchDrivers}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">Atualizar</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="card p-4 text-center">
          <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 bg-blue-100 rounded-full">
            <Bike className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-bold text-gray-900">{totalDrivers}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
        <div className="card p-4 text-center">
          <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 bg-green-100 rounded-full">
            <MapPin className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-xl font-bold text-green-600">{onlineDrivers}</p>
          <p className="text-xs text-gray-500">Online</p>
        </div>
        <div className="card p-4 text-center">
          <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 bg-gray-100 rounded-full">
            <MapPin className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-xl font-bold text-gray-400">{offlineDrivers}</p>
          <p className="text-xs text-gray-500">Offline</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar por nome..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10 text-sm w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              className="input-field text-sm pr-8"
            >
              <option value="all">Todos</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>
        </div>
      </div>

      {/* Drivers List */}
      {filteredDrivers.length === 0 ? (
        <div className="card p-8 text-center">
          <Bike className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Nenhum entregador registado</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Entregador</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 hidden sm:table-cell">Veículo</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Rating</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 hidden sm:table-cell">Entregas</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 hidden md:table-cell">Saldo</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredDrivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">
                      {driver.profiles?.full_name || 'Sem nome'}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {driver.profiles?.phone || '—'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <p className="text-xs text-gray-600">{driver.vehicle_type || '—'}</p>
                    <p className="text-xs text-gray-400">{driver.vehicle_plate || '—'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-semibold">
                        {driver.rating != null ? driver.rating.toFixed(1) : '—'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 hidden sm:table-cell">
                    {driver.total_deliveries ?? 0}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 hidden md:table-cell">
                    {driver.balance != null ? `${driver.balance.toLocaleString('pt-MZ')} MT` : '0 MT'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        driver.is_online
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {driver.is_online ? 'Online' : 'Offline'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
