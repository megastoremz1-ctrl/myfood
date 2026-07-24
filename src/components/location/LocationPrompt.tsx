'use client';

import { useState, useEffect } from 'react';
import { MapPin, Navigation, X, Loader2 } from 'lucide-react';
import { requestLocation, checkLocationPermission } from '@/lib/location';
import { useStore } from '@/store/useStore';

export default function LocationPrompt() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [denied, setDenied] = useState(false);
  const { setSelectedAddress } = useStore();

  useEffect(() => {
    async function check() {
      const permission = await checkLocationPermission();
      if (permission === 'prompt') {
        // Show prompt after 2 seconds
        const dismissed = sessionStorage.getItem('myfood-location-dismissed');
        if (!dismissed) {
          setTimeout(() => setShow(true), 2000);
        }
      } else if (permission === 'granted') {
        // Auto-get location silently
        const loc = await requestLocation();
        if (loc?.address) {
          setSelectedAddress(loc.address);
        }
      }
    }
    check();
  }, []);

  const handleAllow = async () => {
    setLoading(true);
    const loc = await requestLocation();
    setLoading(false);

    if (loc?.address) {
      setSelectedAddress(loc.address);
      setShow(false);
    } else {
      setDenied(true);
    }
  };

  const handleDismiss = () => {
    setShow(false);
    sessionStorage.setItem('myfood-location-dismissed', 'true');
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={handleDismiss} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-slide-up">
        <button onClick={handleDismiss} className="absolute top-3 right-3 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>

        {!denied ? (
          <>
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Navigation className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Activar localizacao</h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Precisamos da sua localizacao para mostrar restaurantes perto de si e calcular tempos de entrega
            </p>
            <button
              onClick={handleAllow}
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 mb-3"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
              {loading ? 'A obter localizacao...' : 'Permitir localizacao'}
            </button>
            <button onClick={handleDismiss} className="text-sm text-gray-400 hover:text-gray-600">
              Inserir endereco manualmente
            </button>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Localizacao bloqueada</h3>
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">
              Verifique as permissoes do browser e tente novamente, ou insira o seu endereco manualmente
            </p>
            <button onClick={handleDismiss} className="w-full btn-primary">
              Inserir endereco manualmente
            </button>
          </>
        )}
      </div>
    </div>
  );
}
