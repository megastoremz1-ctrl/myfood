'use client';

import { useState, useEffect } from 'react';
import { Store, Save, Clock, MapPin, Phone, Loader2, DollarSign, Truck } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';

export default function PartnerSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [openingTime, setOpeningTime] = useState('');
  const [closingTime, setClosingTime] = useState('');
  const [minOrder, setMinOrder] = useState('');
  const [deliveryFee, setDeliveryFee] = useState('');
  const [freeDelivery, setFreeDelivery] = useState(false);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const supabase = getSupabase();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: restaurant } = await supabase
          .from('restaurants')
          .select('*')
          .eq('owner_id', user.id)
          .single();

        if (restaurant) {
          setRestaurantId(restaurant.id);
          setName(restaurant.name || '');
          setPhone(restaurant.phone || '');
          setAddress(restaurant.address || '');
          setOpeningTime(restaurant.opening_time || '');
          setClosingTime(restaurant.closing_time || '');
          setMinOrder(restaurant.min_order?.toString() || '');
          setDeliveryFee(restaurant.delivery_fee?.toString() || '');
          setFreeDelivery(restaurant.free_delivery || false);
          setIsOpen(restaurant.is_open || false);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do restaurante:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, []);

  const handleToggleOpen = async () => {
    if (!restaurantId) return;
    try {
      const supabase = getSupabase();
      await supabase
        .from('restaurants')
        .update({ is_open: !isOpen })
        .eq('id', restaurantId);
      setIsOpen(!isOpen);
    } catch (error) {
      console.error('Erro ao atualizar estado:', error);
    }
  };

  const handleSave = async () => {
    if (!restaurantId) return;
    setSaving(true);
    try {
      const supabase = getSupabase();
      await supabase
        .from('restaurants')
        .update({
          name,
          phone,
          address,
          opening_time: openingTime,
          closing_time: closingTime,
          min_order: parseFloat(minOrder) || 0,
          delivery_fee: parseFloat(deliveryFee) || 0,
          free_delivery: freeDelivery,
        })
        .eq('id', restaurantId);

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Erro ao guardar alteracoes:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="pb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Definicoes do Restaurante</h2>

      {/* Success Message */}
      {saved && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 font-medium">
          Alteracoes guardadas com sucesso!
        </div>
      )}

      {/* Status Toggle */}
      <div className="card p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Store className="w-5 h-5 text-gray-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">Estado do restaurante</p>
            <p className="text-xs text-gray-500">
              {isOpen ? 'Aberto - a receber pedidos' : 'Fechado - sem pedidos'}
            </p>
          </div>
        </div>
        <button
          onClick={handleToggleOpen}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            isOpen ? 'bg-secondary-500' : 'bg-gray-300'
          }`}
        >
          <div
            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
              isOpen ? 'left-6' : 'left-0.5'
            }`}
          />
        </button>
      </div>

      {/* Info Form */}
      <div className="card p-4 space-y-4">
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
            <Store className="w-3.5 h-3.5" /> Nome do restaurante
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
            <Phone className="w-3.5 h-3.5" /> Telefone
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input-field text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> Endereco
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="input-field text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Abre as
            </label>
            <input
              type="time"
              value={openingTime}
              onChange={(e) => setOpeningTime(e.target.value)}
              className="input-field text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Fecha as
            </label>
            <input
              type="time"
              value={closingTime}
              onChange={(e) => setClosingTime(e.target.value)}
              className="input-field text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" /> Pedido minimo (MT)
            </label>
            <input
              type="number"
              value={minOrder}
              onChange={(e) => setMinOrder(e.target.value)}
              className="input-field text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" /> Taxa entrega (MT)
            </label>
            <input
              type="number"
              value={deliveryFee}
              onChange={(e) => setDeliveryFee(e.target.value)}
              className="input-field text-sm"
            />
          </div>
        </div>

        {/* Free Delivery Toggle */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Entrega gratis</span>
          </div>
          <button
            onClick={() => setFreeDelivery(!freeDelivery)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              freeDelivery ? 'bg-secondary-500' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                freeDelivery ? 'left-6' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full btn-primary text-sm flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'A guardar...' : 'Guardar alteracoes'}
        </button>
      </div>
    </div>
  );
}
