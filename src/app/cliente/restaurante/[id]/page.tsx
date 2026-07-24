'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, Clock, Truck, MapPin, ArrowLeft, Heart, Share2, Plus, Minus, X, ShoppingBag, Check, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { MenuItem, Extra, Restaurant } from '@/data/mock';
import { getRestaurantById, getMenuItems } from '@/lib/db';
import { useStore } from '@/store/useStore';

export default function RestaurantPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, getCartCount, toggleFavorite, isFavorite } = useStore();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItemsList, setMenuItemsList] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>([]);
  const [removedItems, setRemovedItems] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [addedToast, setAddedToast] = useState(false);
  const [activeMenuTab, setActiveMenuTab] = useState('');
  const cartCount = getCartCount();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const id = params.id as string;
      const [rest, items] = await Promise.all([
        getRestaurantById(id),
        getMenuItems(id),
      ]);
      setRestaurant(rest as Restaurant | null);
      setMenuItemsList(items as MenuItem[]);
      // Set first category as active
      const cats = [...new Set(items.map((i: any) => i.category))];
      if (cats.length > 0) setActiveMenuTab(cats[0] as string);
      setLoading(false);
    }
    loadData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Restaurante nao encontrado</p>
        <Link href="/cliente" className="text-primary-500 font-medium mt-4 inline-block">
          Voltar ao inicio
        </Link>
      </div>
    );
  }

  const fav = isFavorite(restaurant.id);
  const menuCategories = [...new Set(menuItemsList.map((i) => i.category))];

  const handleAddToCart = () => {
    if (selectedItem) {
      addToCart(selectedItem, quantity, selectedExtras, removedItems, notes, restaurant);
      setSelectedItem(null);
      setQuantity(1);
      setSelectedExtras([]);
      setRemovedItems([]);
      setNotes('');
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 2000);
    }
  };

  const toggleExtra = (extra: Extra) => {
    setSelectedExtras((prev) =>
      prev.find((e) => e.id === extra.id)
        ? prev.filter((e) => e.id !== extra.id)
        : [...prev, extra]
    );
  };

  const toggleRemoved = (item: string) => {
    setRemovedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const itemTotal = selectedItem
    ? (selectedItem.price + selectedExtras.reduce((sum, e) => sum + e.price, 0)) * quantity
    : 0;

  return (
    <div className="max-w-4xl mx-auto relative">
      {/* Cover Image */}
      <div className="relative h-48 sm:h-64 lg:h-72">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => toggleFavorite(restaurant.id)}
              className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
            >
              <Heart className={`w-4 h-4 ${fav ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
            </button>
            <button className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="bg-white -mt-6 relative rounded-t-3xl px-4 sm:px-6 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-start gap-4">
          <img
            src={restaurant.logo}
            alt={restaurant.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md -mt-12"
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900">{restaurant.name}</h1>
            <div className="flex items-center flex-wrap gap-3 mt-1.5 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold text-gray-700">{restaurant.rating}</span>
                <span>({restaurant.reviews})</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {restaurant.deliveryTime}
              </span>
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" />
                {restaurant.freeDelivery ? 'Gratis' : `${restaurant.deliveryFee} MT`}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {restaurant.distance}
              </span>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            restaurant.isOpen ? 'bg-secondary-100 text-secondary-700' : 'bg-red-100 text-red-700'
          }`}>
            {restaurant.isOpen ? 'Aberto' : 'Fechado'}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-3">Pedido minimo: {restaurant.minOrder} MT</p>
      </div>

      {/* Menu Category Tabs */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 sm:px-6">
        <div className="flex gap-1 overflow-x-auto py-3 no-scrollbar">
          {menuCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveMenuTab(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                activeMenuTab === cat
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 sm:px-6 py-6">
        <div className="space-y-3">
          {menuItemsList
            .filter((item) => item.category === activeMenuTab)
            .map((item) => (
              <button
                key={item.id}
                onClick={() => restaurant.isOpen && setSelectedItem(item)}
                disabled={!restaurant.isOpen}
                className={`w-full card flex gap-4 p-3 sm:p-4 text-left ${!restaurant.isOpen ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{item.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5 line-clamp-2">{item.description}</p>
                  <p className="text-primary-600 font-bold mt-2 text-sm sm:text-base">{item.price} MT</p>
                  {item.extras && item.extras.length > 0 && (
                    <p className="text-[10px] text-gray-400 mt-1">+ {item.extras.length} extras disponiveis</p>
                  )}
                </div>
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  {restaurant.isOpen && (
                    <div className="absolute bottom-1 right-1 w-7 h-7 bg-primary-500 rounded-full flex items-center justify-center shadow-lg">
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </button>
            ))}
        </div>
      </div>

      {/* Floating Cart Button */}
      {cartCount > 0 && !selectedItem && (
        <div className="sticky bottom-20 md:bottom-4 px-4 sm:px-6 pb-4 z-30">
          <Link
            href="/cliente/carrinho"
            className="flex items-center justify-between w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3.5 px-5 rounded-2xl shadow-xl shadow-primary-200 transition-all"
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Ver carrinho
            </span>
            <span className="bg-white/20 px-3 py-0.5 rounded-full text-sm">
              {cartCount} {cartCount === 1 ? 'item' : 'itens'}
            </span>
          </Link>
        </div>
      )}

      {/* Added Toast */}
      {addedToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-secondary-500 text-white px-5 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span className="text-sm font-medium">Adicionado ao carrinho!</span>
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedItem(null)} />
          <div className="relative bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-3xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between z-10">
              <h3 className="font-bold text-lg">{selectedItem.name}</h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-5">
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="w-full h-40 object-cover rounded-xl"
              />
              <p className="text-sm text-gray-600">{selectedItem.description}</p>
              <p className="text-lg font-bold text-primary-600">{selectedItem.price} MT</p>

              {/* Extras */}
              {selectedItem.extras && selectedItem.extras.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Extras</h4>
                  <div className="space-y-2">
                    {selectedItem.extras.map((extra) => (
                      <label
                        key={extra.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedExtras.some((e) => e.id === extra.id)}
                            onChange={() => toggleExtra(extra)}
                            className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700">{extra.name}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-600">+{extra.price} MT</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Remove Items */}
              {selectedItem.removable && selectedItem.removable.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Retirar ingredientes</h4>
                  <div className="space-y-2">
                    {selectedItem.removable.map((item) => (
                      <label
                        key={item}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={removedItems.includes(item)}
                          onChange={() => toggleRemoved(item)}
                          className="w-4 h-4 text-red-500 rounded focus:ring-red-500"
                        />
                        <span className="text-sm text-gray-700">Sem {item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Observacoes</h4>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Bem passado, sem cebola..."
                  className="input-field h-20 resize-none text-sm"
                />
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">Quantidade</span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-lg w-6 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 bg-primary-500 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="w-full btn-primary flex items-center justify-center gap-2 text-base"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Adicionar - {itemTotal} MT</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
