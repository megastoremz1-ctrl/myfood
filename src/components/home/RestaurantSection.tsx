'use client';

import { Restaurant } from '@/data/mock';
import RestaurantCard from './RestaurantCard';
import { X } from 'lucide-react';

interface Props {
  title: string;
  restaurants: Restaurant[];
  showClear?: boolean;
  onClear?: () => void;
}

export default function RestaurantSection({ title, restaurants, showClear, onClear }: Props) {
  if (restaurants.length === 0) {
    return (
      <section className="px-4 sm:px-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          {showClear && onClear && (
            <button onClick={onClear} className="flex items-center gap-1 text-sm font-medium text-primary-500 hover:text-primary-600">
              <X className="w-3.5 h-3.5" /> Limpar filtro
            </button>
          )}
        </div>
        <div className="text-center py-8 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500 text-sm">Nenhum restaurante encontrado nesta categoria</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 sm:px-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        {showClear && onClear && (
          <button onClick={onClear} className="flex items-center gap-1 text-sm font-medium text-primary-500 hover:text-primary-600">
            <X className="w-3.5 h-3.5" /> Limpar filtro
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
    </section>
  );
}
