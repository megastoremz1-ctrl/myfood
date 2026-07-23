'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, Menu, Tag, BarChart3, History, Settings, ChefHat, Bell, Home } from 'lucide-react';

const sidebarItems = [
  { href: '/parceiro', icon: Package, label: 'Pedidos' },
  { href: '/parceiro/menu', icon: Menu, label: 'Menu' },
  { href: '/parceiro/promocoes', icon: Tag, label: 'Promocoes' },
  { href: '/parceiro/relatorios', icon: BarChart3, label: 'Relatorios' },
  { href: '/parceiro/financeiro', icon: History, label: 'Financeiro' },
  { href: '/parceiro/definicoes', icon: Settings, label: 'Definicoes' },
];

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-partner.svg" alt="MyFood Partner" className="h-9" />
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="p-2 hover:bg-gray-50 rounded-xl text-gray-500 hover:text-gray-700" title="Portal">
              <Home className="w-5 h-5" />
            </Link>
            <button className="relative p-2 hover:bg-gray-50 rounded-xl">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-secondary-600">MR</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-52 min-h-[calc(100vh-57px)] bg-white border-r border-gray-100 p-3 sticky top-[57px] self-start">
          <nav className="space-y-1">
            {sidebarItems.map(({ href, icon: Icon, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? 'bg-secondary-50 text-secondary-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Bottom Nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100">
          <div className="flex items-center justify-around h-14 px-2">
            {sidebarItems.slice(0, 5).map(({ href, icon: Icon, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex flex-col items-center justify-center px-2 py-1 rounded-lg ${
                    isActive ? 'text-secondary-500' : 'text-gray-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[9px] font-medium mt-0.5">{label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 pb-20 lg:pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}
