import { Product, DeliveryZone, Coupon, UserAddress } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Gourmet Truffle Ribeye Steak',
    price: 34.50,
    description: 'A 300g choice cut dry-aged prime ribeye steak cooked to perfection, lathered with fresh black winter truffle herb butter, and served alongside crispy rosemary-infused hand-cut potato wedges and charred organic asparagus spears. The ultimate dinner culinary experience.',
    category: 'Gourmet Suppers',
    rating: 4.9,
    reviewsCount: 124,
    reviews: [
      { id: 'rev-1-1', userName: 'Alex Mercer', rating: 5, comment: 'Hands down the best ribeye steak I have ever had delivered. Hot, perfectly medium-rare, and the truffle butter is absolutely incredible.', date: '2026-05-18' },
      { id: 'rev-1-2', userName: 'Diana Prince', rating: 4.8, comment: 'The quality of the cut is amazing. Soft, rich of marbling, and extremely succulent. Wedges were still very crispy!', date: '2026-05-22' }
    ],
    image: '🥩',
    nutrition: { calories: 840, protein: '62g', carbs: '28g', fat: '54g' },
    weights: ['300g Port', '450g King Cut'],
    stock: 15,
    isDeal: true,
    dealPrice: 29.99,
    dealTimeRemaining: 7400,
    brand: 'Supper Butchery',
    isBestSeller: true,
    tags: ['Premium', 'High Protein', 'Chef’s Special']
  },
  {
    id: 'prod-2',
    name: 'Wild Mushroom Cream Gnocchi',
    price: 18.20,
    description: 'Pillow-soft hand-rolled potato gnocchi sautéed with a luxurious mixture of chanterelle, shiitake, and brown cremini mushrooms, simmered in a heavy white wine garlic cream sauce and topped with aged parmigiano-reggiano and freshly snipped organic chives.',
    category: 'Italian Specials',
    rating: 4.7,
    reviewsCount: 89,
    reviews: [
      { id: 'rev-2-1', userName: 'Julian V.', rating: 5, comment: 'So velvety and rich. Tastes exactly like a high-end Italian trattoria!', date: '2026-05-20' }
    ],
    image: '🍝',
    nutrition: { calories: 650, protein: '14g', carbs: '88g', fat: '26g' },
    weights: ['Standard Portion', 'Family Share Size'],
    stock: 22,
    brand: 'Nona’s Kitchen',
    tags: ['Vegetarian', 'Comfort Food']
  },
  {
    id: 'prod-3',
    name: 'Smoked Salmon Avocado Bowl',
    price: 16.50,
    description: 'Delicately hickory-smoked Atlantic salmon fillets served on a bed of warm Japanese sushi rice, paired with sliced Hass avocado, pickled heritage ginger, crispy edamame beans, ribboned cucumber, raw shredded seaweed, and drizzled with a rich organic wasabi-mayo glaze.',
    category: 'Healthy & Fresh',
    rating: 4.8,
    reviewsCount: 204,
    reviews: [
      { id: 'rev-3-1', userName: 'Claire Redfield', rating: 5, comment: 'So clean, fresh, and extremely filling. Perfect for a quick supper when staying health-conscious.', date: '2026-05-24' }
    ],
    image: '🥗',
    nutrition: { calories: 512, protein: '28g', carbs: '44g', fat: '24g' },
    weights: ['Standard Bowl', 'Double-Protein Bowl'],
    stock: 30,
    brand: 'Green & Lean',
    isBestSeller: true,
    tags: ['Keto-Friendly', 'Omega-3', 'Fresh']
  },
  {
    id: 'prod-4',
    name: 'Slow-Cooked Pulled Pork Bun',
    price: 14.99,
    description: 'Twelve-hour hickory-smoked pork shoulder, shredded and soaked in our signature sweet and tangy whiskey barbecue sauce, piled high on a sweet toasted brioche bun topped with refreshing apple-cabbage slaw and crunchy dill pickle chips.',
    category: 'Gourmet Suppers',
    rating: 4.6,
    reviewsCount: 142,
    reviews: [
      { id: 'rev-4-1', userName: 'Marcus F.', rating: 4, comment: 'Brilliant pork flavor, incredibly juicy. The pickles give matching crunch!', date: '2026-05-15' }
    ],
    image: '🍔',
    nutrition: { calories: 710, protein: '38g', carbs: '65g', fat: '32g' },
    weights: ['Single Burger', 'Double Slider Combo'],
    stock: 18,
    isDeal: true,
    dealPrice: 12.50,
    dealTimeRemaining: 15400,
    brand: 'Smokehouse BBQ',
    tags: ['Meat-Lover', 'Juicy']
  },
  {
    id: 'prod-5',
    name: 'Premium Neapolitan Pepperoni Pizza',
    price: 19.50,
    description: 'Stretched naturally-leavened sourdough base baked in a premium stone deck oven, lathered with San Marzano tomato puree, hand-torn buffalo mozzarella, spicy calabrian artisan pepperoni coins, fresh organic basil leaves, and finished with hot chilli honey.',
    category: 'Italian Specials',
    rating: 4.9,
    reviewsCount: 310,
    reviews: [
      { id: 'rev-5-1', userName: 'Sophia L.', rating: 5, comment: 'The hot honey drizzle makes this pizza absolutely spectacular! Crustic crust.', date: '2026-05-23' }
    ],
    image: '🍕',
    nutrition: { calories: 920, protein: '42g', carbs: '110g', fat: '34g' },
    weights: ['12-inch Woodfire', '16-inch Giant Group'],
    stock: 40,
    brand: 'Bella Italia',
    isBestSeller: true,
    tags: ['Woodfire', 'Sourdough', 'Best Seller']
  },
  {
    id: 'prod-6',
    name: 'Organic Heirloom Tomato Basket',
    price: 8.50,
    description: 'A rustic basket containing 1kg of fresh, hand-harvested organic heirloom tomatoes. Includes full, rich variants of Cherokee Purple, Goldie, and Brandywine. Juicy, sweet, and ideal for creating authentic Caprese salads or fresh pasta bases.',
    category: 'Fresh Groceries',
    rating: 4.7,
    reviewsCount: 45,
    reviews: [
      { id: 'rev-6-1', userName: 'Tom G.', rating: 5, comment: 'So sweet and earthy! You cannot buy tomatoes this good at standard grocery stores.', date: '2026-05-17' }
    ],
    image: '🍅',
    nutrition: { calories: 80, protein: '4g', carbs: '18g', fat: '1g' },
    weights: ['500g Pack', '1kg Basket'],
    stock: 25,
    brand: 'Meadow Farms',
    tags: ['Organic', 'Farm Fresh', 'Vegan']
  },
  {
    id: 'prod-7',
    name: 'A5 Wagyu Burger Patty Extra Only',
    price: 24.00,
    description: 'Raw, fresh A5 Grade imports of Japanese wagyu beef burger patties. Boasts a massive marbling score of 12 for unparalleled moisture, velvet bite, and intense unctuous beef aroma. Perfect for pan-searing or flame grilling at home.',
    category: 'Fresh Groceries',
    rating: 4.9,
    reviewsCount: 56,
    reviews: [
      { id: 'rev-7-1', userName: 'Gordon R.', rating: 5, comment: 'Unbelievable melt-in-your-mouth marbling. Highly recommended luxury item.', date: '2026-05-21' }
    ],
    image: '🥩',
    nutrition: { calories: 512, protein: '34g', carbs: '0g', fat: '42g' },
    weights: ['Single (180g)', 'Twin Pack (360g)'],
    stock: 12,
    brand: 'Supper Butchery',
    tags: ['Rare Import', 'Luxury', 'Keto']
  },
  {
    id: 'prod-8',
    name: 'Decadent Belgian Lava Fondant',
    price: 8.99,
    description: 'An enriched luxury cocoa chocolate sponge with a warm oozing core of 72% dark Belgian chocolate ganache. Served cold, ready to pop in your microwave for 25 seconds for a heavenly hot-and-cold fudge pudding, complete with a tub of organic vanilla bean gelato.',
    category: 'Desserts & Sweets',
    rating: 4.9,
    reviewsCount: 220,
    reviews: [
      { id: 'rev-8-1', userName: 'Lana D.', rating: 5, comment: 'Pure bliss. This molten core is incredible. Matches the vanilla gelato perfectly.', date: '2026-05-24' }
    ],
    image: '🧁',
    nutrition: { calories: 480, protein: '6g', carbs: '52g', fat: '28g' },
    weights: ['Single Serving', 'Family Pack of 4'],
    stock: 35,
    isDeal: true,
    dealPrice: 6.99,
    dealTimeRemaining: 9800,
    brand: 'Sweet Indulgence',
    isBestSeller: true,
    tags: ['Sweet', 'Premium Chocolate']
  },
  {
    id: 'prod-9',
    name: 'Aura Fresh Cold-Pressed Juice',
    price: 6.50,
    description: 'Raw, unpasteurized cold-pressed wellness elixirs containing organic ginger, crisp Granny Smith apples, leafy greens, wild honey, and freshly squeezed key limes. Packed with live digestive enzymes and high immunizing vitamin C.',
    category: 'Drinks & Elixirs',
    rating: 4.8,
    reviewsCount: 102,
    reviews: [
      { id: 'rev-9-1', userName: 'Mia K.', rating: 5, comment: 'Incredibly zesty and clean. Great morning starter or supper accompaniment.', date: '2026-05-22' }
    ],
    image: '🍹',
    nutrition: { calories: 120, protein: '2g', carbs: '26g', fat: '0g' },
    weights: ['250ml Shot', '500ml Bottle'],
    stock: 50,
    brand: 'Green & Lean',
    tags: ['Organic', 'Cold Pressed', 'Detox']
  }
];

export const INITIAL_DELIVERY_ZONES: DeliveryZone[] = [
  { id: 'zone-1', name: 'Downtown Core', suburbs: 'Business District, Metro Area, West End', price: 2.50, minOrder: 15.00, etaRange: '15 - 30 MINS', isActive: true },
  { id: 'zone-2', name: 'Suburban North', suburbs: 'Highlands, Pinewood, Greenwood Valley', price: 4.99, minOrder: 25.00, etaRange: '25 - 45 MINS', isActive: true },
  { id: 'zone-3', name: 'Coastal South & Harbour', suburbs: 'Marina Walk, Fisherman Cove, Sandy Crest', price: 6.50, minOrder: 30.00, etaRange: '35 - 55 MINS', isActive: true },
  { id: 'zone-4', name: 'Industrial East (Express Only)', suburbs: 'Tech Park, Old Warehouse Yards', price: 8.00, minOrder: 40.00, etaRange: '40 - 60 MINS', isActive: false }
];

export const INITIAL_COUPONS: Coupon[] = [
  { code: 'SUPPER10', type: 'flat', value: 10.00, minOrder: 30.00, isActive: true, description: '$10 Off on orders above $30' },
  { code: 'ORGANIC20', type: 'percent', value: 20, minOrder: 50.00, isActive: true, description: '20% discount on orders above $50' },
  { code: 'DRINKS5', type: 'flat', value: 5.00, minOrder: 15.00, isActive: true, description: '$5 Off on refreshments & starters' },
  { code: 'FREEDEL', type: 'percent', value: 100, minOrder: 80.00, isActive: false, description: 'Free delivery for orders above $80' }
];

export const INITIAL_FAQS = [
  { q: 'How does Supper Shop deliver?', a: 'Supper Shop coordinates with local micro-fulfillment spaces and dedicated flash riders to ensure hot cooked meals arrive piping hot in thermal secure boxes, while raw organic ingredients are insulated with non-toxic cooling gel packs.' },
  { q: 'What are your food safety certifications?', a: 'All partner butcheries, home style kitchens, and transport networks are daily audited and certified strictly under Grade-A USDA, Local Health, and safe HACCP guidelines.' },
  { q: 'Can I pre-plan/pre-schedule a delivery?', a: 'Absolutely! At the checkout stage, you can toggling delivery from "Express Now" to "Scheduled Later", specifying any 30-minute interval window up to 7 days in advance.' },
  { q: 'How do loyalty points accumulate?', a: 'For every single dollar ($1.00) you spend, you receive 1 Loyalty Point automatically. Points can be exchanged inside your profile section for customized promotional vouchers.' },
  { q: 'What is the return policy for groceries?', a: 'If you are not entirely satisfied with the freshness of any grocery or prepared item, simply capture a photo and raise a ticket under our Support portal within 2 hours of delivery for an instant, complete refund/credits.' }
];

export const INITIAL_ADDRESSES: UserAddress[] = [
  { id: 'addr-1', label: '🏡 Home', recipient: 'Patrick Phiri', addressLines: 'Apt 42B, Sunset Boulevard, Downtown Core', phone: '+1 (555) 732-2342', isDefault: true },
  { id: 'addr-2', label: '💼 Office', recipient: 'Patrick Phiri - Dev Tech', addressLines: 'Suite 900, Innovation Tower, Tech District', phone: '+1 (555) 234-9011', isDefault: false }
];
