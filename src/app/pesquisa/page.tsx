'use client';

import { useState } from 'react';
import { Search, Mic, Clock, TrendingUp, X } from 'lucide-react';
import { restaurants, categories } from '@/data/mock';
import RestaurantCard from '@/components/home/RestaurantCard';

const recentSearches = ['Frango piri-piri', 'Pizza', 'Sushi', 'Café'];
const trending = ['Matapa', 'Camarão grelhado', 'Burger', 'Gelado'];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const filteredRestaurants = query.length > 0
    ? restaurants.filter(
        (r) =>
          r.name.toLowerCase().includes(query.toLowerCase()) ||
          r.categories.some((c) => c.includes(query.toLowerCase()))
      )
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsSearching(e.target.value.length > 0);
          }}
          placeholder="Pesquisar restaurantes, pratos..."
          className="w-full pl-12 pr-20 py-4 bg-white rounded-2xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-base transition-all shadow-sm"
          autoFocus
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {query && (
            <button
              onClick={() => { setQuery(''); setIsSearching(false); }}
              className="p-1.5 hover:bg-gray-100 rounded-full"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
          <button className="p-2 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors">
            <Mic className="w-4 h-4 text-primary-500" />
          </button>
        </div>
      </div>

      {isSearching ? (
        /* Search Results */
        <div>
          {filteredRestaurants.length > 0 ? (
            <div>
              <p className="text-sm text-gray-500 mb-4">
                {filteredRestaurants.length} resultado{filteredRestaurants.length > 1 ? 's' : ''} para &ldquo;{query}&rdquo;
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRestaurants.map((r) => (
                  <RestaurantCard key={r.id} restaurant={r} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-500 text-sm">Nenhum resultado para &ldquo;{query}&rdquo;</p>
              <p className="text-gray-400 text-xs mt-1">Tente outro termo de pesquisa</p>
            </div>
          )}
        </div>
      ) : (
        /* Default State */
        <div className="space-y-8">
          {/* Categories */}
          <section>
            <h2 className="font-bold text-gray-900 mb-3">Categorias</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setQuery(cat.slug); setIsSearching(true); }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50 transition-all"
                >
                  <span>{cat.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Recent Searches */}
          <section>
            <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              Pesquisas recentes
            </h2>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => { setQuery(term); setIsSearching(true); }}
                  className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </section>

          {/* Trending */}
          <section>
            <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary-500" />
              Em alta
            </h2>
            <div className="flex flex-wrap gap-2">
              {trending.map((term) => (
                <button
                  key={term}
                  onClick={() => { setQuery(term); setIsSearching(true); }}
                  className="px-3 py-1.5 bg-primary-50 rounded-full text-sm text-primary-600 font-medium hover:bg-primary-100 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
