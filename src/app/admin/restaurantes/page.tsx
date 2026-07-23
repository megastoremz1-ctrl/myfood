'use client';

import { useState, useMemo } from 'react';
import { restaurants as initialRestaurants } from '@/data/mock';
import {
  Store,
  Search,
  Filter,
  Star,
  Eye,
  X,
  CheckCircle,
  Ban,
  Settings,
  DollarSign,
  Package,
  Calendar,
  Percent,
  Edit3,
  Save,
} from 'lucide-react';

type RestaurantStatus = 'active' | 'suspended' | 'pending';

interface AdminRestaurant {
  id: string;
  name: string;
  image: string;
  logo: string;
  rating: number;
  reviews: number;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  isOpen: boolean;
  categories: string[];
  distance: string;
  freeDelivery?: boolean;
  isNew?: boolean;
  hasPromo?: boolean;
  status: RestaurantStatus;
  commission: number;
  totalOrders: number;
  totalRevenue: number;
  joinDate: string;
}

type SortOption = 'name' | 'rating' | 'orders' | 'revenue';

const statusColors: Record<RestaurantStatus, string> = {
  active: 'bg-green-100 text-green-700',
  suspended: 'bg-red-100 text-red-700',
  pending: 'bg-yellow-100 text-yellow-700',
};

const statusLabels: Record<RestaurantStatus, string> = {
  active: 'Ativo',
  suspended: 'Suspenso',
  pending: 'Pendente',
};

export default function AdminRestaurantesPage() {
  const [restaurants, setRestaurants] = useState<AdminRestaurant[]>(() =>
    initialRestaurants.map((r, index) => ({
      ...r,
      status: index % 5 === 0 ? 'pending' : index % 4 === 0 ? 'suspended' : 'active' as RestaurantStatus,
      commission: 10 + (index * 2),
      totalOrders: Math.floor(Math.random() * 2000) + 100,
      totalRevenue: Math.floor(Math.random() * 500000) + 50000,
      joinDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    }))
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | RestaurantStatus>('all');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [selectedRestaurant, setSelectedRestaurant] = useState<AdminRestaurant | null>(null);
  const [editingCommission, setEditingCommission] = useState<string | null>(null);
  const [commissionValue, setCommissionValue] = useState<string>('');

  const filteredAndSorted = useMemo(() => {
    let filtered = restaurants.filter((r) => {
      const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        case 'orders':
          return b.totalOrders - a.totalOrders;
        case 'revenue':
          return b.totalRevenue - a.totalRevenue;
        default:
          return 0;
      }
    });

    return filtered;
  }, [restaurants, searchQuery, statusFilter, sortBy]);

  const stats = useMemo(() => {
    const total = restaurants.length;
    const active = restaurants.filter((r) => r.status === 'active').length;
    const suspended = restaurants.filter((r) => r.status === 'suspended').length;
    const pending = restaurants.filter((r) => r.status === 'pending').length;
    const totalRevenue = restaurants.reduce((sum, r) => sum + r.totalRevenue, 0);
    return { total, active, suspended, pending, totalRevenue };
  }, [restaurants]);

  const handleApprove = (id: string) => {
    setRestaurants((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'active' as RestaurantStatus } : r))
    );
    if (selectedRestaurant?.id === id) {
      setSelectedRestaurant((prev) => prev ? { ...prev, status: 'active' } : null);
    }
  };

  const handleToggleSuspend = (id: string, currentStatus: RestaurantStatus) => {
    const newStatus: RestaurantStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    const message =
      newStatus === 'suspended'
        ? 'Tem certeza que deseja suspender este restaurante?'
        : 'Tem certeza que deseja reativar este restaurante?';

    if (confirm(message)) {
      setRestaurants((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
      if (selectedRestaurant?.id === id) {
        setSelectedRestaurant((prev) => prev ? { ...prev, status: newStatus } : null);
      }
    }
  };

  const handleEditCommission = (id: string, currentCommission: number) => {
    setEditingCommission(id);
    setCommissionValue(currentCommission.toString());
  };

  const handleSaveCommission = (id: string) => {
    const newCommission = parseFloat(commissionValue);
    if (!isNaN(newCommission) && newCommission >= 0 && newCommission <= 100) {
      setRestaurants((prev) =>
        prev.map((r) => (r.id === id ? { ...r, commission: newCommission } : r))
      );
      if (selectedRestaurant?.id === id) {
        setSelectedRestaurant((prev) => prev ? { ...prev, commission: newCommission } : null);
      }
    }
    setEditingCommission(null);
    setCommissionValue('');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(value) + ' MT';
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Store className="w-7 h-7 text-orange-500" />
          <h1 className="text-2xl font-bold text-gray-800">Gestão de Restaurantes</h1>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="card p-4 text-center">
          <Store className="w-5 h-5 mx-auto text-blue-500 mb-1" />
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
        <div className="card p-4 text-center">
          <CheckCircle className="w-5 h-5 mx-auto text-green-500 mb-1" />
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          <p className="text-xs text-gray-500">Ativos</p>
        </div>
        <div className="card p-4 text-center">
          <Ban className="w-5 h-5 mx-auto text-red-500 mb-1" />
          <p className="text-2xl font-bold text-red-600">{stats.suspended}</p>
          <p className="text-xs text-gray-500">Suspensos</p>
        </div>
        <div className="card p-4 text-center">
          <Settings className="w-5 h-5 mx-auto text-yellow-500 mb-1" />
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-xs text-gray-500">Pendentes</p>
        </div>
        <div className="card p-4 text-center col-span-2 md:col-span-1">
          <DollarSign className="w-5 h-5 mx-auto text-purple-500 mb-1" />
          <p className="text-lg font-bold text-purple-600">{formatCurrency(stats.totalRevenue)}</p>
          <p className="text-xs text-gray-500">Receita Total</p>
        </div>
      </div>

      {/* Search, Filter and Sort */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar restaurante..."
              className="input-field pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              className="input-field"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | RestaurantStatus)}
            >
              <option value="all">Todos</option>
              <option value="active">Ativos</option>
              <option value="suspended">Suspensos</option>
              <option value="pending">Pendentes</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-gray-500" />
            <select
              className="input-field"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
            >
              <option value="name">Nome</option>
              <option value="rating">Avaliação</option>
              <option value="orders">Pedidos</option>
              <option value="revenue">Receita</option>
            </select>
          </div>
        </div>
      </div>

      {/* Restaurant List */}
      <div className="space-y-3">
        {filteredAndSorted.length === 0 ? (
          <div className="card p-8 text-center">
            <Store className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">Nenhum restaurante encontrado</p>
          </div>
        ) : (
          filteredAndSorted.map((restaurant) => (
            <div key={restaurant.id} className="card p-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Logo & Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <img
                    src={restaurant.logo}
                    alt={restaurant.name}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">{restaurant.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span>{restaurant.rating}</span>
                      <span>•</span>
                      <span>{restaurant.reviews} avaliações</span>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[restaurant.status]}`}>
                    {statusLabels[restaurant.status]}
                  </span>
                </div>

                {/* Commission */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {editingCommission === restaurant.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        className="input-field w-20 text-sm"
                        value={commissionValue}
                        onChange={(e) => setCommissionValue(e.target.value)}
                        min="0"
                        max="100"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveCommission(restaurant.id);
                          if (e.key === 'Escape') setEditingCommission(null);
                        }}
                      />
                      <button
                        onClick={() => handleSaveCommission(restaurant.id)}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                        title="Salvar"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Percent className="w-3.5 h-3.5" />
                      <span>{restaurant.commission}%</span>
                      <button
                        onClick={() => handleEditCommission(restaurant.id, restaurant.commission)}
                        className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded"
                        title="Editar comissão"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Orders */}
                <div className="flex items-center gap-1 text-sm text-gray-600 flex-shrink-0">
                  <Package className="w-3.5 h-3.5" />
                  <span>{restaurant.totalOrders.toLocaleString()} pedidos</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setSelectedRestaurant(restaurant)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Ver detalhes"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {restaurant.status === 'pending' && (
                    <button
                      onClick={() => handleApprove(restaurant.id)}
                      className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Aprovar
                    </button>
                  )}

                  {restaurant.status !== 'pending' && (
                    <button
                      onClick={() => handleToggleSuspend(restaurant.id, restaurant.status)}
                      className={`p-2 rounded-lg transition-colors ${
                        restaurant.status === 'suspended'
                          ? 'text-green-600 hover:bg-green-50'
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                      title={restaurant.status === 'suspended' ? 'Reativar' : 'Suspender'}
                    >
                      {restaurant.status === 'suspended' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Ban className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {selectedRestaurant && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Cover Image */}
            <div className="relative">
              <img
                src={selectedRestaurant.image}
                alt={selectedRestaurant.name}
                className="w-full h-40 object-cover rounded-t-2xl"
              />
              <button
                onClick={() => setSelectedRestaurant(null)}
                className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
              <div className="absolute -bottom-6 left-4">
                <img
                  src={selectedRestaurant.logo}
                  alt={selectedRestaurant.name}
                  className="w-14 h-14 rounded-full border-4 border-white object-cover"
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-5 pt-10 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{selectedRestaurant.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium">{selectedRestaurant.rating}</span>
                    <span className="text-sm text-gray-500">({selectedRestaurant.reviews} avaliações)</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[selectedRestaurant.status]}`}>
                  {statusLabels[selectedRestaurant.status]}
                </span>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Tempo de Entrega</p>
                  <p className="text-sm font-medium">{selectedRestaurant.deliveryTime}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Taxa de Entrega</p>
                  <p className="text-sm font-medium">{formatCurrency(selectedRestaurant.deliveryFee)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Pedido Mínimo</p>
                  <p className="text-sm font-medium">{formatCurrency(selectedRestaurant.minOrder)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Distância</p>
                  <p className="text-sm font-medium">{selectedRestaurant.distance}</p>
                </div>
              </div>

              {/* Categories */}
              <div>
                <p className="text-xs text-gray-500 mb-2">Categorias</p>
                <div className="flex flex-wrap gap-2">
                  {selectedRestaurant.categories.map((cat) => (
                    <span key={cat} className="px-2.5 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Admin Info */}
              <div className="border-t pt-4 space-y-3">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Informações Administrativas
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Percent className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="text-xs text-gray-500">Comissão</p>
                      <p className="text-sm font-medium">{selectedRestaurant.commission}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-green-500" />
                    <div>
                      <p className="text-xs text-gray-500">Total Pedidos</p>
                      <p className="text-sm font-medium">{selectedRestaurant.totalOrders.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-purple-500" />
                    <div>
                      <p className="text-xs text-gray-500">Receita Total</p>
                      <p className="text-sm font-medium">{formatCurrency(selectedRestaurant.totalRevenue)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Data de Adesão</p>
                      <p className="text-sm font-medium">{selectedRestaurant.joinDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t pt-4 flex flex-wrap gap-2">
                {selectedRestaurant.status === 'pending' && (
                  <button
                    onClick={() => handleApprove(selectedRestaurant.id)}
                    className="btn-primary flex items-center gap-2 text-sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Aprovar Restaurante
                  </button>
                )}
                {selectedRestaurant.status !== 'pending' && (
                  <button
                    onClick={() => {
                      handleToggleSuspend(selectedRestaurant.id, selectedRestaurant.status);
                    }}
                    className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedRestaurant.status === 'suspended'
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    {selectedRestaurant.status === 'suspended' ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Reativar
                      </>
                    ) : (
                      <>
                        <Ban className="w-4 h-4" />
                        Suspender
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={() => setSelectedRestaurant(null)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
