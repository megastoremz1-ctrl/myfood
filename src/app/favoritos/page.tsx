'use client';

import { Heart } from 'lucide-react';
import { restaurants } from '@/data/mock';
import RestaurantCard from '@/components/home/RestaurantCard';
import Link from 'next/link';

export default function FavoritesPage() {
  const favoriteRestaurants = restaurants.slice(0, 5);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
          <Heart className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Favoritos</h1>
          <p className="text-sm text-gray-500">{favoriteRestaurants.length} restaurantes guardados</p>
        </div>
      </div>

      {favoriteRestaurants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-gray-300" />
          </div>
          <h2 className="font-bold text-gray-700 mb-2">Sem favoritos ainda</h2>
          <p className="text-sm text-gray-500 mb-6">Guarde os seus restaurantes preferidos aqui</p>
          <Link href="/" className="btn-primary inline-block">
            Explorar restaurantes
          </Link>
        </div>
      )}
    </div>
  );
}
