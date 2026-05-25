import React from 'react';
import { ShoppingCart, User, ShieldCheck, HelpCircle, Utensils, Search, Award } from 'lucide-react';
import { CartItem, UserProfile } from '../types';

interface NavbarProps {
  activeTab: 'storefront' | 'cart' | 'account' | 'admin' | 'support';
  setActiveTab: (tab: 'storefront' | 'cart' | 'account' | 'admin' | 'support') => void;
  cart: CartItem[];
  user: UserProfile;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setIsCartOpen: (open: boolean) => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  cart,
  user,
  searchQuery,
  setSearchQuery,
  setIsCartOpen,
}: NavbarProps) {
  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header id="global-header" className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 shadow-xs">
      {/* Promo Bar */}
      <div className="bg-neutral-900 text-white text-xs py-2 px-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="font-medium tracking-tight">🚚 Express Fresh Delivery Zones active near you. Order by 8 PM for same-day delivery!</span>
          <div className="hidden sm:flex items-center space-x-4">
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold text-amber-400">{user.loyaltyPoints} Points</span> ({user.tier} Member)
            </span>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo Brand Title */}
          <div 
            onClick={() => { setActiveTab('storefront'); setSearchQuery(''); }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="p-2.5 bg-neutral-900 text-white rounded-xl transition-all duration-300 group-hover:bg-amber-500 group-hover:rotate-6">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-neutral-900">
                Supper<span className="text-amber-500">Shop</span>
              </h1>
              <p className="text-[10px] text-gray-500 tracking-wider uppercase font-semibold">Gourmet Food & Organic Market</p>
            </div>
          </div>

          {/* Inline Active Search Finder */}
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search gourmet suppers, fresh groceries, sweets..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'storefront') {
                  setActiveTab('storefront');
                }
              }}
              className="w-full bg-gray-50 text-sm text-neutral-900 placeholder-gray-400 pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200"
            />
          </div>

          {/* Action Tabs & Icons */}
          <nav className="flex items-center gap-1 sm:gap-2">
            
            {/* Storefront Tab */}
            <button
              onClick={() => { setActiveTab('storefront'); setSearchQuery(''); }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'storefront'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span className="hidden md:inline">Storefront</span>
            </button>

            {/* Support Tab */}
            <button
              onClick={() => setActiveTab('support')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'support'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden md:inline">Support</span>
            </button>

            {/* Admin Backdoor */}
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'admin'
                  ? 'bg-amber-100 text-amber-950 border border-amber-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span className="hidden md:inline font-semibold">Admin Panel</span>
            </button>

            <span className="h-6 w-px bg-gray-200 mx-1 sm:mx-2" />

            {/* Account Profile Tab */}
            <button
              onClick={() => setActiveTab('account')}
              className={`relative flex items-center gap-2 p-2 rounded-xl transition-all duration-200 ${
                activeTab === 'account'
                  ? 'bg-gray-100 text-amber-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="User Account"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                <img referrerPolicy="no-referrer" src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              </div>
              <span className="text-xs font-semibold text-gray-800 hidden lg:inline max-w-[80px] truncate">{user.name}</span>
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 transition-all duration-200 group"
              title="Open Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5 transition-transform duration-200 group-hover:scale-105" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse border-2 border-white">
                  {totalCartItems}
                </span>
              )}
            </button>

          </nav>
        </div>
      </div>
    </header>
  );
}
