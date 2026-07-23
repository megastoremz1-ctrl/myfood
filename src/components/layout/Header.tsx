'use client';

import Link from 'next/link';
import { MapPin, ShoppingBag, User, Search, Menu } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useState } from 'react';

export default function Header() {
  const { selectedAddress, getCartCount } = useStore();
  const cartCount = getCartCount();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              My<span className="text-primary-500">Food</span>
            </span>
          </Link>

          {/* Address - Desktop */}
          <div className="hidden md:flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors max-w-xs">
            <MapPin className="w-4 h-4 text-primary-500 flex-shrink-0" />
            <span className="text-sm text-gray-700 truncate">{selectedAddress}</span>
          </div>

          {/* Search - Desktop */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="O que vai comer hoje?"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border-0 focus:bg-white focus:ring-2 focus:ring-primary-100 text-sm transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Link
              href="/carrinho"
              className="relative p-2.5 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <ShoppingBag className="w-5 h-5 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              href="/perfil"
              className="hidden sm:flex p-2.5 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <User className="w-5 h-5 text-gray-700" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2.5 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="O que vai comer hoje?"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border-0 focus:bg-white focus:ring-2 focus:ring-primary-100 text-sm transition-all"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-100 py-3 px-4 space-y-2">
          <Link href="/perfil" className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-xl">
            <User className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-700">Perfil</span>
          </Link>
          <Link href="/parceiro" className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-xl">
            <span className="text-sm text-gray-700">MyFood Partner</span>
          </Link>
          <Link href="/motorista" className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-xl">
            <span className="text-sm text-gray-700">MyFood Driver</span>
          </Link>
          <Link href="/admin" className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-xl">
            <span className="text-sm text-gray-700">Admin</span>
          </Link>
        </div>
      )}
    </header>
  );
}
