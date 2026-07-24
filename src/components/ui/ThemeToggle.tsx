'use client';

import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded-lg transition-colors ${theme === 'light' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-500' : 'text-gray-400 hover:text-gray-600'}`}
        title="Claro"
      >
        <Sun className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-500' : 'text-gray-400 hover:text-gray-600'}`}
        title="Escuro"
      >
        <Moon className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`p-2 rounded-lg transition-colors ${theme === 'system' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-500' : 'text-gray-400 hover:text-gray-600'}`}
        title="Sistema"
      >
        <Monitor className="w-4 h-4" />
      </button>
    </div>
  );
}
