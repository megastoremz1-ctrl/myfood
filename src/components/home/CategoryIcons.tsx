'use client';

interface IconProps {
  className?: string;
}

export function FastFoodIcon({ className = 'w-10 h-10' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Burger */}
      {/* Bottom bun */}
      <path d="M14 42h36c0 4-8 7-18 7S14 46 14 42z" fill="#D4840A"/>
      <path d="M14 42h36" stroke="#B8720A" strokeWidth="0.5"/>
      {/* Patty */}
      <ellipse cx="32" cy="39" rx="17" ry="4" fill="#5C2E0E"/>
      <ellipse cx="32" cy="38.5" rx="16" ry="3.5" fill="#7A3B10"/>
      {/* Cheese dripping */}
      <path d="M15 36c0 0 2 3 5 3s3-2 5-2 2 2 5 2 3-3 5-3 2 2 5 2 3-2 5-2 3 3 4 3" fill="#FFB300"/>
      <path d="M15 35h34" stroke="#FF8F00" strokeWidth="0.3"/>
      {/* Lettuce */}
      <path d="M13 34c2 1 4-1 7-1s5 2 7 1 4-2 7-1 5 2 7 1 4-1 6-1" fill="#4CAF50"/>
      <path d="M14 33.5c2 0.8 4-0.8 6.5-0.8s4.5 1.5 6.5 0.8 3.5-1.5 6.5-0.8 4.5 1.5 6.5 0.8 3.5-0.5 5.5-0.5" fill="#66BB6A"/>
      {/* Tomato slices */}
      <ellipse cx="24" cy="32" rx="4" ry="1.5" fill="#E53935"/>
      <ellipse cx="36" cy="32" rx="4" ry="1.5" fill="#E53935"/>
      <ellipse cx="24" cy="31.8" rx="3.5" ry="1" fill="#EF5350" opacity="0.6"/>
      <ellipse cx="36" cy="31.8" rx="3.5" ry="1" fill="#EF5350" opacity="0.6"/>
      {/* Top bun */}
      <path d="M14 31c0-9 8-16 18-16s18 7 18 16H14z" fill="#F5A623"/>
      <path d="M16 29c0-8 7.2-14 16-14s16 6 16 14" fill="#FFBF47"/>
      <path d="M18 27c0-6.5 6.3-11.5 14-11.5s14 5 14 11.5" fill="#F5A623" opacity="0.3"/>
      {/* Sesame seeds */}
      <ellipse cx="22" cy="22" rx="1.5" ry="1" fill="#FFF3E0" transform="rotate(-15 22 22)"/>
      <ellipse cx="30" cy="19" rx="1.5" ry="1" fill="#FFF3E0" transform="rotate(10 30 19)"/>
      <ellipse cx="38" cy="22" rx="1.5" ry="1" fill="#FFF3E0" transform="rotate(20 38 22)"/>
      <ellipse cx="26" cy="25" rx="1.2" ry="0.8" fill="#FFF3E0" transform="rotate(-5 26 25)"/>
      <ellipse cx="35" cy="26" rx="1.2" ry="0.8" fill="#FFF3E0" transform="rotate(15 35 26)"/>
      {/* Shadow */}
      <ellipse cx="32" cy="51" rx="14" ry="2" fill="black" opacity="0.08"/>
    </svg>
  );
}

export function PizzaIcon({ className = 'w-10 h-10' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Pizza slice */}
      <path d="M32 8L52 52H12L32 8z" fill="#F9A825"/>
      <path d="M32 8L50 48H14L32 8z" fill="#FFD54F"/>
      {/* Crust */}
      <path d="M12 52c0 0 5 4 20 4s20-4 20-4" stroke="#D4840A" strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d="M12 52c0 0 5 3.5 20 3.5s20-3.5 20-3.5" stroke="#E8A020" strokeWidth="3" strokeLinecap="round" fill="none"/>
      {/* Cheese texture */}
      <path d="M26 35c1 3 2 5 1 8" stroke="#FFC107" strokeWidth="1" opacity="0.5"/>
      <path d="M36 30c0 3-1 6 0 9" stroke="#FFC107" strokeWidth="1" opacity="0.5"/>
      {/* Pepperoni */}
      <circle cx="28" cy="28" r="4" fill="#C62828"/>
      <circle cx="28" cy="28" r="3.2" fill="#D32F2F"/>
      <circle cx="27" cy="27" r="0.8" fill="#E57373" opacity="0.5"/>
      <circle cx="37" cy="36" r="3.5" fill="#C62828"/>
      <circle cx="37" cy="36" r="2.8" fill="#D32F2F"/>
      <circle cx="36" cy="35" r="0.7" fill="#E57373" opacity="0.5"/>
      <circle cx="24" cy="40" r="3" fill="#C62828"/>
      <circle cx="24" cy="40" r="2.4" fill="#D32F2F"/>
      {/* Basil leaves */}
      <path d="M33 22c2-1 4 0 4 2s-2 2-4 1-1-2 0-3z" fill="#2E7D32"/>
      <path d="M33.5 22.5c1-0.5 2.5 0 2.5 1.2s-1.2 1.2-2.5 0.6" fill="#43A047" opacity="0.7"/>
      {/* Shadow */}
      <ellipse cx="32" cy="58" rx="12" ry="2" fill="black" opacity="0.08"/>
    </svg>
  );
}

export function ChickenIcon({ className = 'w-10 h-10' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Drumstick */}
      {/* Bone */}
      <path d="M42 14c3-3 8-2 10 1s1 8-2 10" stroke="#F5F5F5" strokeWidth="5" strokeLinecap="round"/>
      <path d="M42 14c3-3 8-2 10 1s1 8-2 10" stroke="#E0E0E0" strokeWidth="4" strokeLinecap="round"/>
      <circle cx="49" cy="11" r="3" fill="#FAFAFA"/>
      <circle cx="49" cy="11" r="2.2" fill="#F5F5F5"/>
      <circle cx="53" cy="14" r="2.5" fill="#FAFAFA"/>
      <circle cx="53" cy="14" r="1.8" fill="#F5F5F5"/>
      {/* Meat body */}
      <ellipse cx="30" cy="38" rx="16" ry="13" fill="#E8740C" transform="rotate(-20 30 38)"/>
      <ellipse cx="30" cy="37" rx="15" ry="12" fill="#F5920C" transform="rotate(-20 30 37)"/>
      <ellipse cx="28" cy="35" rx="12" ry="9" fill="#FFAB40" transform="rotate(-20 28 35)" opacity="0.4"/>
      {/* Grill marks */}
      <path d="M18 35c8-2 16-2 24 0" stroke="#D4680A" strokeWidth="1" opacity="0.4"/>
      <path d="M19 39c7-1.5 14-1.5 22 0" stroke="#D4680A" strokeWidth="1" opacity="0.4"/>
      <path d="M20 43c6-1 12-1 18 0" stroke="#D4680A" strokeWidth="1" opacity="0.3"/>
      {/* Highlight */}
      <ellipse cx="25" cy="32" rx="5" ry="3" fill="white" opacity="0.15" transform="rotate(-20 25 32)"/>
      {/* Herbs */}
      <circle cx="22" cy="44" r="1" fill="#4CAF50"/>
      <circle cx="35" cy="42" r="0.8" fill="#4CAF50"/>
      {/* Shadow */}
      <ellipse cx="30" cy="54" rx="13" ry="2.5" fill="black" opacity="0.08"/>
    </svg>
  );
}

export function MozambicanIcon({ className = 'w-10 h-10' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bowl */}
      <ellipse cx="32" cy="46" rx="18" ry="5" fill="#5D4037"/>
      <path d="M14 38c0 8 8 13 18 13s18-5 18-13H14z" fill="#6D4C41"/>
      <path d="M14 38c0 7 8 12 18 12s18-5 18-12" fill="#795548"/>
      <ellipse cx="32" cy="38" rx="18" ry="5" fill="#8D6E63"/>
      {/* Food in bowl - rice */}
      <ellipse cx="32" cy="36" rx="15" ry="4" fill="#FFFDE7"/>
      <ellipse cx="32" cy="35.5" rx="14" ry="3.5" fill="white"/>
      {/* Stew/sauce on top */}
      <ellipse cx="28" cy="34" rx="8" ry="3" fill="#E65100"/>
      <ellipse cx="28" cy="33.5" rx="7" ry="2.5" fill="#F57C00"/>
      {/* Shrimp */}
      <path d="M24 32c2-2 5-1 5 1s-2 2-4 1" fill="#FF7043" stroke="#E64A19" strokeWidth="0.5"/>
      <path d="M30 33c1.5-1.5 4-0.5 4 1s-1.5 1.5-3.5 0.5" fill="#FF7043" stroke="#E64A19" strokeWidth="0.5"/>
      {/* Garnish */}
      <path d="M38 33c1 0 2-1 1.5-2s-2-0.5-2 0.5 0.5 1.5 0.5 1.5z" fill="#4CAF50"/>
      <path d="M35 31c0.8 0 1.5-0.8 1.2-1.5s-1.5-0.3-1.5 0.5" fill="#66BB6A"/>
      {/* Peanuts */}
      <ellipse cx="34" cy="35" rx="1" ry="0.6" fill="#D4A056" transform="rotate(20 34 35)"/>
      <ellipse cx="37" cy="34.5" rx="0.8" ry="0.5" fill="#D4A056" transform="rotate(-10 37 34.5)"/>
      {/* Shadow */}
      <ellipse cx="32" cy="53" rx="14" ry="2" fill="black" opacity="0.08"/>
    </svg>
  );
}

export function SushiIcon({ className = 'w-10 h-10' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Plate */}
      <ellipse cx="32" cy="48" rx="20" ry="4" fill="#E0E0E0"/>
      <ellipse cx="32" cy="47" rx="20" ry="4" fill="#F5F5F5"/>
      <ellipse cx="32" cy="46.5" rx="18" ry="3" fill="#FAFAFA"/>
      {/* Sushi roll 1 */}
      <ellipse cx="24" cy="38" rx="8" ry="7" fill="#1B5E20"/>
      <ellipse cx="24" cy="37" rx="7" ry="6" fill="#2E7D32"/>
      <ellipse cx="24" cy="37" rx="5.5" ry="5" fill="white"/>
      <ellipse cx="24" cy="37" rx="3.5" ry="3.2" fill="#FF8A80"/>
      <ellipse cx="24" cy="36.5" rx="2.5" ry="2" fill="#FF5252"/>
      <ellipse cx="23" cy="36" rx="1" ry="0.7" fill="white" opacity="0.3"/>
      {/* Sushi roll 2 */}
      <ellipse cx="40" cy="38" rx="7" ry="6.5" fill="#1B5E20"/>
      <ellipse cx="40" cy="37" rx="6" ry="5.5" fill="#2E7D32"/>
      <ellipse cx="40" cy="37" rx="4.5" ry="4.5" fill="white"/>
      <ellipse cx="40" cy="37" rx="3" ry="3" fill="#FFAB40"/>
      <ellipse cx="40" cy="36.5" rx="2" ry="1.8" fill="#FF8F00"/>
      <ellipse cx="39" cy="36" rx="0.8" ry="0.5" fill="white" opacity="0.3"/>
      {/* Rice grains texture */}
      <circle cx="22" cy="40" r="0.4" fill="#E0E0E0"/>
      <circle cx="26" cy="40" r="0.4" fill="#E0E0E0"/>
      <circle cx="38" cy="40" r="0.4" fill="#E0E0E0"/>
      <circle cx="42" cy="40" r="0.4" fill="#E0E0E0"/>
      {/* Chopsticks */}
      <line x1="10" y1="20" x2="42" y2="44" stroke="#8D6E63" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="14" y1="18" x2="44" y2="42" stroke="#A1887F" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Shadow */}
      <ellipse cx="32" cy="53" rx="14" ry="1.5" fill="black" opacity="0.06"/>
    </svg>
  );
}

export function CoffeeIcon({ className = 'w-10 h-10' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Saucer */}
      <ellipse cx="30" cy="54" rx="18" ry="4" fill="#BDBDBD"/>
      <ellipse cx="30" cy="53" rx="18" ry="4" fill="#E0E0E0"/>
      <ellipse cx="30" cy="52.5" rx="15" ry="3" fill="#EEEEEE"/>
      {/* Cup body */}
      <path d="M16 28h28v18c0 5-6 8-14 8s-14-3-14-8V28z" fill="white"/>
      <path d="M16 28h28v18c0 5-6 8-14 8s-14-3-14-8V28z" stroke="#E0E0E0" strokeWidth="1"/>
      <path d="M16 28h28v2c0 1-6 2-14 2s-14-1-14-2V28z" fill="#F5F5F5"/>
      {/* Coffee */}
      <ellipse cx="30" cy="30" rx="12" ry="3" fill="#4E342E"/>
      <ellipse cx="30" cy="29.5" rx="11" ry="2.5" fill="#5D4037"/>
      <ellipse cx="28" cy="29" rx="4" ry="1" fill="#6D4C41" opacity="0.5"/>
      {/* Latte art */}
      <path d="M27 29c1.5-1 3-1 4.5 0s1 1.5 0 2-3 0-4 0-1.5-1.5-0.5-2z" fill="#BCAAA4" opacity="0.6"/>
      {/* Handle */}
      <path d="M44 32c4 0 6 2 6 5s-2 5-6 5" stroke="#E0E0E0" strokeWidth="3" fill="none"/>
      <path d="M44 33c3.5 0 5 1.5 5 4s-1.5 4-5 4" stroke="#BDBDBD" strokeWidth="2" fill="none"/>
      {/* Steam */}
      <path d="M24 22c0-3 2-5 1-8" stroke="#BDBDBD" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <path d="M30 20c0-3 1.5-4 0.5-7" stroke="#BDBDBD" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
      <path d="M36 22c0-3 2-5 1-8" stroke="#BDBDBD" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      {/* Shadow */}
      <ellipse cx="30" cy="56" rx="14" ry="1.5" fill="black" opacity="0.06"/>
    </svg>
  );
}

export function DessertIcon({ className = 'w-10 h-10' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Cake base */}
      <rect x="16" y="38" width="32" height="14" rx="4" fill="#F8BBD0"/>
      <rect x="16" y="38" width="32" height="14" rx="4" stroke="#F48FB1" strokeWidth="0.5"/>
      <rect x="18" y="42" width="28" height="8" rx="3" fill="#F48FB1" opacity="0.3"/>
      {/* Frosting drip */}
      <path d="M16 38c0-2 2-3 4-3h24c2 0 4 1 4 3" fill="#EC407A"/>
      <path d="M16 38c1 2 2 3 3 4" stroke="#F48FB1" strokeWidth="1.5" fill="none" opacity="0.3"/>
      <path d="M19 38v4c0 1 1 2 2 2" stroke="#F48FB1" strokeWidth="0" fill="#E91E63" opacity="0.3"/>
      <ellipse cx="20" cy="42" rx="1.5" ry="2.5" fill="#E91E63" opacity="0.4"/>
      <ellipse cx="26" cy="43" rx="1.5" ry="3" fill="#E91E63" opacity="0.4"/>
      <ellipse cx="38" cy="42.5" rx="1.5" ry="2.8" fill="#E91E63" opacity="0.4"/>
      <ellipse cx="44" cy="41.5" rx="1.5" ry="2" fill="#E91E63" opacity="0.4"/>
      {/* Top frosting */}
      <ellipse cx="32" cy="35" rx="14" ry="3.5" fill="#EC407A"/>
      <ellipse cx="32" cy="34.5" rx="13" ry="3" fill="#F06292"/>
      {/* Whipped cream swirls */}
      <circle cx="24" cy="32" r="3.5" fill="white"/>
      <circle cx="32" cy="31" r="4" fill="white"/>
      <circle cx="40" cy="32" r="3.5" fill="white"/>
      <circle cx="28" cy="30" r="2.5" fill="#FAFAFA"/>
      <circle cx="36" cy="30" r="2.5" fill="#FAFAFA"/>
      {/* Cherry */}
      <circle cx="32" cy="25" r="3.5" fill="#C62828"/>
      <circle cx="32" cy="25" r="3" fill="#D32F2F"/>
      <ellipse cx="31" cy="24" rx="1.2" ry="0.8" fill="#EF5350" opacity="0.6"/>
      {/* Stem */}
      <path d="M32 22c1-2 3-3 4-3" stroke="#2E7D32" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <path d="M35.5 19c0.5 0.5 1 0 1.5-0.5" fill="#4CAF50" stroke="#4CAF50" strokeWidth="0.5"/>
      {/* Sprinkles */}
      <rect x="20" y="44" width="2" height="1" rx="0.5" fill="#FF5722" transform="rotate(20 20 44)"/>
      <rect x="30" y="45" width="2" height="1" rx="0.5" fill="#2196F3" transform="rotate(-15 30 45)"/>
      <rect x="40" y="44" width="2" height="1" rx="0.5" fill="#FFEB3B" transform="rotate(30 40 44)"/>
      <rect x="25" y="46" width="2" height="1" rx="0.5" fill="#4CAF50" transform="rotate(-25 25 46)"/>
      <rect x="36" y="47" width="2" height="1" rx="0.5" fill="#9C27B0" transform="rotate(10 36 47)"/>
      {/* Shadow */}
      <ellipse cx="32" cy="55" rx="13" ry="2" fill="black" opacity="0.08"/>
    </svg>
  );
}

export function SupermarketIcon({ className = 'w-10 h-10' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shopping bag */}
      <path d="M16 24h32l-3 28H19L16 24z" fill="#4CAF50"/>
      <path d="M17 25h30l-2.8 26H19.8L17 25z" fill="#66BB6A"/>
      {/* Bag top fold */}
      <path d="M16 24h32v2c0 1-7 2-16 2s-16-1-16-2v-2z" fill="#388E3C"/>
      {/* Handles */}
      <path d="M24 24v-6c0-4.5 3.5-8 8-8s8 3.5 8 8v6" stroke="#2E7D32" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M24 24v-6c0-4.5 3.5-8 8-8s8 3.5 8 8v6" stroke="#4CAF50" strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* Items peeking out */}
      <rect x="22" y="20" width="4" height="8" rx="2" fill="#FF9800"/>
      <circle cx="22" cy="19" r="2.5" fill="#4CAF50"/>
      <rect x="34" y="19" width="5" height="9" rx="1.5" fill="#F44336"/>
      <ellipse cx="37" cy="18" rx="2" ry="1.5" fill="#FFEB3B"/>
      <rect x="28" y="21" width="4" height="6" rx="1" fill="#2196F3"/>
      {/* Bag texture/logo */}
      <circle cx="32" cy="40" r="5" fill="white" opacity="0.2"/>
      <path d="M30 38l2 4 2-4" stroke="white" strokeWidth="1.5" opacity="0.4" strokeLinecap="round"/>
      {/* Shadow */}
      <ellipse cx="32" cy="55" rx="12" ry="2" fill="black" opacity="0.08"/>
    </svg>
  );
}

export function PharmacyIcon({ className = 'w-10 h-10' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Medicine bottle */}
      <rect x="20" y="22" width="24" height="30" rx="4" fill="white" stroke="#E0E0E0" strokeWidth="1"/>
      <rect x="20" y="22" width="24" height="30" rx="4" fill="url(#bottleGrad)"/>
      {/* Cap */}
      <rect x="24" y="14" width="16" height="10" rx="3" fill="#00897B"/>
      <rect x="24" y="14" width="16" height="10" rx="3" stroke="#00796B" strokeWidth="0.5"/>
      <rect x="24" y="20" width="16" height="3" fill="#00796B"/>
      {/* Cross */}
      <rect x="29" y="30" width="6" height="16" rx="1.5" fill="#00897B"/>
      <rect x="25" y="35" width="14" height="6" rx="1.5" fill="#00897B"/>
      <rect x="30" y="31" width="4" height="14" rx="1" fill="#26A69A" opacity="0.5"/>
      <rect x="26" y="36" width="12" height="4" rx="1" fill="#26A69A" opacity="0.5"/>
      {/* Shine */}
      <rect x="22" y="24" width="3" height="12" rx="1.5" fill="white" opacity="0.15"/>
      {/* Pills beside */}
      <circle cx="50" cy="44" r="4" fill="#E91E63"/>
      <circle cx="50" cy="44" r="3.2" fill="#EC407A"/>
      <path d="M47 44h6" stroke="white" strokeWidth="0.8" opacity="0.5"/>
      <ellipse cx="52" cy="50" rx="3" ry="1.5" fill="#FF9800" transform="rotate(20 52 50)"/>
      <path d="M50 49.5l4 1" stroke="#F57C00" strokeWidth="0.5"/>
      {/* Shadow */}
      <ellipse cx="32" cy="55" rx="12" ry="2" fill="black" opacity="0.08"/>
      <defs>
        <linearGradient id="bottleGrad" x1="20" y1="22" x2="44" y2="52">
          <stop offset="0%" stopColor="white"/>
          <stop offset="100%" stopColor="#F5F5F5"/>
        </linearGradient>
      </defs>
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
