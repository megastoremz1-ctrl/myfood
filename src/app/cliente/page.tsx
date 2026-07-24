'use client';

import { useState, useEffect } from 'react';
import PromoBanner from '@/components/home/PromoBanner';
import Categories from '@/components/home/Categories';
import RestaurantSection from '@/components/home/RestaurantSection';
import { getRestaurants, getCategories, getPromotions } from '@/lib/db';
import { Restaurant, Category } from '@/data/mock';
import { Loader2 } from 'lucide-react';

export default function ClienteHomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [categories, setCategoriesData] = useState<Category[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [restaurantsData, categoriesData, promosData] = await Promise.all([
        getRestaurants(),
        getCategories(),
        getPromotions(),
      ]);
      setRestaurants(restaurantsData as Restaurant[]);
      setCategoriesData(categoriesData);
      setPromotions(promosData);
      setLoading(false);
    }
    loadData();
  }, []);

  // Filter by category
  const filteredRestaurants = selectedCategory
    ? restaurants.filter((r) => r.categories.includes(selectedCategory))
    : restaurants;

  const openRestaurants = filteredRestaurants.filter((r) => r.isOpen);
  const popularRestaurants = [...filteredRestaurants].sort((a, b) => b.reviews - a.reviews).slice(0, 4);
  const freeDeliveryRestaurants = filteredRestaurants.filter((r) => r.freeDelivery);
  const promoRestaurants = filteredRestaurants.filter((r) => r.hasPromo);
  const newRestaurants = filteredRestaurants.filter((r) => r.isNew);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-4 space-y-6">
      <PromoBanner promotions={promotions} />
      <Categories
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

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
