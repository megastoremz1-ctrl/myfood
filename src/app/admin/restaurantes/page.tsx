'use client';

import { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabase';
import {
  Store,
  Search,
  Filter,
  Loader2,
  RefreshCw,
  CheckCircle,
  Ban,
  Star,
  MapPin,
  Phone,
} from 'lucide-react';

interface Restaurant {
  id: string;
  name: string;
  address: string;
  phone: string;
  status: 'active' | 'suspended' | 'pending';
  is_open: boolean;
  rating: number | null;
  delivery_fee: number | null;
  created_at: string;
}

export default function AdminRestaurantesPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'pending'>('all');

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar restaurantes:', error);
        setRestaurants([]);
      } else {
        setRestaurants(data || []);
      }
    } catch (err) {
      console.error('Erro inesperado:', err);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const toggleStatus = async (restaurant: Restaurant) => {
    let newStatus: string;
    let confirmMessage: string;

    if (restaurant.status === 'pending') {
      confirmMessage = `Aprovar o restaurante "${restaurant.name}"?`;
      newStatus = 'active';
    } else if (restaurant.status === 'active') {
      confirmMessage = `Suspender o restaurante "${restaurant.name}"?`;
      newStatus = 'suspended';
    } else {
      confirmMessage = `Ativar o restaurante "${restaurant.name}"?`;
      newStatus = 'active';
    }

    if (!confirm(confirmMessage)) return;

    try {
      const supabase = getSupabase();
      const { error } = await supabase
        .from('restaurants')
        .update({ status: newStatus })
        .eq('id', restaurant.id);

      if (error) {
        console.error('Erro ao atualizar status:', error);
        alert('Erro ao atualizar status do restaurante.');
      } else {
        setRestaurants((prev) =>
          prev.map((r) =>
            r.id === restaurant.id ? { ...r, status: newStatus as Restaurant['status'] } : r
          )
        );
      }
    } catch (err) {
      console.error('Erro inesperado:', err);
    }
  };

  const toggleIsOpen = async (restaurant: Restaurant) => {
    try {
      const supabase = getSupabase();
      const { error } = await supabase
        .from('restaurants')
        .update({ is_open: !restaurant.is_open })
        .eq('id', restaurant.id);

      if (error) {
        console.error('Erro ao atualizar is_open:', error);
        alert('Erro ao atualizar estado do restaurante.');
      } else {
        setRestaurants((prev) =>
          prev.map((r) =>
            r.id === restaurant.id ? { ...r, is_open: !r.is_open } : r
          )
        );
      }
    } catch (err) {
      console.error('Erro inesperado:', err);
    }
  };

  const filteredRestaurants = restaurants.filter((r) => {
    const matchesSearch = r.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: restaurants.length,
    active: restaurants.filter((r) => r.status === 'active').length,
    suspended: restaurants.filter((r) => r.status === 'suspended').length,
    pending: restaurants.filter((r) => r.status === 'pending').length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3" />
            Ativo
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <Ban className="w-3 h-3" />
            Suspenso
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Loader2 className="w-3 h-3" />
            Pendente
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Store className="w-7 h-7 text-orange-500" />
          <h1 className="text-2xl font-bold text-gray-800">Restaurantes</h1>
        </div>
        <button
          onClick={fetchRestaurants}
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-500">Ativos</p>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-500">Suspensos</p>
          <p className="text-2xl font-bold text-red-600">{stats.suspended}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-500">Pendentes</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar restaurante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10 w-full"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="input-field pl-10 pr-8 appearance-none"
          >
            <option value="all">Todos</option>
            <option value="active">Ativos</option>
            <option value="suspended">Suspensos</option>
            <option value="pending">Pendentes</option>
          </select>
        </div>
      </div>

      {/* Restaurant List */}
      {filteredRestaurants.length === 0 ? (
        <div className="card p-8 text-center">
          <Store className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Nenhum restaurante registado</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Nome</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Endereço</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Telefone</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Aberto</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Avaliação</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Taxa Entrega</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Criado em</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredRestaurants.map((restaurant) => (
                  <tr key={restaurant.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-800">{restaurant.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {restaurant.address || '—'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {restaurant.phone || '—'}
                      </span>
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(restaurant.status)}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleIsOpen(restaurant)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          restaurant.is_open ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            restaurant.is_open ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        {restaurant.rating != null ? restaurant.rating.toFixed(1) : '—'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {restaurant.delivery_fee != null
                        ? `R$ ${restaurant.delivery_fee.toFixed(2)}`
                        : '—'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(restaurant.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleStatus(restaurant)}
                        className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${
                          restaurant.status === 'pending'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : restaurant.status === 'active'
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {restaurant.status === 'pending'
                          ? 'Aprovar'
                          : restaurant.status === 'active'
                          ? 'Suspender'
                          : 'Ativar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {filteredRestaurants.map((restaurant) => (
              <div key={restaurant.id} className="card p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">{restaurant.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {restaurant.address || '—'}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {restaurant.phone || '—'}
                    </p>
                  </div>
                  {getStatusBadge(restaurant.status)}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-gray-600">
                      <Star className="w-3 h-3 text-yellow-500" />
                      {restaurant.rating != null ? restaurant.rating.toFixed(1) : '—'}
                    </span>
                    <span className="text-gray-600">
                      {restaurant.delivery_fee != null
                        ? `R$ ${restaurant.delivery_fee.toFixed(2)}`
                        : '—'}
                    </span>
                  </div>
                  <span className="text-gray-400 text-xs">
                    {new Date(restaurant.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Aberto:</span>
                    <button
                      onClick={() => toggleIsOpen(restaurant)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        restaurant.is_open ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          restaurant.is_open ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <button
                    onClick={() => toggleStatus(restaurant)}
                    className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${
                      restaurant.status === 'pending'
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : restaurant.status === 'active'
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {restaurant.status === 'pending'
                      ? 'Aprovar'
                      : restaurant.status === 'active'
                      ? 'Suspender'
                      : 'Ativar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
