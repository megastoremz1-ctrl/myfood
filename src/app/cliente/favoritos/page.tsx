'use client';

import { useState, useEffect } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { getRestaurants } from '@/lib/db';
import { Restaurant } from '@/data/mock';
import RestaurantCard from '@/components/home/RestaurantCard';
import Link from 'next/link';

export default function FavoritesPage() {
  const { favorites } = useStore();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const allRestaurants = await getRestaurants();
      // Filter only favorited ones
      const favRestaurants = (allRestaurants as Restaurant[]).filter(r => favorites.includes(r.id));
      setRestaurants(favRestaurants);
      setLoading(false);
    }
    load();
  }, [favorites]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
          <Heart className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Favoritos</h1>
          <p className="text-sm text-gray-500">{restaurants.length} restaurantes guardados</p>
        </div>
      </div>

      {restaurants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-gray-300" />
          </div>
          <h2 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Sem favoritos ainda</h2>
          <p className="text-sm text-gray-500 mb-6">Toque no coracao em qualquer restaurante para guardar aqui</p>
          <Link href="/cliente" className="btn-primary inline-block">
            Explorar restaurantes
          </Link>
        </div>
      )}
    </div>
  );
}
