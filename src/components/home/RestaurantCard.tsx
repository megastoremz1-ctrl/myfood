'use client';

import Link from 'next/link';
import { Star, Clock, Truck, MapPin, Heart } from 'lucide-react';
import { Restaurant } from '@/data/mock';
import { useStore } from '@/store/useStore';

interface Props {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: Props) {
  const { toggleFavorite, isFavorite } = useStore();
  const fav = isFavorite(restaurant.id);

  return (
    <div className="card group relative">
      <Link href={`/cliente/restaurante/${restaurant.id}`}>
        {/* Image */}
        <div className="relative h-36 sm:h-44 overflow-hidden">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-1.5">
            {restaurant.freeDelivery && (
              <span className="bg-secondary-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                Entrega Gratis
              </span>
            )}
            {restaurant.isNew && (
              <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                Novo
              </span>
            )}
            {restaurant.hasPromo && (
              <span className="bg-primary-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                Promo
              </span>
            )}
          </div>
          {!restaurant.isOpen && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-gray-900 font-semibold text-sm px-4 py-1.5 rounded-full">
                Fechado
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3 sm:p-4">
          <div className="flex items-start justify-between mb-1.5">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-tight pr-2">
              {restaurant.name}
            </h3>
            <div className="flex items-center space-x-1 flex-shrink-0">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-semibold text-gray-700">{restaurant.rating}</span>
              <span className="text-xs text-gray-400">({restaurant.reviews})</span>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {restaurant.deliveryTime}
            </span>
            <span className="flex items-center gap-1">
              <Truck className="w-3 h-3" />
              {restaurant.freeDelivery ? 'Gratis' : `${restaurant.deliveryFee} MT`}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {restaurant.distance}
            </span>
          </div>
        </div>
      </Link>

      {/* Favorite button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(restaurant.id);
        }}
        className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm z-10"
      >
        <Heart className={`w-4 h-4 transition-colors ${fav ? 'text-red-500 fill-red-500' : 'text-gray-500'}`} />
      </button>
    </div>
  );
}
