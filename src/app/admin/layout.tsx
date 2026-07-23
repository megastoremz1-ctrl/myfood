'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Users, Store, Bike, Package, Tag, AlertCircle, DollarSign, MapPin, Bell, Settings, Home } from 'lucide-react';

const sidebarItems = [
  { href: '/admin', icon: BarChart3, label: 'Dashboard' },
  { href: '/admin/clientes', icon: Users, label: 'Clientes' },
  { href: '/admin/restaurantes', icon: Store, label: 'Restaurantes' },
  { href: '/admin/entregadores', icon: Bike, label: 'Entregadores' },
  { href: '/admin/pedidos', icon: Package, label: 'Pedidos' },
  { href: '/admin/promocoes', icon: Tag, label: 'Promocoes' },
  { href: '/admin/reclamacoes', icon: AlertCircle, label: 'Reclamacoes' },
  { href: '/admin/financeiro', icon: DollarSign, label: 'Financeiro' },
  { href: '/admin/cidades', icon: MapPin, label: 'Cidades' },
  { href: '/admin/notificacoes', icon: Bell, label: 'Notificacoes' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden lg:block w-56 min-h-screen bg-white border-r border-gray-100 sticky top-0 self-start">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <div>
              <span className="font-bold text-gray-900 text-sm">MyFood</span>
              <p className="text-[10px] text-gray-500">Admin Panel</p>
            </div>
          </div>

          <nav className="space-y-0.5">
            {sidebarItems.map(({ href, icon: Icon, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50">
              <Home className="w-4 h-4" /> Portal
            </Link>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-auto">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 sticky top-0 z-50">
          <div className="flex items-center justify-between">
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">M</span>
              </div>
              <span className="font-bold text-gray-900 text-sm">Admin</span>
            </div>
            <div className="hidden lg:block">
              <h1 className="text-sm font-semibold text-gray-900">
                {sidebarItems.find(i => i.href === pathname)?.label || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/" className="lg:hidden p-2 hover:bg-gray-50 rounded-xl text-gray-500">
                <Home className="w-5 h-5" />
              </Link>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-purple-600">AD</span>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile nav */}
        <div className="lg:hidden overflow-x-auto no-scrollbar bg-white border-b border-gray-100 px-4 py-2">
          <div className="flex gap-1">
            {sidebarItems.slice(0, 6).map(({ href, icon: Icon, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                    isActive ? 'bg-purple-50 text-purple-600' : 'text-gray-500'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>

        <main className="p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
