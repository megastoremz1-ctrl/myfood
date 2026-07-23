'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react';
import { useStore } from '@/store/useStore';

const navItems = [
  { href: '/', icon: Home, label: 'Início' },
  { href: '/pesquisa', icon: Search, label: 'Pesquisar' },
  { href: '/carrinho', icon: ShoppingBag, label: 'Carrinho' },
  { href: '/favoritos', icon: Heart, label: 'Favoritos' },
  { href: '/perfil', icon: User, label: 'Perfil' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { getCartCount } = useStore();
  const cartCount = getCartCount();

  // Hide bottom nav on partner, driver, and admin pages
  if (pathname.startsWith('/parceiro') || pathname.startsWith('/motorista') || pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center space-y-1 px-3 py-1 rounded-xl transition-colors relative ${
                isActive ? 'text-primary-500' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon className="w-5 h-5" />
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
