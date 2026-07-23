'use client';

import { create } from 'zustand';
import { CartItem, MenuItem, Extra } from '@/data/mock';

interface AppState {
  // Cart
  cart: CartItem[];
  addToCart: (item: MenuItem, quantity: number, extras: Extra[], removed: string[], notes: string) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;

  // Order tracking
  currentOrder: {
    id: string;
    status: 'confirmed' | 'preparing' | 'on_the_way' | 'delivered';
    estimatedTime: number;
    restaurant: string;
  } | null;
  setCurrentOrder: (order: AppState['currentOrder']) => void;

  // UI State
  selectedAddress: string;
  setSelectedAddress: (address: string) => void;

  // Coupon
  coupon: string;
  couponDiscount: number;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;

  // Tip
  tip: number;
  setTip: (tip: number) => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Cart
  cart: [],
  addToCart: (item, quantity, extras, removed, notes) => {
    const cartItem: CartItem = {
      id: `${item.id}-${Date.now()}`,
      menuItem: item,
      quantity,
      extras,
      removed,
      notes,
    };
    set((state) => ({ cart: [...state.cart, cartItem] }));
  },
  removeFromCart: (id) => {
    set((state) => ({ cart: state.cart.filter((item) => item.id !== id) }));
  },
  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(id);
      return;
    }
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    }));
  },
  clearCart: () => set({ cart: [] }),
  getCartTotal: () => {
    const state = get();
    const subtotal = state.cart.reduce((total, item) => {
      const extrasTotal = item.extras.reduce((sum, extra) => sum + extra.price, 0);
      return total + (item.menuItem.price + extrasTotal) * item.quantity;
    }, 0);
    return subtotal - state.couponDiscount + state.tip;
  },
  getCartCount: () => {
    return get().cart.reduce((count, item) => count + item.quantity, 0);
  },

  // Order tracking
  currentOrder: null,
  setCurrentOrder: (order) => set({ currentOrder: order }),

  // UI State
  selectedAddress: 'Av. Julius Nyerere, 1234, Maputo',
  setSelectedAddress: (address) => set({ selectedAddress: address }),

  // Coupon
  coupon: '',
  couponDiscount: 0,
  applyCoupon: (code) => {
    if (code.toUpperCase() === 'BEMVINDO') {
      set({ coupon: code, couponDiscount: 100 });
    } else if (code.toUpperCase() === 'PIZZA30') {
      set({ coupon: code, couponDiscount: 150 });
    }
  },
  removeCoupon: () => set({ coupon: '', couponDiscount: 0 }),

  // Tip
  tip: 0,
  setTip: (tip) => set({ tip }),
}));
