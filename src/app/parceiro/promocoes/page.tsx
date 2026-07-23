'use client';

import { useState } from 'react';
import { Tag, Plus, Edit3, Trash2, Calendar, Percent, Users, Gift, X, Save, Copy } from 'lucide-react';

interface Promotion {
  id: number;
  name: string;
  code: string;
  type: 'percentage' | 'fixed' | 'free_delivery';
  value: number;
  minOrder: number;
  active: boolean;
  validFrom: string;
  validUntil: string;
  uses: number;
  maxUses: number;
}

const initialPromotions: Promotion[] = [
  {
    id: 1,
    name: 'Desconto de Boas-Vindas',
    code: 'BEMVINDO20',
    type: 'percentage',
    value: 20,
    minOrder: 30,
    active: true,
    validFrom: '2024-01-01',
    validUntil: '2024-12-31',
    uses: 145,
    maxUses: 500,
  },
  {
    id: 2,
    name: 'Entrega Grátis Fim de Semana',
    code: 'FRETEGRATIS',
    type: 'free_delivery',
    value: 0,
    minOrder: 50,
    active: true,
    validFrom: '2024-03-01',
    validUntil: '2024-06-30',
    uses: 89,
    maxUses: 200,
  },
  {
    id: 3,
    name: 'Desconto Fixo R$10',
    code: 'SAVE10',
    type: 'fixed',
    value: 10,
    minOrder: 40,
    active: false,
    validFrom: '2024-02-01',
    validUntil: '2024-05-31',
    uses: 200,
    maxUses: 200,
  },
  {
    id: 4,
    name: 'Promoção de Aniversário',
    code: 'ANIVER30',
    type: 'percentage',
    value: 30,
    minOrder: 60,
    active: true,
    validFrom: '2024-06-01',
    validUntil: '2024-06-30',
    uses: 12,
    maxUses: 100,
  },
];

const emptyPromotion: Omit<Promotion, 'id'> = {
  name: '',
  code: '',
  type: 'percentage',
  value: 0,
  minOrder: 0,
  active: true,
  validFrom: '',
  validUntil: '',
  uses: 0,
  maxUses: 100,
};

export default function PromocoesPage() {
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<Promotion, 'id'>>(emptyPromotion);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const filteredPromotions = promotions.filter((promo) => {
    if (filter === 'active') return promo.active;
    if (filter === 'inactive') return !promo.active;
    return true;
  });

  const totalActive = promotions.filter((p) => p.active).length;
  const totalUses = promotions.reduce((sum, p) => sum + p.uses, 0);
  const averageDiscount =
    promotions.filter((p) => p.type !== 'free_delivery').length > 0
      ? Math.round(
          promotions
            .filter((p) => p.type !== 'free_delivery')
            .reduce((sum, p) => sum + p.value, 0) /
            promotions.filter((p) => p.type !== 'free_delivery').length
        )
      : 0;

  const openCreateModal = () => {
    setEditingId(null);
    setFormData(emptyPromotion);
    setShowModal(true);
  };

  const openEditModal = (promo: Promotion) => {
    setEditingId(promo.id);
    const { id, ...rest } = promo;
    setFormData(rest);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.code) return;

    if (editingId !== null) {
      setPromotions((prev) =>
        prev.map((p) => (p.id === editingId ? { ...formData, id: editingId } : p))
      );
    } else {
      const newId = Math.max(...promotions.map((p) => p.id), 0) + 1;
      setPromotions((prev) => [...prev, { ...formData, id: newId }]);
    }
    setShowModal(false);
    setEditingId(null);
    setFormData(emptyPromotion);
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta promoção?')) {
      setPromotions((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const toggleActive = (id: number) => {
    setPromotions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getTypeBadge = (type: Promotion['type']) => {
    switch (type) {
      case 'percentage':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            <Percent className="w-3 h-3" /> Percentual
          </span>
        );
      case 'fixed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <Tag className="w-3 h-3" /> Valor Fixo
          </span>
        );
      case 'free_delivery':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
            <Gift className="w-3 h-3" /> Entrega Grátis
          </span>
        );
    }
  };

  const getValueDisplay = (promo: Promotion) => {
    switch (promo.type) {
      case 'percentage':
        return `${promo.value}%`;
      case 'fixed':
        return `R$${promo.value.toFixed(2)}`;
      case 'free_delivery':
        return 'Grátis';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Tag className="w-7 h-7 text-orange-500" />
              Promoções
            </h1>
            <p className="text-gray-500 mt-1">Gerencie cupons e ofertas do seu restaurante</p>
          </div>
          <button
            onClick={openCreateModal}
            className="btn-primary inline-flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Nova Promoção
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Tag className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Promoções Ativas</p>
                <p className="text-xl font-bold text-gray-900">{totalActive}</p>
              </div>
            </div>
          </div>
          <div className="card bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total de Usos</p>
                <p className="text-xl font-bold text-gray-900">{totalUses}</p>
              </div>
            </div>
          </div>
          <div className="card bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <Percent className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Desconto Médio</p>
                <p className="text-xl font-bold text-gray-900">{averageDiscount}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {(['all', 'active', 'inactive'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {f === 'all' ? 'Todas' : f === 'active' ? 'Ativas' : 'Inativas'}
            </button>
          ))}
        </div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredPromotions.map((promo) => (
            <div
              key={promo.id}
              className="card bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{promo.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="font-mono text-sm bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                      {promo.code}
                    </code>
                    <button
                      onClick={() => copyCode(promo.code)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title="Copiar código"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {copiedCode === promo.code && (
                      <span className="text-xs text-green-600 font-medium">Copiado!</span>
                    )}
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={promo.active}
                    onChange={() => toggleActive(promo.id)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>

              <div className="flex items-center gap-2 mb-3">
                {getTypeBadge(promo.type)}
                <span className="text-lg font-bold text-gray-900">{getValueDisplay(promo)}</span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(promo.validFrom).toLocaleDateString('pt-BR')} -{' '}
                    {new Date(promo.validUntil).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Tag className="w-4 h-4" />
                  <span>Pedido mínimo: R${promo.minOrder.toFixed(2)}</span>
                </div>
              </div>

              {/* Usage Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-500 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> Utilização
                  </span>
                  <span className="font-medium text-gray-700">
                    {promo.uses}/{promo.maxUses}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all bg-orange-500"
                    style={{ width: `${Math.min((promo.uses / promo.maxUses) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => openEditModal(promo)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(promo.id)}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredPromotions.length === 0 && (
          <div className="text-center py-12">
            <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-lg">Nenhuma promoção encontrada</p>
            <p className="text-gray-400 text-sm mt-1">Tente alterar o filtro ou crie uma nova promoção</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId ? 'Editar Promoção' : 'Nova Promoção'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Promoção
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  placeholder="Ex: Desconto de Verão"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código do Cupom
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toUpperCase() })
                  }
                  className="input-field w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all font-mono"
                  placeholder="Ex: VERAO25"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as Promotion['type'],
                      })
                    }
                    className="input-field w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  >
                    <option value="percentage">Percentual</option>
                    <option value="fixed">Valor Fixo</option>
                    <option value="free_delivery">Entrega Grátis</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor {formData.type === 'percentage' ? '(%)' : formData.type === 'fixed' ? '(R$)' : ''}
                  </label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) =>
                      setFormData({ ...formData, value: Number(e.target.value) })
                    }
                    className="input-field w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    disabled={formData.type === 'free_delivery'}
                    min={0}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pedido Mínimo (R$)
                </label>
                <input
                  type="number"
                  value={formData.minOrder}
                  onChange={(e) =>
                    setFormData({ ...formData, minOrder: Number(e.target.value) })
                  }
                  className="input-field w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  min={0}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Válido de
                  </label>
                  <input
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) =>
                      setFormData({ ...formData, validFrom: e.target.value })
                    }
                    className="input-field w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Válido até
                  </label>
                  <input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) =>
                      setFormData({ ...formData, validUntil: e.target.value })
                    }
                    className="input-field w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Usos Atuais
                  </label>
                  <input
                    type="number"
                    value={formData.uses}
                    onChange={(e) =>
                      setFormData({ ...formData, uses: Number(e.target.value) })
                    }
                    className="input-field w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Máximo de Usos
                  </label>
                  <input
                    type="number"
                    value={formData.maxUses}
                    onChange={(e) =>
                      setFormData({ ...formData, maxUses: Number(e.target.value) })
                    }
                    className="input-field w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    min={1}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) =>
                      setFormData({ ...formData, active: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                </label>
                <span className="text-sm font-medium text-gray-700">Promoção ativa</span>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 rounded-b-2xl flex items-center justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="btn-primary inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors shadow-sm text-sm"
              >
                <Save className="w-4 h-4" />
                {editingId ? 'Salvar Alterações' : 'Criar Promoção'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
