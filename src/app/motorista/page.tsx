'use client';

import { useState } from 'react';
import { Power, Navigation, MapPin, Phone, CheckCircle, Package, Clock, DollarSign, Star } from 'lucide-react';
import { useStore } from '@/store/useStore';

const availableDeliveries = [
  {
    id: 'D-001',
    restaurant: "Mundo's Restaurant",
    customer: 'Antonio M.',
    pickup: 'Av. Julius Nyerere, 456',
    dropoff: 'Rua da Resistencia, 789',
    distance: '2.3 km',
    earnings: 85,
  },
  {
    id: 'D-002',
    restaurant: 'Pizza House Maputo',
    customer: 'Maria S.',
    pickup: 'Av. Eduardo Mondlane, 123',
    dropoff: 'Av. 24 de Julho, 567',
    distance: '3.1 km',
    earnings: 110,
  },
  {
    id: 'D-003',
    restaurant: 'Sushi Master',
    customer: 'Joao P.',
    pickup: 'Av. Mao Tse Tung, 234',
    dropoff: 'Rua do Bagamoyo, 45',
    distance: '4.2 km',
    earnings: 135,
  },
];

export default function DriverPage() {
  const { driverOnline, setDriverOnline, activeDelivery, setActiveDelivery } = useStore();
  const [deliveryStep, setDeliveryStep] = useState<'pickup' | 'delivering' | null>(null);
  const [completedToday, setCompletedToday] = useState(8);
  const [earningsToday, setEarningsToday] = useState(680);

  const currentDelivery = availableDeliveries.find(d => d.id === activeDelivery);

  const handleAcceptDelivery = (id: string) => {
    setActiveDelivery(id);
    setDeliveryStep('pickup');
  };

  const handlePickedUp = () => {
    setDeliveryStep('delivering');
  };

  const handleDelivered = () => {
    if (currentDelivery) {
      setEarningsToday(prev => prev + currentDelivery.earnings);
      setCompletedToday(prev => prev + 1);
    }
    setActiveDelivery(null);
    setDeliveryStep(null);
  };

  return (
    <div>
      {/* Online Toggle */}
      <div className="card p-4 mb-4 flex items-center justify-between">
        <div>
          <p className="font-semibold text-gray-900 text-sm">
            {driverOnline ? 'Esta online' : 'Esta offline'}
          </p>
          <p className="text-xs text-gray-500">
            {driverOnline ? 'A receber pedidos de entrega' : 'Fique online para receber entregas'}
          </p>
        </div>
        <button
          onClick={() => setDriverOnline(!driverOnline)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${
            driverOnline
              ? 'bg-secondary-500 text-white shadow-lg shadow-secondary-200'
              : 'bg-gray-200 text-gray-600'
          }`}
        >
          <Power className="w-4 h-4" />
          {driverOnline ? 'Online' : 'Offline'}
        </button>
      </div>

      {!driverOnline ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Power className="w-8 h-8 text-gray-300" />
          </div>
          <h2 className="font-bold text-gray-700 mb-1">Esta offline</h2>
          <p className="text-sm text-gray-500">Fique online para comecar a receber entregas</p>
        </div>
      ) : (
        <>
          {/* Today Stats */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {[
              { label: 'Entregas', value: completedToday.toString(), icon: Package, color: 'text-blue-500' },
              { label: 'Ganhos', value: `${earningsToday} MT`, icon: DollarSign, color: 'text-secondary-500' },
              { label: 'Horas', value: '4.5h', icon: Clock, color: 'text-primary-500' },
              { label: 'Rating', value: '4.9', icon: Star, color: 'text-yellow-500' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="card p-3 text-center">
                <Icon className={`w-4 h-4 ${color} mx-auto mb-1`} />
                <p className="text-xs font-bold text-gray-900">{value}</p>
                <p className="text-[9px] text-gray-500">{label}</p>
              </div>
            ))}
          </div>

          {/* Active Delivery */}
          {currentDelivery && deliveryStep && (
            <div className="card p-4 mb-6 border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-secondary-600">
                  {deliveryStep === 'pickup' ? 'A caminho do restaurante' : 'Entregando ao cliente'}
                </span>
              </div>

              {/* Map placeholder */}
              <div className="h-32 bg-gradient-to-br from-blue-50 to-secondary-50 rounded-xl flex items-center justify-center mb-4">
                <div className="text-center">
                  <Navigation className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                  <p className="text-[10px] text-gray-600">Navegacao GPS ativa</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className={`flex items-start gap-3 ${deliveryStep === 'delivering' ? 'opacity-50' : ''}`}>
                  <div className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-primary-500 rounded-full" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500">Recolher em</p>
                    <p className="text-sm font-medium text-gray-900">{currentDelivery.restaurant}</p>
                    <p className="text-xs text-gray-500">{currentDelivery.pickup}</p>
                  </div>
                </div>
                <div className={`flex items-start gap-3 ${deliveryStep === 'pickup' ? 'opacity-50' : ''}`}>
                  <div className="w-5 h-5 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-3 h-3 text-secondary-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500">Entregar em</p>
                    <p className="text-sm font-medium text-gray-900">{currentDelivery.customer}</p>
                    <p className="text-xs text-gray-500">{currentDelivery.dropoff}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {deliveryStep === 'pickup' ? (
                  <button
                    onClick={handlePickedUp}
                    className="flex-1 bg-primary-500 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" /> Recolhi o pedido
                  </button>
                ) : (
                  <button
                    onClick={handleDelivered}
                    className="flex-1 bg-secondary-500 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-secondary-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" /> Confirmar entrega
                  </button>
                )}
                <button className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center hover:bg-blue-100">
                  <Phone className="w-4 h-4 text-blue-500" />
                </button>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs text-gray-500">
                <span>{currentDelivery.distance}</span>
                <span className="font-semibold text-secondary-600">+{currentDelivery.earnings} MT</span>
              </div>
            </div>
          )}

          {/* Available Deliveries */}
          {!activeDelivery && (
            <div>
              <h3 className="font-semibold text-gray-900 text-sm mb-3">
                Entregas disponiveis ({availableDeliveries.length})
              </h3>
              <div className="space-y-3">
                {availableDeliveries.map((delivery) => (
                  <div key={delivery.id} className="card p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{delivery.restaurant}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{delivery.customer}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-secondary-600 text-sm">+{delivery.earnings} MT</p>
                        <p className="text-xs text-gray-400">{delivery.distance}</p>
                      </div>
                    </div>
                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full flex-shrink-0" />
                        <span className="truncate">{delivery.pickup}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <div className="w-1.5 h-1.5 bg-secondary-500 rounded-full flex-shrink-0" />
                        <span className="truncate">{delivery.dropoff}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAcceptDelivery(delivery.id)}
                      className="w-full bg-blue-500 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-blue-600 transition-colors"
                    >
                      Aceitar entrega
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
