'use client';

import { categories } from '@/data/mock';

export default function Categories() {
  return (
    <section className="px-4 sm:px-0">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Categorias</h2>
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50 transition-all group"
          >
            <span className="text-2xl sm:text-3xl mb-1.5 group-hover:scale-110 transition-transform">
              {cat.icon}
            </span>
            <span className="text-xs font-medium text-gray-700 text-center leading-tight">
              {cat.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
