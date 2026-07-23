'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, ChefHat, Bike, MapPin, Phone, MessageCircle, Star, Home } from 'lucide-react';
import { useStore } from '@/store/useStore';

const steps = [
  { id: 'confirmed', label: 'Restaurante confirmou', icon: Check, description: 'O seu pedido foi aceite' },
  { id: 'preparing', label: 'Esta preparando', icon: ChefHat, description: 'A cozinha esta a preparar a sua comida' },
  { id: 'on_the_way', label: 'Entregador a caminho', icon: Bike, description: 'O entregador esta a caminho' },
  { id: 'delivered', label: 'Entregue', icon: MapPin, description: 'Pedido entregue com sucesso!' },
];

export default function TrackingPage() {
  const { currentOrder, setCurrentOrder } = useStore();
  const [rating, setRating] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  // Simulate order progression
  useEffect(() => {
    if (!currentOrder) return;
    const status = currentOrder.status;
    if (status === 'delivered') return;

    const timers: NodeJS.Timeout[] = [];

    if (status === 'confirmed') {
      timers.push(
        setTimeout(() => {
          setCurrentOrder({ ...currentOrder, status: 'preparing', estimatedTime: 18 });
        }, 6000)
      );
    }

    if (status === 'confirmed' || status === 'preparing') {
      timers.push(
        setTimeout(() => {
          setCurrentOrder({ ...currentOrder, status: 'on_the_way', estimatedTime: 8 });
        }, status === 'confirmed' ? 14000 : 8000)
      );
    }

    timers.push(
      setTimeout(() => {
        setCurrentOrder({ ...currentOrder, status: 'delivered', estimatedTime: 0 });
        setShowRating(true);
      }, status === 'confirmed' ? 24000 : status === 'preparing' ? 18000 : 10000)
    );

    return () => timers.forEach(clearTimeout);
  }, [currentOrder?.status]);

  // Elapsed timer
  useEffect(() => {
    if (!currentOrder || currentOrder.status === 'delivered') return;
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [currentOrder?.status]);

  if (!currentOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">📦</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Nenhum pedido ativo</h2>
        <p className="text-gray-500 mb-6">Faca um pedido para rastrear em tempo real</p>
        <Link href="/cliente" className="btn-primary inline-block">
          Fazer um pedido
        </Link>
      </div>
    );
  }

  const currentStepIndex = steps.findIndex((s) => s.id === currentOrder.status);
  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">
          {currentOrder.status === 'delivered' ? 'Pedido entregue!' : 'Rastreamento do pedido'}
        </h1>
        <p className="text-sm text-gray-500">Pedido #{currentOrder.id}</p>
      </div>

      {/* Map Placeholder */}
      <div className="card mb-6 overflow-hidden">
        <div className="h-48 sm:h-56 bg-gradient-to-br from-secondary-50 to-primary-50 flex items-center justify-center relative">
          <div className="text-center z-10">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
              {currentOrder.status === 'on_the_way' ? (
                <Bike className="w-8 h-8 text-primary-500 animate-bounce" />
              ) : currentOrder.status === 'delivered' ? (
                <Check className="w-8 h-8 text-secondary-500" />
              ) : currentOrder.status === 'preparing' ? (
                <ChefHat className="w-8 h-8 text-primary-500" />
              ) : (
                <Check className="w-8 h-8 text-blue-500" />
              )}
            </div>
            <p className="text-sm font-medium text-gray-700">
              {currentOrder.status === 'confirmed' && 'Pedido confirmado pelo restaurante'}
              {currentOrder.status === 'preparing' && 'A preparar o seu pedido...'}
              {currentOrder.status === 'on_the_way' && 'Entregador a caminho!'}
              {currentOrder.status === 'delivered' && 'Entregue com sucesso!'}
            </p>
          </div>
          {currentOrder.status !== 'delivered' && (
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-primary-500 rounded-full animate-ping" />
              <div className="absolute top-1/2 left-2/3 w-3 h-3 bg-secondary-500 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
              <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-primary-500 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
            </div>
          )}
        </div>
      </div>

      {/* Time */}
      {currentOrder.status !== 'delivered' ? (
        <div className="card p-4 mb-6 text-center">
          <p className="text-sm text-gray-500">Tempo estimado de entrega</p>
          <p className="text-3xl font-bold text-primary-500 mt-1">{currentOrder.estimatedTime} min</p>
          <p className="text-xs text-gray-400 mt-1">Tempo decorrido: {formatTime(elapsed)}</p>
        </div>
      ) : (
        <div className="card p-4 mb-6 text-center bg-secondary-50 border-secondary-200">
          <p className="text-secondary-700 font-semibold">Pedido entregue com sucesso!</p>
          <p className="text-xs text-secondary-600 mt-1">Tempo total: {formatTime(elapsed)}</p>
        </div>
      )}

      {/* Progress Steps */}
      <div className="card p-6 mb-6">
        <div className="space-y-0">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div key={step.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                      isCompleted
                        ? 'bg-secondary-500 text-white'
                        : 'bg-gray-100 text-gray-400'
                    } ${isCurrent ? 'ring-4 ring-secondary-100 scale-110' : ''}`}
                  >
                    <StepIcon className="w-5 h-5" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-0.5 h-12 transition-colors duration-500 ${
                      index < currentStepIndex ? 'bg-secondary-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
                <div className="pb-8">
                  <p className={`font-semibold text-sm ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                    {step.label}
                  </p>
                  <p className={`text-xs mt-0.5 ${isCompleted ? 'text-gray-500' : 'text-gray-300'}`}>
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Driver Info */}
      {currentOrder.status === 'on_the_way' && (
        <div className="card p-4 mb-6">
          <p className="text-xs text-gray-500 mb-3">O seu entregador</p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">CM</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-sm">Carlos Muthemba</p>
              <p className="text-xs text-gray-500">Moto - Honda PCX</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-xs text-gray-600">4.9</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center hover:bg-primary-100 transition-colors">
                <Phone className="w-4 h-4 text-primary-500" />
              </button>
              <button className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center hover:bg-primary-100 transition-colors">
                <MessageCircle className="w-4 h-4 text-primary-500" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details */}
      <div className="card p-4 mb-6">
        <p className="text-xs text-gray-500 mb-1">Restaurante</p>
        <p className="font-semibold text-gray-900 text-sm">{currentOrder.restaurant}</p>
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Entregar em</p>
          <p className="text-sm text-gray-700">{currentOrder.address}</p>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Total pago</p>
          <p className="font-bold text-gray-900">{currentOrder.total} MT</p>
        </div>
      </div>

      {/* Rating Modal */}
      {showRating && (
        <div className="card p-6 mb-6 text-center">
          <h3 className="font-bold text-gray-900 mb-2">Como foi a sua experiencia?</h3>
          <p className="text-sm text-gray-500 mb-4">Avalie o seu pedido</p>
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110"
              >
                <Star className={`w-8 h-8 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <button
              onClick={() => { setShowRating(false); setCurrentOrder(null); }}
              className="btn-primary w-full"
            >
              Enviar avaliacao
            </button>
          )}
        </div>
      )}

      {/* Back to home */}
      {currentOrder.status === 'delivered' && !showRating && (
        <Link href="/cliente" className="flex items-center justify-center gap-2 text-primary-500 font-medium py-3">
          <Home className="w-4 h-4" />
          Voltar ao inicio
        </Link>
      )}
    </div>
  );
}
