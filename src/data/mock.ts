export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  logo: string;
  rating: number;
  reviews: number;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  isOpen: boolean;
  categories: string[];
  distance: string;
  freeDelivery?: boolean;
  isNew?: boolean;
  hasPromo?: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  extras?: Extra[];
  removable?: string[];
}

export interface Extra {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  extras: Extra[];
  removed: string[];
  notes: string;
}

export interface Order {
  id: string;
  restaurant: string;
  items: CartItem[];
  total: number;
  status: 'confirmed' | 'preparing' | 'on_the_way' | 'delivered';
  estimatedTime: number;
  createdAt: string;
}

export const categories: Category[] = [
  { id: '1', name: 'Fast Food', icon: '🍔', slug: 'fast-food' },
  { id: '2', name: 'Pizza', icon: '🍕', slug: 'pizza' },
  { id: '3', name: 'Frango', icon: '🍗', slug: 'frango' },
  { id: '4', name: 'Moçambicana', icon: '🍛', slug: 'mocambicana' },
  { id: '5', name: 'Sushi', icon: '🍣', slug: 'sushi' },
  { id: '6', name: 'Cafés', icon: '☕', slug: 'cafes' },
  { id: '7', name: 'Sobremesas', icon: '🍰', slug: 'sobremesas' },
  { id: '8', name: 'Supermercado', icon: '🛒', slug: 'supermercado' },
  { id: '9', name: 'Farmácia', icon: '💊', slug: 'farmacia' },
];

export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Mundo\'s Restaurant',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop',
    logo: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=100&h=100&fit=crop',
    rating: 4.8,
    reviews: 342,
    deliveryTime: '25-35 min',
    deliveryFee: 50,
    minOrder: 200,
    isOpen: true,
    categories: ['mocambicana', 'frango'],
    distance: '1.2 km',
    freeDelivery: true,
    hasPromo: true,
  },
  {
    id: '2',
    name: 'Pizza House Maputo',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=400&fit=crop',
    logo: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=100&h=100&fit=crop',
    rating: 4.5,
    reviews: 567,
    deliveryTime: '30-45 min',
    deliveryFee: 75,
    minOrder: 300,
    isOpen: true,
    categories: ['pizza', 'fast-food'],
    distance: '2.3 km',
    hasPromo: true,
  },
  {
    id: '3',
    name: 'Sushi Master',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&h=400&fit=crop',
    logo: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=100&h=100&fit=crop',
    rating: 4.9,
    reviews: 189,
    deliveryTime: '40-55 min',
    deliveryFee: 100,
    minOrder: 500,
    isOpen: true,
    categories: ['sushi'],
    distance: '3.5 km',
    isNew: true,
  },
  {
    id: '4',
    name: 'Café Central',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=400&fit=crop',
    logo: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100&h=100&fit=crop',
    rating: 4.6,
    reviews: 234,
    deliveryTime: '15-25 min',
    deliveryFee: 30,
    minOrder: 100,
    isOpen: true,
    categories: ['cafes', 'sobremesas'],
    distance: '0.8 km',
    freeDelivery: true,
  },
  {
    id: '5',
    name: 'Frango Piri-Piri',
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800&h=400&fit=crop',
    logo: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=100&h=100&fit=crop',
    rating: 4.7,
    reviews: 891,
    deliveryTime: '20-30 min',
    deliveryFee: 45,
    minOrder: 150,
    isOpen: true,
    categories: ['frango', 'mocambicana'],
    distance: '1.8 km',
    freeDelivery: true,
  },
  {
    id: '6',
    name: 'Burger King Maputo',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=400&fit=crop',
    logo: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=100&h=100&fit=crop',
    rating: 4.3,
    reviews: 1234,
    deliveryTime: '20-35 min',
    deliveryFee: 60,
    minOrder: 200,
    isOpen: false,
    categories: ['fast-food'],
    distance: '2.1 km',
  },
  {
    id: '7',
    name: 'Doce Tentação',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&h=400&fit=crop',
    logo: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100&h=100&fit=crop',
    rating: 4.8,
    reviews: 456,
    deliveryTime: '25-40 min',
    deliveryFee: 55,
    minOrder: 150,
    isOpen: true,
    categories: ['sobremesas', 'cafes'],
    distance: '1.5 km',
    isNew: true,
  },
  {
    id: '8',
    name: 'Supermercado ShopRite',
    image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&h=400&fit=crop',
    logo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=100&h=100&fit=crop',
    rating: 4.2,
    reviews: 678,
    deliveryTime: '45-60 min',
    deliveryFee: 80,
    minOrder: 500,
    isOpen: true,
    categories: ['supermercado'],
    distance: '3.0 km',
  },
];

export const menuItems: MenuItem[] = [
  // Entradas
  {
    id: 'm1',
    name: 'Rissóis de Camarão',
    description: 'Deliciosos rissóis crocantes recheados com camarão fresco da costa moçambicana',
    price: 180,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
    category: 'Entradas',
    extras: [
      { id: 'e1', name: 'Molho piri-piri', price: 20 },
      { id: 'e2', name: 'Molho de alho', price: 20 },
    ],
  },
  {
    id: 'm2',
    name: 'Samosas de Carne',
    description: 'Samosas tradicionais recheadas com carne temperada e especiarias',
    price: 120,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
    category: 'Entradas',
    extras: [
      { id: 'e3', name: 'Molho de manga', price: 25 },
    ],
  },
  {
    id: 'm3',
    name: 'Sopa de Marisco',
    description: 'Sopa rica com camarão, caranguejo e peixe fresco',
    price: 250,
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
    category: 'Entradas',
  },
  // Pratos Principais
  {
    id: 'm4',
    name: 'Matapa com Camarão',
    description: 'Prato tradicional moçambicano com folhas de mandioca, amendoim e camarão grelhado',
    price: 450,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    category: 'Pratos Principais',
    extras: [
      { id: 'e4', name: 'Arroz extra', price: 50 },
      { id: 'e5', name: 'Camarão extra', price: 150 },
    ],
    removable: ['Amendoim', 'Coco'],
  },
  {
    id: 'm5',
    name: 'Frango Piri-Piri',
    description: 'Meio frango grelhado com molho piri-piri caseiro, acompanhado de batata frita e salada',
    price: 380,
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&h=300&fit=crop',
    category: 'Pratos Principais',
    extras: [
      { id: 'e6', name: 'Frango inteiro (+metade)', price: 200 },
      { id: 'e7', name: 'Molho extra', price: 30 },
    ],
    removable: ['Salada', 'Batata frita'],
  },
  {
    id: 'm6',
    name: 'Camarão Grelhado',
    description: 'Camarão tigre grelhado com manteiga de alho e limão, servido com arroz',
    price: 650,
    image: 'https://images.unsplash.com/photo-1565680018093-ebb6b9e3b960?w=400&h=300&fit=crop',
    category: 'Pratos Principais',
    extras: [
      { id: 'e8', name: 'Arroz de coco', price: 60 },
    ],
  },
  {
    id: 'm7',
    name: 'Xima com Caril de Galinha',
    description: 'Xima tradicional acompanhada de caril de galinha com amendoim',
    price: 320,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    category: 'Pratos Principais',
    extras: [
      { id: 'e9', name: 'Porção extra de xima', price: 40 },
    ],
    removable: ['Amendoim'],
  },
  // Bebidas
  {
    id: 'm8',
    name: 'Sumo de Mango',
    description: 'Sumo natural de manga fresca, sem açúcar adicionado',
    price: 80,
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=300&fit=crop',
    category: 'Bebidas',
  },
  {
    id: 'm9',
    name: '2M Cerveja',
    description: 'Cerveja 2M gelada, 330ml',
    price: 100,
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=300&fit=crop',
    category: 'Bebidas',
  },
  {
    id: 'm10',
    name: 'Água de Coco',
    description: 'Água de coco natural, refrescante e hidratante',
    price: 60,
    image: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400&h=300&fit=crop',
    category: 'Bebidas',
  },
  // Sobremesas
  {
    id: 'm11',
    name: 'Bolo de Chocolate',
    description: 'Fatia generosa de bolo de chocolate com ganache',
    price: 150,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
    category: 'Sobremesas',
  },
  {
    id: 'm12',
    name: 'Pudim de Caramelo',
    description: 'Pudim cremoso com calda de caramelo caseira',
    price: 120,
    image: 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=400&h=300&fit=crop',
    category: 'Sobremesas',
  },
];

export const promotions = [
  {
    id: 'p1',
    title: 'Primeira entrega grátis!',
    description: 'Use o código BEMVINDO',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=300&fit=crop',
    color: 'from-primary-500 to-primary-600',
  },
  {
    id: 'p2',
    title: '30% OFF em Pizza',
    description: 'Válido até domingo',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=300&fit=crop',
    color: 'from-secondary-500 to-secondary-600',
  },
  {
    id: 'p3',
    title: 'Combo Familiar',
    description: '4 pratos + bebidas por 999 MT',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=300&fit=crop',
    color: 'from-purple-500 to-purple-600',
  },
];
