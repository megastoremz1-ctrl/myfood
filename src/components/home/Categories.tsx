'use client';

import { categories as defaultCategories } from '@/data/mock';
import { Category } from '@/data/mock';

// Real food images for each category (high quality, cropped square)
const categoryImages: Record<string, string> = {
  'fast-food': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop&crop=center',
  'pizza': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop&crop=center',
  'frango': 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=200&h=200&fit=crop&crop=center',
  'mocambicana': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop&crop=center',
  'sushi': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200&h=200&fit=crop&crop=center',
  'cafes': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop&crop=center',
  'sobremesas': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop&crop=center',
  'supermercado': 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=200&h=200&fit=crop&crop=center',
  'farmacia': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop&crop=center',
};

interface Props {
  categories?: Category[];
  selectedCategory: string | null;
  onSelectCategory: (slug: string | null) => void;
}

export default function Categories({ categories, selectedCategory, onSelectCategory }: Props) {
  const cats = categories && categories.length > 0 ? categories : defaultCategories;

  return (
    <section className="px-4 sm:px-0">
      <h2 className="text-lg font-bold text-gray-900 mb-3">Categorias</h2>
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 sm:gap-3">
        {cats.map((cat) => {
          const isActive = selectedCategory === cat.slug;
          const imageUrl = categoryImages[cat.slug];
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(isActive ? null : cat.slug)}
              className={`flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-2xl border transition-all group ${
                isActive
                  ? 'bg-primary-50 border-primary-300 shadow-md shadow-primary-100'
                  : 'bg-white border-gray-100 hover:border-primary-200 hover:bg-primary-50/50 hover:shadow-sm'
              }`}
            >
              <div className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden mb-1.5 transition-transform ring-2 ${
                isActive ? 'scale-110 ring-primary-400' : 'ring-gray-100 group-hover:scale-105 group-hover:ring-primary-200'
              }`}>
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-xl">{cat.icon}</span>
                  </div>
                )}
                {/* Subtle overlay for better text contrast below */}
                {isActive && (
                  <div className="absolute inset-0 bg-primary-500/10 rounded-full" />
                )}
              </div>
              <span className={`text-[10px] sm:text-xs font-medium text-center leading-tight ${
                isActive ? 'text-primary-600 font-semibold' : 'text-gray-700'
              }`}>
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
