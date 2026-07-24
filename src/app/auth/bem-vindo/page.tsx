'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ShoppingBag, Bell, Heart, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';

const features = [
  { icon: ShoppingBag, title: 'Peca dos melhores restaurantes', desc: 'Centenas de opcoes em Maputo' },
  { icon: Bell, title: 'Rastreamento em tempo real', desc: 'Saiba exactamente onde esta o seu pedido' },
  { icon: Heart, title: 'Guarde os seus favoritos', desc: 'Acesso rapido aos restaurantes preferidos' },
  { icon: MapPin, title: 'Entrega ate si', desc: 'Em casa, no trabalho, onde estiver' },
];

export default function WelcomePage() {
  const router = useRouter();
  const { profile } = useAuth();
  const [step, setStep] = useState(0);

  const firstName = profile?.name?.split(' ')[0] || 'utilizador';

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        {step === 0 && (
          <div className="space-y-6 animate-fade-in">
            {/* Celebration */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-primary-200">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary-500 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{ right: 'calc(50% - 60px)' }}>
                <Check className="w-4 h-4 text-white" />
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Bem-vindo, {firstName}! 🎉
              </h1>
              <p className="text-gray-500 mt-2">
                A sua conta MyFood esta pronta. Vamos descobrir o que pode fazer!
              </p>
            </div>

            <button
              onClick={() => setStep(1)}
              className="btn-primary w-full flex items-center justify-center gap-2 text-base"
            >
              Continuar <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-gray-900">O que pode fazer no MyFood</h2>

            <div className="space-y-3 text-left">
              {features.map(({ icon: Icon, title, desc }, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => router.push('/cliente')}
                className="btn-primary w-full flex items-center justify-center gap-2 text-base"
              >
                <ShoppingBag className="w-5 h-5" /> Comecar a pedir!
              </button>
              <p className="text-xs text-gray-400">
                Use o codigo <span className="font-mono font-semibold text-primary-500">BEMVINDO</span> para entrega gratis no primeiro pedido
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
