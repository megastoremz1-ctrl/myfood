'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, MenuItem, Extra, Restaurant, Order } from '@/data/mock';

interface Address {
  id: string;
  label: string;
  address: string;
  isDefault: boolean;
}

interface AppState {
  // Cart
  cart: CartItem[];
  cartRestaurant: Restaurant | null;
  addToCart: (item: MenuItem, quantity: number, extras: Extra[], removed: string[], notes: string, restaurant: Restaurant) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  getSubtotal: () => number;

  // Favorites
  favorites: string[];
  toggleFavorite: (restaurantId: string) => void;
  isFavorite: (restaurantId: string) => boolean;

  // Order tracking
  currentOrder: {
    id: string;
    status: 'confirmed' | 'preparing' | 'on_the_way' | 'delivered';
    estimatedTime: number;
    restaurant: string;
    items: CartItem[];
    total: number;
    paymentMethod: string;
    address: string;
  } | null;
  setCurrentOrder: (order: AppState['currentOrder']) => void;

  // Order history
  orderHistory: Order[];
  addToHistory: (order: Order) => void;

  // Addresses
  addresses: Address[];
  selectedAddress: string;
  setSelectedAddress: (address: string) => void;
  addAddress: (address: Address) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  // Coupon
  coupon: string;
  couponDiscount: number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;

  // Tip
  tip: number;
  setTip: (tip: number) => void;

  // Payment
  selectedPayment: string;
  setSelectedPayment: (method: string) => void;

  // Partner state
  partnerOrders: PartnerOrder[];
  updatePartnerOrderStatus: (id: string, status: string) => void;

  // Driver state
  driverOnline: boolean;
  setDriverOnline: (online: boolean) => void;
  activeDelivery: string | null;
  setActiveDelivery: (id: string | null) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
}

export interface PartnerOrder {
  id: string;
  customer: string;
  items: string;
  total: number;
  time: string;
  status: 'new' | 'accepted' | 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'rejected';
  phone: string;
  address: string;
  prepTime?: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'order' | 'promo' | 'system';
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Cart
      cart: [],
      cartRestaurant: null,
      addToCart: (item, quantity, extras, removed, notes, restaurant) => {
        const state = get();
        // If cart has items from different restaurant, clear first
        if (state.cartRestaurant && state.cartRestaurant.id !== restaurant.id) {
          set({ cart: [], cartRestaurant: restaurant });
        }
        const cartItem: CartItem = {
          id: `${item.id}-${Date.now()}`,
          menuItem: item,
          quantity,
          extras,
          removed,
          notes,
        };
        set((state) => ({
          cart: [...state.cart, cartItem],
          cartRestaurant: restaurant,
        }));
      },
      removeFromCart: (id) => {
        set((state) => {
          const newCart = state.cart.filter((item) => item.id !== id);
          return {
            cart: newCart,
            cartRestaurant: newCart.length === 0 ? null : state.cartRestaurant,
          };
        });
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
      clearCart: () => set({ cart: [], cartRestaurant: null }),
      getSubtotal: () => {
        return get().cart.reduce((total, item) => {
          const extrasTotal = item.extras.reduce((sum, extra) => sum + extra.price, 0);
          return total + (item.menuItem.price + extrasTotal) * item.quantity;
        }, 0);
      },
      getCartTotal: () => {
        const state = get();
        const subtotal = state.getSubtotal();
        const deliveryFee = state.cartRestaurant?.freeDelivery ? 0 : (state.cartRestaurant?.deliveryFee || 50);
        return subtotal - state.couponDiscount + state.tip + deliveryFee;
      },
      getCartCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },

      // Favorites
      favorites: [],
      toggleFavorite: (restaurantId) => {
        set((state) => ({
          favorites: state.favorites.includes(restaurantId)
            ? state.favorites.filter((id) => id !== restaurantId)
            : [...state.favorites, restaurantId],
        }));
      },
      isFavorite: (restaurantId) => get().favorites.includes(restaurantId),

      // Order tracking
      currentOrder: null,
      setCurrentOrder: (order) => set({ currentOrder: order }),

      // Order history
      orderHistory: [
        {
          id: 'ORD-1001',
          restaurant: "Mundo's Restaurant",
          items: [],
          total: 550,
          status: 'delivered',
          estimatedTime: 0,
          createdAt: '2026-07-22T14:30:00Z',
        },
        {
          id: 'ORD-1002',
          restaurant: 'Pizza House Maputo',
          items: [],
          total: 480,
          status: 'delivered',
          estimatedTime: 0,
          createdAt: '2026-07-20T12:15:00Z',
        },
        {
          id: 'ORD-1003',
          restaurant: 'Frango Piri-Piri',
          items: [],
          total: 430,
          status: 'delivered',
          estimatedTime: 0,
          createdAt: '2026-07-18T19:45:00Z',
        },
      ],
      addToHistory: (order) => {
        set((state) => ({ orderHistory: [order, ...state.orderHistory] }));
      },

      // Addresses
      addresses: [
        { id: 'a1', label: 'Casa', address: 'Av. Julius Nyerere, 1234, Maputo', isDefault: true },
        { id: 'a2', label: 'Trabalho', address: 'Av. Eduardo Mondlane, 567, Maputo', isDefault: false },
        { id: 'a3', label: 'Outro', address: 'Rua da Resistência, 89, Maputo', isDefault: false },
      ],
      selectedAddress: 'Av. Julius Nyerere, 1234, Maputo',
      setSelectedAddress: (address) => set({ selectedAddress: address }),
      addAddress: (address) => {
        set((state) => ({ addresses: [...state.addresses, address] }));
      },
      removeAddress: (id) => {
        set((state) => ({ addresses: state.addresses.filter((a) => a.id !== id) }));
      },
      setDefaultAddress: (id) => {
        set((state) => ({
          addresses: state.addresses.map((a) => ({
            ...a,
            isDefault: a.id === id,
          })),
          selectedAddress: state.addresses.find((a) => a.id === id)?.address || state.selectedAddress,
        }));
      },

      // Coupon
      coupon: '',
      couponDiscount: 0,
      applyCoupon: (code) => {
        const upper = code.toUpperCase();
        if (upper === 'BEMVINDO') {
          set({ coupon: code, couponDiscount: 100 });
          return true;
        } else if (upper === 'PIZZA30') {
          set({ coupon: code, couponDiscount: 150 });
          return true;
        } else if (upper === 'MYFOOD50') {
          set({ coupon: code, couponDiscount: 200 });
          return true;
        }
        return false;
      },
      removeCoupon: () => set({ coupon: '', couponDiscount: 0 }),

      // Tip
      tip: 0,
      setTip: (tip) => set({ tip }),

      // Payment
      selectedPayment: 'mpesa',
      setSelectedPayment: (method) => set({ selectedPayment: method }),

      // Partner state
      partnerOrders: [
        { id: 'P-001', customer: 'Antonio M.', items: 'Matapa com Camarao x1, Sumo de Mango x2', total: 610, time: '2 min', status: 'new', phone: '+258 84 123 4567', address: 'Av. Julius Nyerere, 1234' },
        { id: 'P-002', customer: 'Maria S.', items: 'Frango Piri-Piri x2, 2M Cerveja x2', total: 960, time: '5 min', status: 'new', phone: '+258 84 987 6543', address: 'Rua da Resistencia, 567' },
        { id: 'P-003', customer: 'Joao P.', items: 'Camarao Grelhado x1', total: 650, time: '8 min', status: 'preparing', phone: '+258 84 555 1234', address: 'Av. Eduardo Mondlane, 89', prepTime: 15 },
        { id: 'P-004', customer: 'Ana L.', items: 'Xima com Caril x1, Pudim x1', total: 440, time: '15 min', status: 'ready', phone: '+258 84 444 5678', address: 'Av. 24 de Julho, 234' },
        { id: 'P-005', customer: 'Carlos F.', items: 'Rissois de Camarao x3', total: 540, time: '25 min', status: 'delivered', phone: '+258 84 333 9876', address: 'Rua do Bagamoyo, 45' },
      ],
      updatePartnerOrderStatus: (id, status) => {
        set((state) => ({
          partnerOrders: state.partnerOrders.map((order) =>
            order.id === id ? { ...order, status: status as PartnerOrder['status'] } : order
          ),
        }));
      },

      // Driver state
      driverOnline: false,
      setDriverOnline: (online) => set({ driverOnline: online }),
      activeDelivery: null,
      setActiveDelivery: (id) => set({ activeDelivery: id }),

      // Notifications
      notifications: [
        { id: 'n1', title: 'Pedido entregue', message: 'O seu pedido #ORD-1001 foi entregue com sucesso!', time: '2h', read: true, type: 'order' },
        { id: 'n2', title: '30% OFF em Pizza!', message: 'Use o codigo PIZZA30 e ganhe desconto', time: '5h', read: false, type: 'promo' },
        { id: 'n3', title: 'Bem-vindo ao MyFood!', message: 'A sua conta foi criada. Use BEMVINDO para entrega gratis', time: '1d', read: true, type: 'system' },
      ],
      addNotification: (notification) => {
        set((state) => ({ notifications: [notification, ...state.notifications] }));
      },
      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },
    }),
    {
      name: 'myfood-storage',
      partialize: (state) => ({
        favorites: state.favorites,
        addresses: state.addresses,
        selectedAddress: state.selectedAddress,
        orderHistory: state.orderHistory,
        selectedPayment: state.selectedPayment,
        notifications: state.notifications,
      }),
    }
  )
);
