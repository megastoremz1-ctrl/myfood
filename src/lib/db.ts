/**
 * MyFood Database Service
 * 
 * Centralized data access layer. All Supabase queries go through here.
 * Falls back to mock data when DB is empty (for development).
 */

import { getSupabase } from './supabase';
import { restaurants as mockRestaurants, menuItems as mockMenuItems, categories as mockCategories, promotions as mockPromotions } from '@/data/mock';

// ==========================================
// CATEGORIES
// ==========================================

export async function getCategories() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('active', true)
    .order('sort_order');

  if (error || !data || data.length === 0) {
    // Fallback to mock
    return mockCategories;
  }

  return data.map((c: any) => ({
    id: c.id,
    name: c.name,
    icon: c.icon || '',
    slug: c.slug,
  }));
}

// ==========================================
// RESTAURANTS
// ==========================================

export async function getRestaurants(options?: {
  category?: string;
  search?: string;
  limit?: number;
}) {
  const supabase = getSupabase();
  let query = supabase
    .from('restaurants')
    .select(`
      *,
      restaurant_categories(category_id, categories(slug))
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.search) {
    query = query.ilike('name', `%${options.search}%`);
  }

  const { data, error } = await query;

  if (error || !data || data.length === 0) {
    // Fallback to mock - apply filters
    let filtered = mockRestaurants;
    if (options?.category) {
      filtered = filtered.filter(r => r.categories.includes(options.category!));
    }
    if (options?.search) {
      filtered = filtered.filter(r => r.name.toLowerCase().includes(options.search!.toLowerCase()));
    }
    return filtered;
  }

  return data.map((r: any) => ({
    id: r.id,
    name: r.name,
    image: r.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop',
    logo: r.logo_url || 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=100&h=100&fit=crop',
    rating: parseFloat(r.rating) || 0,
    reviews: r.total_reviews || 0,
    deliveryTime: `${r.delivery_time_min || 25}-${r.delivery_time_max || 45} min`,
    deliveryFee: parseFloat(r.delivery_fee) || 50,
    minOrder: parseFloat(r.min_order) || 200,
    isOpen: r.is_open,
    categories: r.restaurant_categories?.map((rc: any) => rc.categories?.slug).filter(Boolean) || [],
    distance: '1.5 km',
    freeDelivery: r.free_delivery,
    isNew: new Date(r.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    hasPromo: false,
  }));
}

export async function getRestaurantById(id: string) {
  // Check if ID is a valid UUID (DB uses UUIDs, mock uses "1", "2", etc.)
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  if (isUuid) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && data) {
      return {
        id: data.id,
        name: data.name,
        image: data.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop',
        logo: data.logo_url || 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=100&h=100&fit=crop',
        rating: parseFloat(data.rating) || 0,
        reviews: data.total_reviews || 0,
        deliveryTime: `${data.delivery_time_min || 25}-${data.delivery_time_max || 45} min`,
        deliveryFee: parseFloat(data.delivery_fee) || 50,
        minOrder: parseFloat(data.min_order) || 200,
        isOpen: data.is_open,
        categories: [],
        distance: '1.5 km',
        freeDelivery: data.free_delivery,
        isNew: false,
        hasPromo: false,
      };
    }
  }

  // Fallback to mock
  const mock = mockRestaurants.find(r => r.id === id);
  return mock || null;
}

// ==========================================
// MENU ITEMS
// ==========================================

export async function getMenuItems(restaurantId: string) {
  // Check if ID is UUID
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(restaurantId);

  if (isUuid) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('menu_items')
      .select(`
        *,
        menu_item_extras(*),
        menu_item_removables(*),
        menu_categories(name)
      `)
      .eq('restaurant_id', restaurantId)
      .eq('available', true)
      .order('sort_order');

    if (!error && data && data.length > 0) {
      return data.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        price: parseFloat(item.price),
        image: item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
        category: item.menu_categories?.name || 'Outros',
        extras: item.menu_item_extras?.map((e: any) => ({
          id: e.id,
          name: e.name,
          price: parseFloat(e.price),
        })) || [],
        removable: item.menu_item_removables?.map((r: any) => r.name) || [],
      }));
    }
  }

  // Fallback to mock
  return mockMenuItems;
}

// ==========================================
// ORDERS
// ==========================================

export async function createOrder(orderData: {
  restaurantId: string;
  items: Array<{
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
    extras: any[];
    removed: any[];
    notes: string;
  }>;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  tip: number;
  total: number;
  paymentMethod: string;
  couponCode?: string;
  deliveryAddress: string;
  notes?: string;
}) {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Nao autenticado' };

  // Check if restaurant ID is a valid UUID (mock data uses "1", "2", etc.)
  const isUuid = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  const restaurantIdValid = isUuid(orderData.restaurantId);

  // Create order
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({
      customer_id: user.id,
      restaurant_id: restaurantIdValid ? orderData.restaurantId : null,
      subtotal: orderData.subtotal,
      delivery_fee: orderData.deliveryFee,
      discount: orderData.discount,
      tip: orderData.tip,
      total: orderData.total,
      payment_method: orderData.paymentMethod,
      coupon_code: orderData.couponCode || null,
      delivery_address: orderData.deliveryAddress,
      notes: orderData.notes || null,
      status: 'confirmed',
      payment_status: 'paid',
      estimated_delivery_time: 25,
    })
    .select()
    .single();

  if (orderErr || !order) {
    return { success: false, error: orderErr?.message || 'Erro ao criar pedido' };
  }

  // Create order items (skip menu_item_id if not UUID)
  const orderItems = orderData.items.map(item => ({
    order_id: order.id,
    menu_item_id: isUuid(item.menuItemId) ? item.menuItemId : null,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    extras: JSON.stringify(item.extras),
    removed: JSON.stringify(item.removed),
    notes: item.notes,
  }));

  const { error: itemsErr } = await supabase.from('order_items').insert(orderItems);
  if (itemsErr) {
    console.error('Error creating order items:', itemsErr);
  }

  return { success: true, order };
}

export async function getUserOrders() {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      restaurants(name, logo_url),
      order_items(*)
    `)
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error || !data) return [];

  return data.map((o: any) => ({
    id: o.id,
    orderNumber: o.order_number,
    restaurant: o.restaurants?.name || 'Restaurante',
    restaurantLogo: o.restaurants?.logo_url,
    items: o.order_items || [],
    total: parseFloat(o.total),
    status: o.status,
    paymentMethod: o.payment_method,
    createdAt: o.created_at,
    deliveryAddress: o.delivery_address,
  }));
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);

  return !error;
}

// ==========================================
// FAVORITES
// ==========================================

export async function getUserFavorites() {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('favorites')
    .select('restaurant_id')
    .eq('user_id', user.id);

  if (error || !data) return [];
  return data.map((f: any) => f.restaurant_id);
}

export async function toggleFavorite(restaurantId: string) {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  // Check if exists
  const { data: existing } = await supabase
    .from('favorites')
    .select('restaurant_id')
    .eq('user_id', user.id)
    .eq('restaurant_id', restaurantId)
    .single();

  if (existing) {
    await supabase.from('favorites').delete()
      .eq('user_id', user.id)
      .eq('restaurant_id', restaurantId);
  } else {
    await supabase.from('favorites').insert({
      user_id: user.id,
      restaurant_id: restaurantId,
    });
  }
  return true;
}

// ==========================================
// ADDRESSES
// ==========================================

export async function getUserAddresses() {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false });

  if (error || !data) return [];
  return data;
}

export async function addUserAddress(address: { label: string; address: string; referencePoint?: string }) {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('addresses')
    .insert({
      user_id: user.id,
      label: address.label,
      address: address.address,
      reference_point: address.referencePoint || null,
    })
    .select()
    .single();

  if (error) return null;
  return data;
}

export async function deleteUserAddress(addressId: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from('addresses').delete().eq('id', addressId);
  return !error;
}

// ==========================================
// PROMOTIONS
// ==========================================

export async function getPromotions() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .eq('active', true)
    .order('sort_order');

  if (error || !data || data.length === 0) {
    return mockPromotions;
  }

  return data.map((p: any) => ({
    id: p.id,
    title: p.title,
    description: p.description || '',
    image: p.image_url || '',
    color: p.color || 'from-primary-500 to-primary-600',
  }));
}

// ==========================================
// COUPONS
// ==========================================

export async function validateCoupon(code: string): Promise<{ valid: boolean; discount: number; type: string } | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('active', true)
    .single();

  if (error || !data) return null;

  // Check usage limit
  if (data.max_uses && data.current_uses >= data.max_uses) return null;

  // Check validity dates
  if (data.valid_until && new Date(data.valid_until) < new Date()) return null;

  return {
    valid: true,
    discount: parseFloat(data.value),
    type: data.type,
  };
}

// ==========================================
// NOTIFICATIONS
// ==========================================

export async function getUserNotifications() {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error || !data) return [];
  return data;
}

export async function markNotificationAsRead(notificationId: string) {
  const supabase = getSupabase();
  await supabase.from('notifications').update({ read: true }).eq('id', notificationId);
}

// ==========================================
// REVIEWS
// ==========================================

export async function createReview(data: {
  orderId: string;
  restaurantId: string;
  driverId?: string;
  restaurantRating: number;
  driverRating?: number;
  comment?: string;
}) {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase.from('reviews').insert({
    order_id: data.orderId,
    customer_id: user.id,
    restaurant_id: data.restaurantId,
    driver_id: data.driverId || null,
    restaurant_rating: data.restaurantRating,
    driver_rating: data.driverRating || null,
    comment: data.comment || null,
  });

  return !error;
}



// ==========================================
// BUSINESS PANEL - Restaurant Orders
// ==========================================

export async function getRestaurantOrders(restaurantId?: string) {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  let query = supabase
    .from('orders')
    .select(`
      *,
      profiles!orders_customer_id_fkey(full_name, phone),
      order_items(*)
    `)
    .order('created_at', { ascending: false })
    .limit(50);

  if (restaurantId) {
    query = query.eq('restaurant_id', restaurantId);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  return data.map((o: any) => ({
    id: o.id,
    orderNumber: o.order_number,
    customer: o.profiles?.full_name || 'Cliente',
    phone: o.profiles?.phone || '',
    items: o.order_items?.map((i: any) => `${i.name} x${i.quantity}`).join(', ') || '',
    total: parseFloat(o.total),
    status: o.status,
    paymentMethod: o.payment_method,
    address: o.delivery_address || '',
    createdAt: o.created_at,
    estimatedTime: o.estimated_delivery_time,
  }));
}

export async function getMyRestaurant() {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('owner_id', user.id)
    .single();

  if (error || !data) return null;
  return data;
}

// ==========================================
// DRIVER PANEL - Available Deliveries
// ==========================================

export async function getAvailableDeliveries() {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      restaurants(name, address),
      profiles!orders_customer_id_fkey(full_name)
    `)
    .eq('status', 'ready')
    .is('driver_id', null)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error || !data) return [];

  return data.map((o: any) => ({
    id: o.id,
    orderNumber: o.order_number,
    restaurant: o.restaurants?.name || 'Restaurante',
    pickupAddress: o.restaurants?.address || '',
    customer: o.profiles?.full_name || 'Cliente',
    deliveryAddress: o.delivery_address || '',
    total: parseFloat(o.total),
    earnings: Math.round(parseFloat(o.total) * 0.15),
  }));
}

export async function acceptDelivery(orderId: string) {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from('orders')
    .update({ driver_id: user.id, status: 'picked_up' })
    .eq('id', orderId);

  return !error;
}

export async function completeDelivery(orderId: string) {
  const supabase = getSupabase();

  const { error } = await supabase
    .from('orders')
    .update({ status: 'delivered', actual_delivery_time: new Date().toISOString() })
    .eq('id', orderId);

  return !error;
}

// ==========================================
// ADMIN - Platform Stats
// ==========================================

export async function getAdminStats() {
  const supabase = getSupabase();

  const [
    { count: totalOrders },
    { count: totalRestaurants },
    { count: totalUsers },
    { count: totalDrivers },
  ] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('restaurants').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'client'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'driver'),
  ]);

  return {
    totalOrders: totalOrders || 0,
    totalRestaurants: totalRestaurants || 0,
    totalUsers: totalUsers || 0,
    totalDrivers: totalDrivers || 0,
  };
}

export async function getAllOrders(options?: { status?: string; limit?: number }) {
  const supabase = getSupabase();

  let query = supabase
    .from('orders')
    .select(`
      *,
      profiles!orders_customer_id_fkey(full_name),
      restaurants(name)
    `)
    .order('created_at', { ascending: false })
    .limit(options?.limit || 50);

  if (options?.status) {
    query = query.eq('status', options.status);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  return data.map((o: any) => ({
    id: o.id,
    orderNumber: o.order_number,
    customer: o.profiles?.full_name || 'Cliente',
    restaurant: o.restaurants?.name || 'Restaurante',
    total: parseFloat(o.total),
    status: o.status,
    paymentMethod: o.payment_method,
    paymentStatus: o.payment_status,
    createdAt: o.created_at,
  }));
}
