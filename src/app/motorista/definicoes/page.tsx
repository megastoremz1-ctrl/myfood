'use client';

import { useState, useEffect } from 'react';
import { User, Phone, Bike, Save, Loader2 } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';

export default function DriverSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Profile fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  // Vehicle fields
  const [vehicleType, setVehicleType] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const supabase = getSupabase();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;

        const { data: driver } = await supabase.from('drivers').select('*').eq('id', user.id).single();
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

        if (profile) {
          setFullName(profile.full_name || '');
          setPhone(profile.phone || '');
        }

        if (driver) {
          setVehicleType(driver.vehicle_type || '');
          setVehiclePlate(driver.vehicle_plate || '');
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSuccessMessage('');

    try {
      const supabase = getSupabase();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      await supabase.from('profiles').update({ full_name: fullName, phone }).eq('id', user.id);
      await supabase.from('drivers').update({ vehicle_type: vehicleType, vehicle_plate: vehiclePlate }).eq('id', user.id);

      setSuccessMessage('Alterações guardadas com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao guardar:', error);
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
    <div className="max-w-md mx-auto">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Definições</h2>

      {/* Profile Section */}
      <div className="card p-4 mb-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Perfil</h3>
        <div className="space-y-3">
          <div>
            <label className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <User className="w-4 h-4" />
              Nome completo
            </label>
            <input
              type="text"
              className="input-field"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Seu nome completo"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <Phone className="w-4 h-4" />
              Telefone
            </label>
            <input
              type="tel"
              className="input-field"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+258 84 000 0000"
            />
          </div>
        </div>
      </div>

      {/* Vehicle Section */}
      <div className="card p-4 mb-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Veículo</h3>
        <div className="space-y-3">
          <div>
            <label className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <Bike className="w-4 h-4" />
              Tipo de veículo
            </label>
            <input
              type="text"
              className="input-field"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              placeholder="Ex: Moto, Bicicleta"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <Bike className="w-4 h-4" />
              Matrícula
            </label>
            <input
              type="text"
              className="input-field"
              value={vehiclePlate}
              onChange={(e) => setVehiclePlate(e.target.value)}
              placeholder="Ex: MAG-1234"
            />
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-xl text-center">
          {successMessage}
        </div>
      )}

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full btn-primary text-sm flex items-center justify-center gap-2"
      >
        {saving ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        {saving ? 'Guardando...' : 'Guardar alterações'}
      </button>
    </div>
  );
}
