'use client';

import { categories } from '@/data/mock';

interface Props {
  selectedCategory: string | null;
  onSelectCategory: (slug: string | null) => void;
}

export default function Categories({ selectedCategory, onSelectCategory }: Props) {
  return (
    <section className="px-4 sm:px-0">
      <h2 className="text-lg font-bold text-gray-900 mb-3">Categorias</h2>
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 sm:gap-3">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(isActive ? null : cat.slug)}
              className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border transition-all group ${
                isActive
                  ? 'bg-primary-50 border-primary-300 shadow-sm'
                  : 'bg-white border-gray-100 hover:border-primary-200 hover:bg-primary-50'
              }`}
            >
              <span className={`text-2xl sm:text-3xl mb-1 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                {cat.icon}
              </span>
              <span className={`text-[10px] sm:text-xs font-medium text-center leading-tight ${isActive ? 'text-primary-600' : 'text-gray-700'}`}>
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
