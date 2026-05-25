export interface Nutrition {
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  rating: number;
  reviewsCount: number;
  reviews: Review[];
  image: string;
  nutrition: Nutrition;
  weights: string[];
  stock: number;
  isDeal?: boolean;
  dealPrice?: number;
  dealTimeRemaining?: number; // mock seconds left
  brand: string;
  isBestSeller?: boolean;
  tags: string[];
}

export interface CartItem {
  id: string; // cart item unique id (product.id + '-' + weight)
  product: Product;
  quantity: number;
  selectedWeight: string;
  notes?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  total: number;
  addressName: string;
  addressLines: string;
  phone: string;
  paymentMethod: string;
  status: 'pending' | 'preparing' | 'dispatched' | 'delivered' | 'cancelled';
  progress: number; // 0 to 100 for visual progression
  date: string;
  eta: string;
  notes?: string;
  invoiceNumber: string;
}

export interface UserAddress {
  id: string;
  label: string; // e.g., Home, Work
  recipient: string;
  addressLines: string;
  phone: string;
  isDefault: boolean;
}

export type UserTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export interface LoyaltyPointsLog {
  id: string;
  points: number;
  type: 'earned' | 'redeemed';
  description: string;
  date: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  addresses: UserAddress[];
  loyaltyPoints: number;
  tier: UserTier;
  wishlist: string[]; // list of product IDs
  pointsLog: LoyaltyPointsLog[];
}

export interface DeliveryZone {
  id: string;
  name: string;
  suburbs: string;
  price: number;
  minOrder: number;
  etaRange: string;
  isActive: boolean;
}

export interface Coupon {
  code: string;
  type: 'percent' | 'flat';
  value: number; // e.g. 15 for 15% or 10 for $10
  minOrder: number;
  isActive: boolean;
  description: string;
}

export interface ChatMessage {
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
  status: 'Open' | 'Resolved';
  date: string;
  chat: ChatMessage[];
}
