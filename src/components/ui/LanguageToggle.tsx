'use client';

import { useTheme } from '@/components/providers/ThemeProvider';
import { Globe } from 'lucide-react';

export default function LanguageToggle() {
  const { locale, setLocale } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-gray-400" />
      <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
        <button
          onClick={() => setLocale('pt')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            locale === 'pt'
              ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-500 font-semibold'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          PT
        </button>
        <button
          onClick={() => setLocale('en')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            locale === 'en'
              ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-500 font-semibold'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          EN
        </button>
      </div>
    </div>
  );
}
