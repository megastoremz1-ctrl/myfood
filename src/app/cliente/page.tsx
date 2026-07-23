'use client';

import { useState } from 'react';
import PromoBanner from '@/components/home/PromoBanner';
import Categories from '@/components/home/Categories';
import RestaurantSection from '@/components/home/RestaurantSection';
import { restaurants } from '@/data/mock';

export default function ClienteHomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredRestaurants = selectedCategory
    ? restaurants.filter((r) => r.categories.includes(selectedCategory))
    : restaurants;

  const openRestaurants = filteredRestaurants.filter((r) => r.isOpen);
  const popularRestaurants = [...filteredRestaurants].sort((a, b) => b.reviews - a.reviews).slice(0, 4);
  const freeDeliveryRestaurants = filteredRestaurants.filter((r) => r.freeDelivery);
  const promoRestaurants = filteredRestaurants.filter((r) => r.hasPromo);
  const newRestaurants = filteredRestaurants.filter((r) => r.isNew);

  return (
    <div className="max-w-7xl mx-auto py-4 space-y-6">
      <PromoBanner />
      <Categories selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
      
      {selectedCategory ? (
        <RestaurantSection
          title={`Resultados para "${selectedCategory}"`}
          restaurants={filteredRestaurants}
          showClear
          onClear={() => setSelectedCategory(null)}
        />
      ) : (
        <>
          <RestaurantSection title="Restaurantes perto de si" restaurants={openRestaurants} />
          <RestaurantSection title="Mais populares" restaurants={popularRestaurants} />
          {freeDeliveryRestaurants.length > 0 && (
            <RestaurantSection title="Entrega gratis" restaurants={freeDeliveryRestaurants} />
          )}
          {promoRestaurants.length > 0 && (
            <RestaurantSection title="Promocoes" restaurants={promoRestaurants} />
          )}
          {newRestaurants.length > 0 && (
            <RestaurantSection title="Novidades" restaurants={newRestaurants} />
          )}
        </>
      )}
    </div>
  );
}
