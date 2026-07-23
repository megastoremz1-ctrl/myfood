'use client';

interface IconProps {
  className?: string;
}

export function FastFoodIcon({ className = 'w-8 h-8' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="#FFF3E0"/>
      <path d="M12 26h24c0 6-5.4 10-12 10S12 32 12 26z" fill="#FF9800"/>
      <path d="M12 26h24" stroke="#E65100" strokeWidth="2" strokeLinecap="round"/>
      <path d="M14 24c0-6 4.5-12 10-12s10 6 10 12" fill="#FFCC02"/>
      <circle cx="18" cy="21" r="1" fill="#4CAF50"/>
      <circle cx="24" cy="19" r="1" fill="#F44336"/>
      <circle cx="30" cy="21" r="1" fill="#4CAF50"/>
      <rect x="14" y="30" width="20" height="2" rx="1" fill="#8D6E63"/>
    </svg>
  );
}

export function PizzaIcon({ className = 'w-8 h-8' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="#FBE9E7"/>
      <path d="M24 10L38 36H10L24 10z" fill="#FFC107"/>
      <path d="M24 10L38 36H10L24 10z" stroke="#FF8F00" strokeWidth="1.5"/>
      <circle cx="22" cy="24" r="2.5" fill="#F44336"/>
      <circle cx="28" cy="28" r="2" fill="#F44336"/>
      <circle cx="20" cy="30" r="2" fill="#F44336"/>
      <circle cx="26" cy="20" r="1.5" fill="#4CAF50"/>
      <path d="M24 10L38 36H10L24 10z" stroke="#FF6F00" strokeWidth="2" fill="none"/>
    </svg>
  );
}

export function ChickenIcon({ className = 'w-8 h-8' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="#FFF8E1"/>
      <ellipse cx="24" cy="26" rx="10" ry="8" fill="#FF8F00"/>
      <ellipse cx="24" cy="26" rx="8" ry="6" fill="#FFB74D"/>
      <path d="M18 32L16 38" stroke="#5D4037" strokeWidth="2" strokeLinecap="round"/>
      <path d="M30 32L32 38" stroke="#5D4037" strokeWidth="2" strokeLinecap="round"/>
      <path d="M24 18v-4" stroke="#5D4037" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="24" cy="12" r="2" fill="#F44336"/>
    </svg>
  );
}

export function MozambicanIcon({ className = 'w-8 h-8' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="#E8F5E9"/>
      <ellipse cx="24" cy="28" rx="11" ry="4" fill="#8D6E63"/>
      <ellipse cx="24" cy="26" rx="11" ry="4" fill="#A1887F"/>
      <path d="M13 22c0-3 5-8 11-8s11 5 11 8" fill="#4CAF50"/>
      <path d="M18 20c1-2 3-4 6-4s5 2 6 4" fill="#66BB6A"/>
      <circle cx="20" cy="25" r="1.5" fill="#FF8A65"/>
      <circle cx="28" cy="25" r="1.5" fill="#FF8A65"/>
      <circle cx="24" cy="24" r="1" fill="#FFCC02"/>
    </svg>
  );
}

export function SushiIcon({ className = 'w-8 h-8' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="#FFEEF0"/>
      <rect x="14" y="20" width="20" height="12" rx="6" fill="#1B5E20"/>
      <rect x="16" y="18" width="16" height="10" rx="5" fill="white"/>
      <ellipse cx="24" cy="22" rx="5" ry="4" fill="#FF6B6B"/>
      <path d="M20 22c1-1 3-2 4-2s3 1 4 2" fill="#E53935"/>
      <rect x="14" y="25" width="20" height="2" fill="#2E7D32"/>
    </svg>
  );
}

export function CoffeeIcon({ className = 'w-8 h-8' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="#EFEBE9"/>
      <path d="M16 20h16v14c0 3-3.5 5-8 5s-8-2-8-5V20z" fill="#795548"/>
      <path d="M16 20h16v3c0 1-3.5 2-8 2s-8-1-8-2V20z" fill="#5D4037"/>
      <path d="M32 23h2c2 0 3 1 3 3s-1 3-3 3h-2" stroke="#795548" strokeWidth="2"/>
      <path d="M20 16c0-2 1-3 2-3" stroke="#9E9E9E" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M24 14c0-2 1-3 2-3" stroke="#9E9E9E" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M28 16c0-2 1-3 2-3" stroke="#9E9E9E" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function DessertIcon({ className = 'w-8 h-8' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="#FCE4EC"/>
      <path d="M16 30l2-10h12l2 10" fill="#FFECB3"/>
      <path d="M14 30h20c1 0 2 1 2 2v2c0 1-1 2-2 2H14c-1 0-2-1-2-2v-2c0-1 1-2 2-2z" fill="#FFD54F"/>
      <circle cx="20" cy="19" r="4" fill="#E91E63"/>
      <circle cx="28" cy="19" r="4" fill="#EC407A"/>
      <circle cx="24" cy="16" r="4" fill="#F48FB1"/>
      <circle cx="24" cy="12" r="2" fill="#F44336"/>
      <path d="M23 10l1-2 1 2" fill="#4CAF50"/>
    </svg>
  );
}

export function SupermarketIcon({ className = 'w-8 h-8' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="#E3F2FD"/>
      <path d="M12 18l4-6h16l4 6" fill="#1976D2"/>
      <rect x="12" y="18" width="24" height="16" rx="2" fill="#2196F3"/>
      <rect x="16" y="22" width="6" height="8" rx="1" fill="white" fillOpacity="0.8"/>
      <rect x="26" y="22" width="6" height="8" rx="1" fill="white" fillOpacity="0.8"/>
      <rect x="20" y="30" width="8" height="4" rx="1" fill="#1565C0"/>
      <circle cx="20" cy="38" r="2" fill="#424242"/>
      <circle cx="32" cy="38" r="2" fill="#424242"/>
    </svg>
  );
}

export function PharmacyIcon({ className = 'w-8 h-8' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="#E8F5E9"/>
      <rect x="16" y="14" width="16" height="22" rx="3" fill="white" stroke="#4CAF50" strokeWidth="2"/>
      <rect x="21" y="20" width="6" height="2" rx="1" fill="#4CAF50"/>
      <rect x="23" y="18" width="2" height="6" rx="1" fill="#4CAF50"/>
      <path d="M16 14h16" stroke="#4CAF50" strokeWidth="2"/>
      <rect x="20" y="10" width="8" height="4" rx="1" fill="#4CAF50"/>
    </svg>
  );
}

export const categoryIconMap: Record<string, React.FC<IconProps>> = {
  'fast-food': FastFoodIcon,
  'pizza': PizzaIcon,
  'frango': ChickenIcon,
  'mocambicana': MozambicanIcon,
  'sushi': SushiIcon,
  'cafes': CoffeeIcon,
  'sobremesas': DessertIcon,
  'supermercado': SupermarketIcon,
  'farmacia': PharmacyIcon,
};
