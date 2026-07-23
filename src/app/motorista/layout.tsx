'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, History, Wallet, Settings, Bike, Home } from 'lucide-react';

const tabs = [
  { href: '/motorista', icon: Package, label: 'Entregas' },
  { href: '/motorista/historico', icon: History, label: 'Historico' },
  { href: '/motorista/ganhos', icon: Wallet, label: 'Ganhos' },
  { href: '/motorista/definicoes', icon: Settings, label: 'Config' },
];

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Bike className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-sm">MyFood Driver</h1>
              <p className="text-[10px] text-gray-500">Carlos Muthemba</p>
            </div>
          </div>
          <Link href="/" className="p-2 hover:bg-gray-50 rounded-xl text-gray-500" title="Portal">
            <Home className="w-5 h-5" />
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 pb-20">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100">
        <div className="max-w-2xl mx-auto flex items-center justify-around h-14 px-2">
          {tabs.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center justify-center px-3 py-1 rounded-lg ${
                  isActive ? 'text-blue-500' : 'text-gray-400'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[9px] font-medium mt-0.5">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
