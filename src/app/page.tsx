'use client';

import PromoBanner from '@/components/home/PromoBanner';
import Categories from '@/components/home/Categories';
import RestaurantSection from '@/components/home/RestaurantSection';
import { restaurants } from '@/data/mock';

export default function HomePage() {
  const nearbyRestaurants = restaurants.filter((r) => r.isOpen);
  const popularRestaurants = [...restaurants].sort((a, b) => b.reviews - a.reviews).slice(0, 4);
  const freeDeliveryRestaurants = restaurants.filter((r) => r.freeDelivery);
  const promoRestaurants = restaurants.filter((r) => r.hasPromo);
  const newRestaurants = restaurants.filter((r) => r.isNew);

  return (
    <div className="max-w-7xl mx-auto py-6 space-y-8">
      {/* Promo Banner */}
      <PromoBanner />

      {/* Categories */}
      <Categories />

      {/* Restaurant Sections */}
      <RestaurantSection title="Restaurantes perto de si" restaurants={nearbyRestaurants} />
      <RestaurantSection title="Mais populares" restaurants={popularRestaurants} />
      <RestaurantSection title="Entrega grátis" restaurants={freeDeliveryRestaurants} />
      <RestaurantSection title="Promoções" restaurants={promoRestaurants} />
      <RestaurantSection title="Novidades" restaurants={newRestaurants} />
    </div>
  );
}
