'use client';

import { useState } from 'react';
import { User, Phone, MapPin, Bike, CreditCard, Bell, Shield, Save } from 'lucide-react';

export default function DriverSettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-6">Definicoes</h2>

      {/* Profile */}
      <div className="card p-4 mb-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Perfil</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <User className="w-4 h-4 text-gray-500" />
            <div className="flex-1">
              <p className="text-xs text-gray-500">Nome</p>
              <p className="text-sm text-gray-900">Carlos Muthemba</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <Phone className="w-4 h-4 text-gray-500" />
            <div className="flex-1">
              <p className="text-xs text-gray-500">Telefone</p>
              <p className="text-sm text-gray-900">+258 84 777 8888</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <Bike className="w-4 h-4 text-gray-500" />
            <div className="flex-1">
              <p className="text-xs text-gray-500">Veiculo</p>
              <p className="text-sm text-gray-900">Honda PCX - MAG-1234</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment */}
      <div className="card p-4 mb-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Metodo de levantamento</h3>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <CreditCard className="w-4 h-4 text-gray-500" />
          <div className="flex-1">
            <p className="text-xs text-gray-500">M-Pesa</p>
            <p className="text-sm text-gray-900">+258 84 777 8888</p>
          </div>
          <button className="text-xs text-primary-500 font-medium">Alterar</button>
        </div>
      </div>

      {/* Preferences */}
      <div className="card p-4 mb-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Preferencias</h3>
        <div className="space-y-3">
          {[
            { icon: Bell, label: 'Notificacoes de entregas', active: true },
            { icon: MapPin, label: 'Partilhar localizacao', active: true },
            { icon: Shield, label: 'Verificacao em 2 passos', active: false },
          ].map(({ icon: Icon, label, active }) => (
            <div key={label} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">{label}</span>
              </div>
              <div className={`w-10 h-5 rounded-full transition-colors ${active ? 'bg-secondary-500' : 'bg-gray-300'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow mt-0.5 transition-all ${active ? 'ml-5' : 'ml-0.5'}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleSave} className="w-full btn-primary text-sm flex items-center justify-center gap-2">
        <Save className="w-4 h-4" />
        {saved ? 'Guardado!' : 'Guardar alteracoes'}
      </button>
    </div>
  );
}
