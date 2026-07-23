'use client';

import { Restaurant } from '@/data/mock';
import RestaurantCard from './RestaurantCard';

interface Props {
  title: string;
  restaurants: Restaurant[];
}

export default function RestaurantSection({ title, restaurants }: Props) {
  if (restaurants.length === 0) return null;

  return (
    <section className="px-4 sm:px-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <button className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors">
          Ver todos
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
    </section>
  );
}
