'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, ChefHat, Bike, MapPin, Phone, MessageCircle } from 'lucide-react';
import { useStore } from '@/store/useStore';

const steps = [
  { id: 'confirmed', label: 'Restaurante confirmou', icon: Check, description: 'O seu pedido foi aceite' },
  { id: 'preparing', label: 'Está preparando', icon: ChefHat, description: 'A cozinha está a preparar a sua comida' },
  { id: 'on_the_way', label: 'Entregador a caminho', icon: Bike, description: 'O entregador está a caminho' },
  { id: 'delivered', label: 'Entregue', icon: MapPin, description: 'Pedido entregue com sucesso!' },
];

export default function TrackingPage() {
  const { currentOrder, setCurrentOrder } = useStore();
  const [timeLeft, setTimeLeft] = useState(25);

  // Simulate order progression
  useEffect(() => {
    if (!currentOrder) return;

    const timers: NodeJS.Timeout[] = [];

    timers.push(
      setTimeout(() => {
        setCurrentOrder({ ...currentOrder, status: 'preparing', estimatedTime: 20 });
      }, 5000)
    );

    timers.push(
      setTimeout(() => {
        setCurrentOrder({ ...currentOrder, status: 'on_the_way', estimatedTime: 10 });
      }, 10000)
    );

    timers.push(
      setTimeout(() => {
        setCurrentOrder({ ...currentOrder, status: 'delivered', estimatedTime: 0 });
      }, 20000)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!currentOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">📦</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Nenhum pedido ativo</h2>
        <p className="text-gray-500 mb-6">Faça um pedido para rastrear em tempo real</p>
        <Link href="/" className="btn-primary inline-block">
          Fazer um pedido
        </Link>
      </div>
    );
  }

  const currentStepIndex = steps.findIndex((s) => s.id === currentOrder.status);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Rastreamento do pedido</h1>
        <p className="text-sm text-gray-500">Pedido #{currentOrder.id}</p>
      </div>

      {/* Map Placeholder */}
      <div className="card mb-6 overflow-hidden">
        <div className="h-48 sm:h-64 bg-gradient-to-br from-secondary-50 to-primary-50 flex items-center justify-center relative">
          <div className="text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
              {currentOrder.status === 'on_the_way' ? (
                <Bike className="w-8 h-8 text-primary-500 animate-bounce" />
              ) : currentOrder.status === 'delivered' ? (
                <Check className="w-8 h-8 text-secondary-500" />
              ) : (
                <ChefHat className="w-8 h-8 text-primary-500" />
              )}
            </div>
            <p className="text-sm font-medium text-gray-700">
              {currentOrder.status === 'on_the_way'
                ? 'Entregador a caminho'
                : currentOrder.status === 'delivered'
                ? 'Pedido entregue!'
                : 'Preparando o seu pedido'}
            </p>
            <p className="text-xs text-gray-500 mt-1">Mapa em tempo real</p>
          </div>
          {/* Animated dots for map simulation */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-primary-500 rounded-full animate-ping" />
            <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-secondary-500 rounded-full animate-ping delay-1000" />
            <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-primary-500 rounded-full animate-ping delay-500" />
          </div>
        </div>
      </div>

      {/* Estimated Time */}
      {currentOrder.status !== 'delivered' && (
        <div className="card p-4 mb-6 text-center">
          <p className="text-sm text-gray-500">Tempo estimado</p>
          <p className="text-3xl font-bold text-primary-500">{currentOrder.estimatedTime} min</p>
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
                {/* Icon and Line */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                      isCompleted
                        ? 'bg-secondary-500 text-white'
                        : 'bg-gray-100 text-gray-400'
                    } ${isCurrent ? 'ring-4 ring-secondary-100 scale-110' : ''}`}
                  >
                    <StepIcon className="w-5 h-5" />
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-0.5 h-12 ${
                        index < currentStepIndex ? 'bg-secondary-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>

                {/* Content */}
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

      {/* Driver Info (when on the way) */}
      {currentOrder.status === 'on_the_way' && (
        <div className="card p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xl">🛵</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-sm">Carlos M.</p>
              <p className="text-xs text-gray-500">Entregador MyFood</p>
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

      {/* Restaurant Info */}
      <div className="card p-4">
        <p className="text-xs text-gray-500 mb-1">Restaurante</p>
        <p className="font-semibold text-gray-900 text-sm">{currentOrder.restaurant}</p>
      </div>
    </div>
  );
}
