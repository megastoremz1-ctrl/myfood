'use client';

import { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Loader2, RefreshCw, Calendar, Percent, Gift, X, Save } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';

interface Coupon {
  id: string;
  restaurant_id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed' | 'free_delivery';
  value: number;
  min_order: number;
  max_uses: number;
  current_uses: number;
  active: boolean;
  valid_until: string;
  created_at: string;
}

interface CouponForm {
  code: string;
  description: string;
  type: 'percentage' | 'fixed' | 'free_delivery';
  value: number;
  min_order: number;
  max_uses: number;
  valid_until: string;
}

const emptyForm: CouponForm = {
  code: '',
  description: '',
  type: 'percentage',
  value: 0,
  min_order: 0,
  max_uses: 100,
  valid_until: '',
};

export default function PromocoesPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<CouponForm>(emptyForm);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  const supabase = getSupabase();

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: restaurant } = await supabase
        .from('restaurants')
        .select('id')
        .eq('owner_id', user.id)
        .single();

      if (!restaurant) return;
      setRestaurantId(restaurant.id);

      const { data: coupons } = await supabase
        .from('coupons')
        .select('*')
        .eq('restaurant_id', restaurant.id)
        .order('created_at', { ascending: false });

      setCoupons(coupons || []);
    } catch (error) {
      console.error('Erro ao carregar cupons:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async () => {
    if (!formData.code || !formData.description || !restaurantId) return;

    const { error } = await supabase.from('coupons').insert({
      restaurant_id: restaurantId,
      code: formData.code.toUpperCase(),
      description: formData.description,
      type: formData.type,
      value: formData.value,
      min_order: formData.min_order,
      max_uses: formData.max_uses,
      valid_until: formData.valid_until,
      active: true,
      current_uses: 0,
    });

    if (!error) {
      setShowModal(false);
      setFormData(emptyForm);
      fetchCoupons();
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from('coupons')
      .update({ active: !current })
      .eq('id', id);

    if (!error) {
      setCoupons((prev) =>
        prev.map((c) => (c.id === id ? { ...c, active: !current } : c))
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este cupom?')) return;

    const { error } = await supabase.from('coupons').delete().eq('id', id);

    if (!error) {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const getTypeBadge = (type: Coupon['type']) => {
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
            <Gift className="w-3 h-3" /> Entrega Gratis
          </span>
        );
    }
  };

  const getValueDisplay = (coupon: Coupon) => {
    switch (coupon.type) {
      case 'percentage':
        return `${coupon.value}%`;
      case 'fixed':
        return `${coupon.value.toFixed(2)} MT`;
      case 'free_delivery':
        return 'Gratis';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Tag className="w-7 h-7 text-orange-500" />
              Promocoes
            </h1>
            <p className="text-gray-500 mt-1">Gerencie cupons e ofertas do seu restaurante</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchCoupons}
              className="inline-flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Atualizar
            </button>
            <button
              onClick={() => { setFormData(emptyForm); setShowModal(true); }}
              className="btn-primary inline-flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
              Nova Promocao
            </button>
          </div>
        </div>

        {/* Coupons Grid */}
        {coupons.length === 0 ? (
          <div className="text-center py-12">
            <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-lg">Nenhuma promocao criada</p>
            <p className="text-gray-400 text-sm mt-1">Crie seu primeiro cupom para atrair clientes</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {coupons.map((coupon) => (
              <div
                key={coupon.id}
                className="card bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <code className="font-mono text-sm bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-semibold">
                      {coupon.code}
                    </code>
                    <p className="text-sm text-gray-600 mt-1">{coupon.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={coupon.active}
                      onChange={() => toggleActive(coupon.id, coupon.active)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  {getTypeBadge(coupon.type)}
                  <span className="text-lg font-bold text-gray-900">{getValueDisplay(coupon)}</span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Tag className="w-4 h-4" />
                    <span>Pedido minimo: {coupon.min_order?.toFixed(2)} MT</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Valido ate: {coupon.valid_until ? new Date(coupon.valid_until).toLocaleDateString('pt-BR') : 'Sem limite'}
                    </span>
                  </div>
                </div>

                {/* Usage Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-500">Utilizacao</span>
                    <span className="font-medium text-gray-700">
                      {coupon.current_uses || 0}/{coupon.max_uses || 0}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all bg-orange-500"
                      style={{ width: `${coupon.max_uses ? Math.min(((coupon.current_uses || 0) / coupon.max_uses) * 100, 100) : 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleDelete(coupon.id)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Nova Promocao</h2>
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
                  Codigo do Cupom
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="input-field w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all font-mono"
                  placeholder="Ex: VERAO25"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descricao
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  placeholder="Ex: Desconto de verao para novos clientes"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as CouponForm['type'] })}
                    className="input-field w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  >
                    <option value="percentage">Percentual</option>
                    <option value="fixed">Valor Fixo (MT)</option>
                    <option value="free_delivery">Entrega Gratis</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor {formData.type === 'percentage' ? '(%)' : formData.type === 'fixed' ? '(MT)' : ''}
                  </label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                    className="input-field w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    disabled={formData.type === 'free_delivery'}
                    min={0}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pedido Minimo (MT)
                </label>
                <input
                  type="number"
                  value={formData.min_order}
                  onChange={(e) => setFormData({ ...formData, min_order: Number(e.target.value) })}
                  className="input-field w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  min={0}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximo de Usos
                  </label>
                  <input
                    type="number"
                    value={formData.max_uses}
                    onChange={(e) => setFormData({ ...formData, max_uses: Number(e.target.value) })}
                    className="input-field w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    min={1}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valido ate
                  </label>
                  <input
                    type="date"
                    value={formData.valid_until}
                    onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                    className="input-field w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  />
                </div>
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
                onClick={handleCreate}
                className="btn-primary inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors shadow-sm text-sm"
              >
                <Save className="w-4 h-4" />
                Criar Promocao
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
