'use client';

import { useState } from 'react';
import {
  Power, Navigation, DollarSign, Clock, Package, MapPin, Phone,
  Star, TrendingUp, CheckCircle, ChevronRight, Bike, History, Wallet
} from 'lucide-react';

const deliveries = [
  {
    id: 'D-001',
    restaurant: "Mundo's Restaurant",
    customer: 'António M.',
    pickup: 'Av. Julius Nyerere, 456',
    dropoff: 'Rua da Resistência, 789',
    distance: '2.3 km',
    earnings: 85,
    status: 'available',
  },
  {
    id: 'D-002',
    restaurant: 'Pizza House Maputo',
    customer: 'Maria S.',
    pickup: 'Av. Eduardo Mondlane, 123',
    dropoff: 'Av. 24 de Julho, 567',
    distance: '3.1 km',
    earnings: 110,
    status: 'available',
  },
];

const todayStats = [
  { label: 'Entregas', value: '8', icon: Package, color: 'text-blue-500' },
  { label: 'Ganhos', value: '680 MT', icon: DollarSign, color: 'text-secondary-500' },
  { label: 'Horas', value: '4.5h', icon: Clock, color: 'text-primary-500' },
  { label: 'Avaliação', value: '4.9', icon: Star, color: 'text-yellow-500' },
];

const recentDeliveries = [
  { id: 'R-001', restaurant: 'Café Central', time: '14:30', earnings: 65, rating: 5 },
  { id: 'R-002', restaurant: 'Sushi Master', time: '13:15', earnings: 120, rating: 5 },
  { id: 'R-003', restaurant: 'Frango Piri-Piri', time: '12:00', earnings: 75, rating: 4 },
  { id: 'R-004', restaurant: "Mundo's Restaurant", time: '11:20', earnings: 90, rating: 5 },
];

export default function DriverPage() {
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState('deliveries');
  const [currentDelivery, setCurrentDelivery] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Driver Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-full flex items-center justify-center">
                <Bike className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-sm">MyFood Driver</h1>
                <p className="text-xs text-gray-500">Carlos Muthemba</p>
              </div>
            </div>

            {/* Online Toggle */}
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                isOnline
                  ? 'bg-secondary-500 text-white shadow-lg shadow-secondary-200'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              <Power className="w-4 h-4" />
              {isOnline ? 'Online' : 'Offline'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Status Banner */}
        {!isOnline && (
          <div className="bg-gray-100 rounded-2xl p-6 text-center mb-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <Power className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="font-bold text-gray-700 mb-1">Está offline</h2>
            <p className="text-sm text-gray-500">Fique online para receber entregas</p>
          </div>
        )}

        {isOnline && (
          <>
            {/* Today Stats */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {todayStats.map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="card p-3 text-center">
                  <Icon className={`w-4 h-4 ${color} mx-auto mb-1`} />
                  <p className="text-sm font-bold text-gray-900">{value}</p>
                  <p className="text-[10px] text-gray-500">{label}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4">
              {[
                { id: 'deliveries', label: 'Entregas', icon: Package },
                { id: 'history', label: 'Histórico', icon: History },
                { id: 'earnings', label: 'Ganhos', icon: Wallet },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    activeTab === id
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>

            {activeTab === 'deliveries' && (
              <>
                {currentDelivery ? (
                  /* Active Delivery */
                  <div className="card p-4 mb-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse" />
                      <span className="text-sm font-semibold text-secondary-600">Entrega em progresso</span>
                    </div>

                    {/* Map Placeholder */}
                    <div className="h-40 bg-gradient-to-br from-secondary-50 to-blue-50 rounded-xl flex items-center justify-center mb-4">
                      <div className="text-center">
                        <Navigation className="w-8 h-8 text-secondary-500 mx-auto mb-2" />
                        <p className="text-xs text-gray-600">Navegação GPS ativa</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 bg-primary-500 rounded-full" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Recolher em</p>
                          <p className="text-sm font-medium text-gray-900">Mundo&apos;s Restaurant</p>
                          <p className="text-xs text-gray-500">Av. Julius Nyerere, 456</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <MapPin className="w-3 h-3 text-secondary-500" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Entregar em</p>
                          <p className="text-sm font-medium text-gray-900">António M.</p>
                          <p className="text-xs text-gray-500">Rua da Resistência, 789</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 bg-secondary-500 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-secondary-600 transition-colors flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Confirmar entrega
                      </button>
                      <button className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center hover:bg-blue-100 transition-colors">
                        <Phone className="w-4 h-4 text-blue-500" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Available Deliveries */
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 text-sm">Entregas disponíveis</h3>
                    {deliveries.map((delivery) => (
                      <div key={delivery.id} className="card p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{delivery.restaurant}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{delivery.customer}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-secondary-600 text-sm">{delivery.earnings} MT</p>
                            <p className="text-xs text-gray-400">{delivery.distance}</p>
                          </div>
                        </div>

                        <div className="space-y-2 mb-3">
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <div className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                            <span className="truncate">{delivery.pickup}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <div className="w-1.5 h-1.5 bg-secondary-500 rounded-full" />
                            <span className="truncate">{delivery.dropoff}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => setCurrentDelivery(delivery.id)}
                          className="w-full bg-primary-500 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-primary-600 transition-colors"
                        >
                          Aceitar entrega
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'history' && (
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 text-sm mb-3">Entregas de hoje</h3>
                {recentDeliveries.map((d) => (
                  <div key={d.id} className="card p-3 flex items-center gap-3">
                    <div className="w-9 h-9 bg-secondary-50 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-secondary-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{d.restaurant}</p>
                      <p className="text-xs text-gray-500">{d.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{d.earnings} MT</p>
                      <div className="flex items-center gap-0.5 justify-end">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs text-gray-600">{d.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'earnings' && (
              <div>
                {/* Earnings Summary */}
                <div className="card p-6 text-center mb-4">
                  <p className="text-sm text-gray-500 mb-1">Ganhos de hoje</p>
                  <p className="text-3xl font-bold text-gray-900">680 MT</p>
                  <p className="text-xs text-secondary-600 mt-1 flex items-center justify-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +15% vs ontem
                  </p>
                </div>

                <div className="card p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Esta semana</span>
                    <span className="font-bold text-gray-900">3.450 MT</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Este mês</span>
                    <span className="font-bold text-gray-900">14.200 MT</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Disponível para levantamento</span>
                    <span className="font-bold text-secondary-600">10.800 MT</span>
                  </div>
                  <button className="w-full bg-secondary-500 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-secondary-600 transition-colors mt-2">
                    Levantar fundos
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
