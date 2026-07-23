'use client';

import { useState } from 'react';
import { Store, Clock, MapPin, Phone, Save } from 'lucide-react';

export default function PartnerSettingsPage() {
  const [isOpen, setIsOpen] = useState(true);
  const [name, setName] = useState("Mundo's Restaurant");
  const [phone, setPhone] = useState('+258 84 999 8888');
  const [address, setAddress] = useState('Av. Julius Nyerere, 456, Maputo');
  const [openTime, setOpenTime] = useState('08:00');
  const [closeTime, setCloseTime] = useState('22:00');
  const [minOrder, setMinOrder] = useState('200');
  const [deliveryFee, setDeliveryFee] = useState('50');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-6">Definicoes do Restaurante</h2>

      {/* Status Toggle */}
      <div className="card p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Store className="w-5 h-5 text-gray-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">Estado do restaurante</p>
            <p className="text-xs text-gray-500">{isOpen ? 'Aberto - a receber pedidos' : 'Fechado - sem pedidos'}</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative w-12 h-6 rounded-full transition-colors ${isOpen ? 'bg-secondary-500' : 'bg-gray-300'}`}
        >
          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${isOpen ? 'left-6' : 'left-0.5'}`} />
        </button>
      </div>

      {/* Info Form */}
      <div className="card p-4 space-y-4">
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">Nome do restaurante</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-field text-sm" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">Telefone</label>
          <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="input-field text-sm" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">Endereco</label>
          <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="input-field text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Abre as</label>
            <input type="time" value={openTime} onChange={e => setOpenTime(e.target.value)} className="input-field text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Fecha as</label>
            <input type="time" value={closeTime} onChange={e => setCloseTime(e.target.value)} className="input-field text-sm" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Pedido minimo (MT)</label>
            <input type="number" value={minOrder} onChange={e => setMinOrder(e.target.value)} className="input-field text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Taxa entrega (MT)</label>
            <input type="number" value={deliveryFee} onChange={e => setDeliveryFee(e.target.value)} className="input-field text-sm" />
          </div>
        </div>

        <button onClick={handleSave} className="w-full btn-primary text-sm flex items-center justify-center gap-2">
          <Save className="w-4 h-4" />
          {saved ? 'Guardado!' : 'Guardar alteracoes'}
        </button>
      </div>
    </div>
  );
}
