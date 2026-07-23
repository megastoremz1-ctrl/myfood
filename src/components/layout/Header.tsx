'use client';

import Link from 'next/link';
import { MapPin, ShoppingBag, Bell, Search, ChevronDown } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useState } from 'react';

export default function Header() {
  const { selectedAddress, getCartCount, addresses, setSelectedAddress, notifications } = useStore();
  const cartCount = getCartCount();
  const unreadNotifications = notifications.filter((n) => !n.read).length;
  const [showAddresses, setShowAddresses] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/cliente" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-lg font-bold text-gray-900 hidden sm:block">
              My<span className="text-primary-500">Food</span>
            </span>
          </Link>

          {/* Address Selector */}
          <div className="relative">
            <button
              onClick={() => setShowAddresses(!showAddresses)}
              className="flex items-center space-x-1.5 bg-gray-50 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors max-w-[200px] sm:max-w-xs"
            >
              <MapPin className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-gray-700 truncate">{selectedAddress}</span>
              <ChevronDown className="w-3 h-3 text-gray-400 flex-shrink-0" />
            </button>

            {showAddresses && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowAddresses(false)} />
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-2">
                  <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Entregar em</p>
                  {addresses.map((addr) => (
                    <button
                      key={addr.id}
                      onClick={() => {
                        setSelectedAddress(addr.address);
                        setShowAddresses(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 ${
                        selectedAddress === addr.address ? 'bg-primary-50' : ''
                      }`}
                    >
                      <MapPin className={`w-4 h-4 flex-shrink-0 ${selectedAddress === addr.address ? 'text-primary-500' : 'text-gray-400'}`} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900">{addr.label}</p>
                        <p className="text-xs text-gray-500 truncate">{addr.address}</p>
                      </div>
                      {addr.isDefault && (
                        <span className="text-[10px] bg-primary-100 text-primary-600 px-1.5 py-0.5 rounded-full font-medium ml-auto">Padrao</span>
                      )}
                    </button>
                  ))}
                  <Link
                    href="/cliente/perfil?tab=addresses"
                    onClick={() => setShowAddresses(false)}
                    className="block px-4 py-2.5 text-sm text-primary-500 font-medium hover:bg-gray-50 border-t border-gray-100 mt-1"
                  >
                    + Adicionar endereco
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Search - Desktop */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-4">
            <Link href="/cliente/pesquisa" className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <div className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl text-sm text-gray-400 cursor-pointer hover:bg-gray-100 transition-colors">
                O que vai comer hoje?
              </div>
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-1">
            <Link
              href="/cliente/notificacoes"
              className="relative p-2 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadNotifications > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </Link>
            <Link
              href="/cliente/carrinho"
              className="relative p-2 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <ShoppingBag className="w-5 h-5 text-gray-600" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-primary-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden pb-3">
          <Link href="/cliente/pesquisa" className="relative block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <div className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm text-gray-400 hover:bg-gray-100 transition-colors">
              O que vai comer hoje?
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
