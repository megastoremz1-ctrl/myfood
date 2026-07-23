'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { promotions } from '@/data/mock';

export default function PromoBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % promotions.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl mx-4 sm:mx-0">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className={`min-w-full relative h-40 sm:h-48 bg-gradient-to-r ${promo.color} rounded-2xl p-6 flex flex-col justify-center`}
          >
            <h3 className="text-white text-xl sm:text-2xl font-bold mb-1">{promo.title}</h3>
            <p className="text-white/90 text-sm sm:text-base">{promo.description}</p>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
        {promotions.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === current ? 'bg-white w-6' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={() => setCurrent((prev) => (prev - 1 + promotions.length) % promotions.length)}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/40 transition-colors"
      >
        <ChevronLeft className="w-4 h-4 text-white" />
      </button>
      <button
        onClick={() => setCurrent((prev) => (prev + 1) % promotions.length)}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/40 transition-colors"
      >
        <ChevronRight className="w-4 h-4 text-white" />
      </button>
    </div>
  );
}
