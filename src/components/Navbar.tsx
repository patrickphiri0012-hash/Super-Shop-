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
    <header id="global-header" className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100/80 shadow-xs">
      {/* Promo Bar */}
      <div className="bg-slate-950 text-white text-[11px] py-2 px-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center tracking-tight">
          <span className="font-medium text-slate-300">🚚 Daily Express Delivery active. Order by 8 PM for prompt local fulfillment.</span>
          <div className="hidden sm:flex items-center space-x-4">
            <span className="flex items-center gap-1 text-slate-200">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-emerald-400">{user.loyaltyPoints} Points</span> ({user.tier} Member)
            </span>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo Brand Title */}
          <div 
            onClick={() => { setActiveTab('storefront'); setSearchQuery(''); }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="p-2.5 bg-slate-950 text-white rounded-xl transition-all duration-350 group-hover:bg-emerald-600">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                Supper<span className="text-emerald-650">Shop</span>
              </h1>
              <p className="text-[9px] text-slate-400 tracking-widest uppercase font-bold">Gourmet Food & Organic Artisans</p>
            </div>
          </div>

          {/* Inline Active Search Finder */}
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search gourmet meals, organic groceries, pantry goods..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'storefront') {
                  setActiveTab('storefront');
                }
              }}
              className="w-full bg-slate-50 text-sm text-slate-900 placeholder-slate-400 pl-10 pr-4 py-2 rounded-xl border border-slate-200/70 focus:outline-hidden focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all duration-200"
            />
          </div>

          {/* Action Tabs & Icons */}
          <nav className="flex items-center gap-1 sm:gap-1.5 animate-fade-in">
            
            {/* Storefront Tab */}
            <button
              onClick={() => { setActiveTab('storefront'); setSearchQuery(''); }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-tight transition-all duration-200 ${
                activeTab === 'storefront'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-955'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>Storefront</span>
            </button>

            {/* Support Tab */}
            <button
              onClick={() => setActiveTab('support')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-tight transition-all duration-200 ${
                activeTab === 'support'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-955'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Support</span>
            </button>

            {/* Admin Backdoor */}
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-tight transition-all duration-200 ${
                activeTab === 'admin'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 ${activeTab === 'admin' ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className="hidden md:inline font-bold">Admin</span>
            </button>

            <span className="h-5 w-px bg-slate-200 mx-1 sm:mx-1.5" />

            {/* Account Profile Tab */}
            <button
              onClick={() => setActiveTab('account')}
              className={`relative flex items-center gap-2 p-1.5 rounded-xl transition-all duration-200 ${
                activeTab === 'account'
                  ? 'bg-slate-50 text-emerald-650'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
              title="User Account"
            >
              <div className="w-7 h-7 rounded-full overflow-hidden border border-slate-200/55">
                <img referrerPolicy="no-referrer" src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              </div>
              <span className="text-xs font-semibold text-slate-700 hidden lg:inline max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 transition-all duration-200 group"
              title="Open Shopping Cart"
            >
              <ShoppingCart className="w-4.5 h-4.5 transition-transform duration-250 group-hover:scale-105" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
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
