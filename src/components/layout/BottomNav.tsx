'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react';
import { useStore } from '@/store/useStore';

const navItems = [
  { href: '/cliente', icon: Home, label: 'Inicio' },
  { href: '/cliente/pesquisa', icon: Search, label: 'Pesquisar' },
  { href: '/cliente/carrinho', icon: ShoppingBag, label: 'Carrinho' },
  { href: '/cliente/favoritos', icon: Heart, label: 'Favoritos' },
  { href: '/cliente/perfil', icon: User, label: 'Perfil' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { getCartCount } = useStore();
  const cartCount = getCartCount();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== '/cliente' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center space-y-0.5 px-3 py-1 rounded-xl transition-colors relative ${
                isActive ? 'text-primary-500' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'fill-primary-100' : ''}`} />
              <span className="text-[10px] font-medium">{label}</span>
              {label === 'Carrinho' && cartCount > 0 && (
                <span className="absolute -top-1 right-0 w-4 h-4 bg-primary-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
