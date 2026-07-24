'use client';

import Link from 'next/link';
import { ShoppingBag, ChefHat, Bike, Shield, ArrowRight } from 'lucide-react';

const panels = [
  {
    href: '/cliente',
    icon: ShoppingBag,
    title: 'MyFood',
    subtitle: 'App do Cliente',
    description: 'Peça comida dos melhores restaurantes de Moçambique',
    color: 'from-primary-500 to-primary-600',
    iconBg: 'bg-primary-100',
    iconColor: 'text-primary-600',
  },
  {
    href: '/parceiro',
    icon: ChefHat,
    title: 'MyFood Business',
    subtitle: 'Painel do Negocio',
    description: 'Gira pedidos, menu, promoções e relatórios do seu restaurante',
    color: 'from-secondary-500 to-secondary-600',
    iconBg: 'bg-secondary-100',
    iconColor: 'text-secondary-600',
    authLink: '/auth/parceiro',
  },
  {
    href: '/motorista',
    icon: Bike,
    title: 'MyFood Driver',
    subtitle: 'App do Entregador',
    description: 'Aceite entregas, navegue com GPS e controle os seus ganhos',
    color: 'from-blue-500 to-blue-600',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    authLink: '/auth/motorista',
  },
  {
    href: '/admin',
    icon: Shield,
    title: 'MyFood Admin',
    subtitle: 'Painel Administrativo',
    description: 'Visão completa da plataforma: clientes, restaurantes, finanças',
    color: 'from-purple-500 to-purple-600',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
];

export default function PortalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Logo & Header */}
        <div className="text-center mb-10">
          <img src="/logo-icon.svg" alt="MyFood" className="w-16 h-16 rounded-2xl mx-auto mb-4 shadow-lg shadow-primary-200" />
          <h1 className="text-3xl font-bold text-gray-900">
            My<span className="text-primary-500">Food</span>
          </h1>
          <p className="text-gray-500 mt-2 text-lg">A comida que voce ama, entregue onde estiver.</p>
          <p className="text-gray-400 text-sm mt-1">Selecione um painel para continuar</p>
        </div>

        {/* Panel Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {panels.map((panel) => {
            const Icon = panel.icon;
            return (
              <Link
                key={panel.href}
                href={panel.href}
                className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:border-gray-200 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${panel.iconBg} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${panel.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-gray-900 text-lg">{panel.title}</h2>
                    <p className="text-sm font-medium text-gray-500 -mt-0.5">{panel.subtitle}</p>
                    <p className="text-sm text-gray-400 mt-2 leading-relaxed">{panel.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all mt-1" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-8">
          MyFood &copy; 2026 - Plataforma de entregas para Mocambique
        </p>
      </div>
    </div>
  );
}
