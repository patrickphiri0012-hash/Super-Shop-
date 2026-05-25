import React, { useState, useEffect } from 'react';
import { Star, ShieldAlert, BadgeCheck, Clock, Plus, Flame, Heart, ArrowRight, Sparkles, Filter, SlidersHorizontal, ShoppingBag } from 'lucide-react';
import { Product, CartItem, UserProfile } from '../types';

interface StorefrontProps {
  products: Product[];
  user: UserProfile;
  toggleWishlist: (productId: string) => void;
  addToCart: (product: Product, quantity: number, weight: string, notes: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Storefront({
  products,
  user,
  toggleWishlist,
  addToCart,
  searchQuery,
  setSearchQuery,
}: StorefrontProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Modal customization states
  const [customQty, setCustomQty] = useState<number>(1);
  const [customWeight, setCustomWeight] = useState<string>('');
  const [customNotes, setCustomNotes] = useState<string>('');
  const [reviewTab, setReviewTab] = useState<'desc' | 'nutrition' | 'reviews'>('desc');
  
  // Custom user review input
  const [newReviewAuthor, setNewReviewAuthor] = useState<string>(user.name || '');
  const [newReviewRating, setNewReviewRating] = useState<number>(5);
  const [newReviewComment, setNewReviewComment] = useState<string>('');
  const [reviewsList, setReviewsList] = useState<any[]>([]);

  // Local simulated deal countdown timer
  const [timeLeft, setTimeLeft] = useState<number>(12400);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 12400));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  // Sync reviews when product changes
  useEffect(() => {
    if (selectedProduct) {
      setReviewsList(selectedProduct.reviews);
      setCustomQty(1);
      setCustomWeight(selectedProduct.weights[0] || '');
      setCustomNotes('');
      setReviewTab('desc');
      setNewReviewComment('');
    }
  }, [selectedProduct]);

  // Filter & Sort core logic
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aPrice = a.isDeal && a.dealPrice ? a.dealPrice : a.price;
    const bPrice = b.isDeal && b.dealPrice ? b.dealPrice : b.price;

    if (sortBy === 'price-asc') return aPrice - bPrice;
    if (sortBy === 'price-desc') return bPrice - aPrice;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'bestseller') return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
    return 0; // featured default
  });

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;

    const addedReview = {
      id: `rev-added-${Date.now()}`,
      userName: newReviewAuthor || 'Anonymous Gourmet',
      rating: newReviewRating,
      comment: newReviewComment.trim(),
      date: new Date().toISOString().split('T')[0],
    };

    const updatedReviews = [addedReview, ...reviewsList];
    setReviewsList(updatedReviews);

    // Recalculate average rating of products theoretically
    if (selectedProduct) {
      const totalRatings = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
      selectedProduct.rating = parseFloat((totalRatings / updatedReviews.length).toFixed(1));
      selectedProduct.reviewsCount = updatedReviews.length;
    }

    setNewReviewComment('');
  };

  // Get gradient based on index or category for stunning visuals
  const getProductGradient = (category: string) => {
    switch (category) {
      case 'Gourmet Suppers':
        return 'from-rose-50 to-orange-100 hover:from-rose-100 hover:to-orange-200';
      case 'Italian Specials':
        return 'from-amber-50 to-yellow-100 hover:from-amber-100 hover:to-yellow-200';
      case 'Healthy & Fresh':
        return 'from-emerald-50 to-teal-100 hover:from-emerald-100 hover:to-teal-200';
      case 'Fresh Groceries':
        return 'from-green-50 to-lime-100 hover:from-green-100 hover:to-lime-200';
      case 'Desserts & Sweets':
        return 'from-fuchsia-50 to-pink-100 hover:from-fuchsia-100 hover:to-pink-200';
      default:
        return 'from-blue-50 to-slate-100 hover:from-blue-100 hover:to-slate-200';
    }
  };

  const getEmojiClass = (category: string) => {
    switch (category) {
      case 'Gourmet Suppers': return 'text-orange-600';
      case 'Italian Specials': return 'text-amber-600';
      case 'Healthy & Fresh': return 'text-emerald-600';
      case 'Fresh Groceries': return 'text-green-600';
      default: return 'text-amber-500';
    }
  };

  const dealsProducts = products.filter((p) => p.isDeal);
  const bestsellerProducts = products.filter((p) => p.isBestSeller && !p.isDeal);

  return (
    <div id="storefront-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* 1. Hero Promo Section */}
      <section id="storefront-hero" className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white mb-10 p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-xl z-10">
          <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full mb-6 uppercase tracking-wider">
            <Sparkles className="w-3 h-3" /> Chef’s Seasonal Selection
          </span>
          <h2 className="text-3.5xl sm:text-5xl font-black tracking-tight leading-tight">
            Elevate Your Supper. <br />
            <span className="text-emerald-500">Delivered Fresh.</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-350 leading-relaxed font-sans font-light">
            Freshly processed farm-to-table ingredients and professional chef-prepared meals. Delivery speed zoned within your local micro-neighborhood.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => {
                setSelectedCategory('Gourmet Suppers');
                document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-500 active:translate-y-px transition-all duration-200 flex items-center gap-2 text-sm"
            >
              Order Gourmet Suppers <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setSelectedCategory('Fresh Groceries');
                document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-slate-800 text-slate-205 border border-slate-705 font-semibold rounded-xl hover:bg-slate-700 transition-all duration-200 text-sm"
            >
              Browse Groceries
            </button>
          </div>
        </div>

        {/* Floating Best Seller Badge */}
        <div className="absolute bottom-6 right-6 hidden lg:flex items-center gap-3 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-lg">
          <span className="text-3xl">🥩</span>
          <div>
            <p className="text-xs text-emerald-400 uppercase tracking-widest font-extrabold font-mono">Today’s Top Choice</p>
            <h4 className="text-sm font-semibold text-white">Gourmet Truffle Ribeye</h4>
            <p className="text-xs text-slate-400">300g choice cuts • Slashed to $29.99</p>
          </div>
        </div>
      </section>

      {/* 2. Deals Countdown Bar */}
      {dealsProducts.length > 0 && (
        <section id="deals-countdown-section" className="mb-12 bg-slate-50 border border-slate-150 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-600 text-white rounded-xl animate-pulse">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Flash Gourmet Handcrafted Specials</h3>
                <p className="text-sm text-slate-500">Premium chef kitchen recipes at limited friendly prices.</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 ml-0 md:ml-auto">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-widest bg-slate-205/50 px-3 py-1.5 rounded-lg flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" /> Ending In:
              </span>
              <div className="font-mono font-bold text-lg text-emerald-400 tracking-wider bg-slate-950 px-3.5 py-1.5 rounded-lg border border-slate-800 shadow-inner">
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>

          {/* Flash items list */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {dealsProducts.map((p) => {
              const discountPercent = Math.round(((p.price - (p.dealPrice || p.price)) / p.price) * 100);
              return (
                <div 
                  key={`deal-${p.id}`} 
                  onClick={() => setSelectedProduct(p)}
                  className="bg-white border border-slate-100 rounded-xl p-4 flex gap-4 items-center cursor-pointer hover:border-emerald-300 transition-all hover:bg-slate-50/20 shadow-xs group"
                >
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl shrink-0 bg-gradient-to-tr ${getProductGradient(p.category)}`}>
                    {p.image}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] bg-emerald-600 text-white font-semibold px-2 py-0.5 rounded-xs">-{discountPercent}% OFF</span>
                    <h4 className="text-sm font-bold text-neutral-900 truncate mt-1 group-hover:text-emerald-600">{p.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-black text-neutral-950">${p.dealPrice?.toFixed(2)}</span>
                      <span className="text-xs text-gray-400 line-through">${p.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 3. Catalog Filters Bar & Sorting */}
      <section id="catalog" className="scroll-mt-24 mb-8">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border-b border-gray-100 pb-5">
          {/* Category Chips Scroller */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none max-w-full">
            <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1 shrink-0 mr-2">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {categories.map((cat) => (
              <button
                key={`cat-btn-${cat}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold tracking-tight whitespace-nowrap transition-all duration-200 shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-650 hover:bg-slate-200/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Menu Select */}
          <div className="flex items-center gap-2.5 shrink-0 self-end lg:self-auto">
            <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white text-xs font-bold text-slate-900 border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500"
            >
              <option value="featured">Featured Picks</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated ⭐</option>
              <option value="bestseller">In Demand 🔥</option>
            </select>
          </div>
        </div>

        {/* Search status summary if viewing searches */}
        {searchQuery && (
          <div className="mt-4 text-sm text-slate-500">
            Found <span className="font-bold text-slate-950">{sortedProducts.length}</span> results for &ldquo;<span className="text-emerald-600 font-semibold">{searchQuery}</span>&rdquo;.
            <button onClick={() => setSearchQuery('')} className="ml-2 text-xs text-emerald-600 font-bold underline hover:text-emerald-850">Clear</button>
          </div>
        )}
      </section>

      {/* 4. Products Grid */}
      <section id="products-catalog-grid" className="mb-16">
        {sortedProducts.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 border border-dashed border-slate-200 rounded-3xl">
            <div className="inline-flex p-4 bg-emerald-50 rounded-full text-emerald-600 text-3xl mb-4">🍽️</div>
            <h3 className="text-lg font-bold text-slate-900">No dishes or ingredients matches found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto font-light">Try broadening your queries or selecting &ldquo;All&rdquo; categories filters.</p>
            <button 
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="mt-4 px-5 py-2.5 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedProducts.map((p) => {
              const isWished = user.wishlist.includes(p.id);
              const cardPrice = p.isDeal && p.dealPrice ? p.dealPrice : p.price;
              
              return (
                <div 
                  key={`card-${p.id}`}
                  className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 hover:border-gray-200 transition-all duration-300 relative group"
                >
                  
                  {/* Whislist Indicator */}
                  <button
                    onClick={() => toggleWishlist(p.id)}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/95 border border-gray-100 text-neutral-400 hover:text-rose-500 hover:scale-110 active:scale-95 transition-all duration-200 shadow-xs"
                    title={isWished ? "Remove from Wishlist" : "Add to Wishlist"}
                  >
                    <Heart className={`w-4 h-4 ${isWished ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>

                  <div>
                    {/* Visual Area */}
                    <div 
                      onClick={() => setSelectedProduct(p)}
                      className={`h-48 w-full rounded-xl flex items-center justify-center text-6xl shadow-inner cursor-pointer relative overflow-hidden bg-gradient-to-tr ${getProductGradient(p.category)}`}
                    >
                      {/* Decorative grid pattern in card */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:14px_24px]" />
                      <span className="scale-100 group-hover:scale-115 transition-transform duration-300 transform inline-block filter drop-shadow-md">
                        {p.image}
                      </span>

                      {/* Best Seller Ring */}
                      {p.isBestSeller && (
                        <span className="absolute bottom-3 left-3 bg-slate-950 text-white text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-xs flex items-center gap-1 shadow-md">
                          <Flame className="w-2.5 h-2.5 text-emerald-400" /> Bestseller
                        </span>
                      )}
                    </div>

                    {/* Metadata Section */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#2f3e46]">{p.category}</span>
                        <span className="text-xs text-slate-400 font-mono">{p.brand}</span>
                      </div>
                      
                      <h3 
                        onClick={() => setSelectedProduct(p)}
                        className="text-base font-black text-slate-900 mt-1 cursor-pointer group-hover:text-emerald-600 transition-colors duration-250 line-clamp-1"
                      >
                        {p.name}
                      </h3>
                      
                      {/* Rating stars display */}
                      <div className="flex items-center gap-1 mt-1.5">
                        <div className="flex text-amber-450">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={`star-card-${p.id}-${i}`}
                              className={`w-3 h-3 ${Math.round(p.rating) > i ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-slate-800">{p.rating}</span>
                        <span className="text-[10px] text-slate-400">({p.reviewsCount})</span>
                      </div>

                      <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>
                    </div>
                  </div>

                  {/* Purchase Tray */}
                  <div className="mt-5 border-t border-gray-50 pt-4 flex items-center justify-between">
                    <div>
                      {p.isDeal && p.dealPrice ? (
                        <div className="flex flex-col">
                          <span className="text-[9px] text-rose-500 uppercase font-black tracking-widest">Deal Price</span>
                          <span className="flex items-center gap-1.5">
                            <span className="text-lg font-black text-rose-600">${p.dealPrice.toFixed(2)}</span>
                            <span className="text-xs text-gray-400 line-through">${p.price.toFixed(2)}</span>
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <span className="text-[9px] text-[#52796f] uppercase font-black tracking-widest">Supper Price</span>
                          <span className="text-lg font-black text-neutral-950">${p.price.toFixed(2)}</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setSelectedProduct(p);
                      }}
                      className="inline-flex items-center gap-1 px-4 py-2 bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-all duration-300 shadow-xs cursor-pointer group-hover:shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" /> Order & Customize
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. Brand Directory Partner Showcase */}
      <section id="brand-directory" className="mb-8 border-t border-gray-100 pt-12">
        <div className="text-center mb-10">
          <h3 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Our Artisan Supplier Network</h3>
          <p className="text-sm text-gray-500 mt-1">Sourced with meticulous care from regional micro-producers, organic farms, and family bakeries.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            { name: 'Supper Butchery', icon: '🥩', tag: 'A5 Wagyu & Dry-Aged Cuts' },
            { name: 'Nona’s Kitchen', icon: '🍝', tag: 'Handmade Slow-Rolling Pastas' },
            { name: 'Green & Lean', icon: '🥗', tag: 'Organic Salads & Raw Juices' },
            { name: 'Smokehouse BBQ2', icon: '🍔', tag: 'Hickory Smoked Pulled Porks' },
            { name: 'Bella Italia', icon: '🍕', tag: 'Stone Deck Sourdough Pizzas' },
            { name: 'Meadow Farms', icon: '🍅', tag: 'Fresh Harvest Heirloom Tomatoes' }
          ].map((brand, idx) => (
            <div 
              key={`brand-${idx}`} 
              onClick={() => setSearchQuery(brand.name.split(' ')[0])}
              className="bg-slate-50/50 border border-slate-100/80 hover:border-emerald-250 hover:bg-emerald-50/10 rounded-2xl p-4 text-center cursor-pointer transition-all duration-300 group shadow-xs"
            >
              <span className="text-3xl filter group-hover:scale-110 transition-transform duration-300 inline-block mb-2">{brand.icon}</span>
              <h4 className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">{brand.name}</h4>
              <p className="text-[10px] text-slate-400 mt-1 leading-tight">{brand.tag}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. EXQUISITE PRODUCT DETAILS INTERACTIVE MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-300">
          
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row border border-gray-100"
          >
            
            {/* Close Cross button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-25 p-2 bg-neutral-900/10 hover:bg-neutral-900/20 text-neutral-800 rounded-full cursor-pointer transition-all focus:outline-hidden"
              title="Close modal"
            >
              &times; Close
            </button>

            {/* Left Portion: Large Graphic Banner Panel */}
            <div className={`md:w-1/2 p-8 flex flex-col justify-center items-center relative bg-gradient-to-tr ${getProductGradient(selectedProduct.category)}`}>
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:16px_28px]" />
              <div className="text-9xl filter drop-shadow-xl animate-bounce-slow mt-8">{selectedProduct.image}</div>
              
              <div className="absolute bottom-6 left-6 right-6 text-center">
                <span className="inline-block bg-neutral-950/20 backdrop-blur-md text-neutral-900 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-black/10">
                  {selectedProduct.brand}
                </span>
                <p className="text-xs text-neutral-700 font-semibold mt-2">Weight adjustments & custom preparations customizable right here.</p>
              </div>
            </div>

            {/* Right Portion: Interactive Customize & Review Desk */}
            <div className="md:w-1/2 p-6 overflow-y-auto max-h-[85vh] md:max-h-[90vh] flex flex-col justify-between bg-white">
              
              <div>
                <div className="flex items-center justify-between text-xs font-mono font-bold text-gray-500">
                  <span>{selectedProduct.category}</span>
                  <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-sm">
                    <BadgeCheck className="w-3.5 h-3.5" /> Stock: {selectedProduct.stock} Left
                  </span>
                </div>

                <h3 className="text-2xl font-black text-neutral-900 tracking-tight mt-2">{selectedProduct.name}</h3>

                {/* Stars and feedback summary */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={`star-modal-${selectedProduct.id}-${i}`}
                        className={`w-4 h-4 ${Math.round(selectedProduct.rating) > i ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm font-extrabold text-neutral-900">{selectedProduct.rating} avg</span>
                  <span className="text-xs text-gray-400">({selectedProduct.reviewsCount} verified guest orders)</span>
                </div>

                {/* Sub-tabs menu inside modal */}
                <div className="flex border-b border-gray-150 mt-6 gap-6 text-xs font-extrabold tracking-wider uppercase text-gray-400">
                  <button 
                    onClick={() => setReviewTab('desc')}
                    className={`pb-2.5 outline-hidden border-b-2 ${reviewTab === 'desc' ? 'border-emerald-600 text-slate-900' : 'hover:text-slate-700'}`}
                  >
                    Culinary Info
                  </button>
                  <button 
                    onClick={() => setReviewTab('nutrition')}
                    className={`pb-2.5 outline-hidden border-b-2 ${reviewTab === 'nutrition' ? 'border-emerald-600 text-slate-900' : 'hover:text-slate-700'}`}
                  >
                    Nutrition Facts
                  </button>
                  <button 
                    onClick={() => setReviewTab('reviews')}
                    className={`pb-2.5 outline-hidden border-b-2 ${reviewTab === 'reviews' ? 'border-emerald-600 text-slate-900' : 'hover:text-slate-700'}`}
                  >
                    Guest Reviews ({reviewsList.length})
                  </button>
                </div>

                {/* Sub-tabs content display */}
                <div className="py-4">
                  {reviewTab === 'desc' && (
                    <div className="space-y-3">
                      <p className="text-sm text-neutral-700 leading-relaxed font-sans">{selectedProduct.description}</p>
                      
                      <div className="flex flex-wrap gap-2 pt-2">
                        {selectedProduct.tags.map((tag, idx) => (
                          <span key={`tag-${idx}`} className="text-[10px] bg-slate-950 text-emerald-400 font-semibold tracking-widest px-2.5 py-1 rounded-sm uppercase">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {reviewTab === 'nutrition' && (
                    <div className="bg-neutral-50 px-5 py-4 rounded-2xl border border-gray-150">
                      <h4 className="text-xs font-mono font-black text-gray-400 uppercase tracking-widest mb-3">Est. Dietary Breakdown (Standard serving size)</h4>
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div className="p-2.5 bg-white border border-gray-100 rounded-xl shadow-xs">
                          <p className="text-xs text-gray-500">Energies</p>
                          <span className="text-sm font-black text-rose-500">{selectedProduct.nutrition.calories} kcal</span>
                        </div>
                        <div className="p-2.5 bg-white border border-gray-100 rounded-xl shadow-xs">
                          <p className="text-xs text-gray-500">Proteins</p>
                          <span className="text-sm font-black text-emerald-600">{selectedProduct.nutrition.protein}</span>
                        </div>
                        <div className="p-2.5 bg-white border border-gray-100 rounded-xl shadow-xs">
                          <p className="text-xs text-gray-500">Carbs</p>
                          <span className="text-sm font-black text-slate-500">{selectedProduct.nutrition.carbs}</span>
                        </div>
                        <div className="p-2.5 bg-white border border-gray-100 rounded-xl shadow-xs">
                          <p className="text-xs text-gray-500">Lipid Fat</p>
                          <span className="text-sm font-black text-rose-600">{selectedProduct.nutrition.fat}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {reviewTab === 'reviews' && (
                    <div className="space-y-4">
                      {/* Guest Reviews list */}
                      <div className="space-y-3.5 max-h-[160px] overflow-y-auto pr-2 scrollbar-thin">
                        {reviewsList.length === 0 ? (
                           <p className="text-xs text-gray-400 italic font-light">No reviews yet for this gourmet dish. Be the first!</p>
                        ) : (
                          reviewsList.map((rev) => (
                            <div key={rev.id} className="bg-gray-50/55 p-3 rounded-xl border border-gray-100/80">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-neural-905">{rev.userName}</span>
                                <span className="text-gray-400">{rev.date}</span>
                              </div>
                              <div className="flex text-emerald-605 text-xs mt-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star key={i} className={`w-3 h-3 ${rev.rating > i ? 'fill-emerald-500 text-emerald-500' : 'text-slate-200'}`} />
                                ))}
                              </div>
                              <p className="text-xs text-gray-650 mt-1 leading-normal">&ldquo;{rev.comment}&rdquo;</p>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Fast review adding form */}
                      <form onSubmit={handleAddReview} className="border-t border-gray-100 pt-3.5">
                        <h4 className="text-xs font-bold text-slate-900 mb-2">Write a Verified Guest Review</h4>
                        <div className="grid grid-cols-2 gap-3 mb-2">
                          <input 
                            type="text" 
                            placeholder="Your Name" 
                            value={newReviewAuthor} 
                            onChange={(e) => setNewReviewAuthor(e.target.value)} 
                            className="bg-gray-50 text-xs rounded-lg px-3 py-2 outline-hidden border border-gray-200 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500" 
                          />
                          <div className="flex items-center gap-1.5 justify-end">
                            <span className="text-[10px] text-gray-400 font-bold">Rating:</span>
                            <select 
                              value={newReviewRating} 
                              onChange={(e) => setNewReviewRating(parseInt(e.target.value))} 
                              className="bg-gray-50 text-xs rounded-lg px-2 py-1.5 focus:outline-hidden border border-gray-200"
                            >
                              <option value="5">5 Stars ⭐⭐⭐⭐⭐</option>
                              <option value="4">4 Stars ⭐⭐⭐⭐</option>
                              <option value="3">3 Stars ⭐⭐⭐</option>
                              <option value="2">2 Stars ⭐⭐</option>
                              <option value="1">1 Star ⭐</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Share your dining thoughts..." 
                            value={newReviewComment}
                            onChange={(e) => setNewReviewComment(e.target.value)}
                            className="w-full bg-gray-50 text-xs rounded-lg px-3.5 py-2 border border-gray-200 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                          />
                          <button 
                            type="submit" 
                            className="bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs px-4 rounded-lg cursor-pointer transition-colors"
                          >
                            Submit
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>

                {/* WEIGHT SELECTOR CONTROL */}
                {selectedProduct.weights && selectedProduct.weights.length > 0 && (
                  <div className="mt-4">
                    <label className="block text-xs font-mono font-black text-gray-400 uppercase tracking-widest mb-2">Select Portion Size / Weight Option</label>
                    <div className="flex gap-2.5">
                      {selectedProduct.weights.map((wOpt) => (
                        <button
                          key={`weight-opt-${wOpt}`}
                          onClick={() => setCustomWeight(wOpt)}
                          className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition-all ${
                            customWeight === wOpt
                              ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                              : 'border-gray-200 text-neutral-800 bg-white hover:bg-gray-50'
                          }`}
                        >
                          {wOpt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* SPECIAL INSTRUCTIONS NOTES FIELD */}
                <div className="mt-4">
                  <label className="block text-xs font-mono font-black text-gray-400 uppercase tracking-widest mb-1.5">Special Culinary Requests / Food Prep Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. Extra dressing, medium rare steak, keep sauce separate"
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    className="w-full bg-gray-50 text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 placeholder-gray-400 text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-sans"
                  />
                </div>
              </div>

              {/* MODAL QUANTITY & PURCHASE FOOTER */}
              <div className="mt-8 border-t border-gray-150 pt-5 flex items-center justify-between gap-4 bg-white">
                <div>
                  <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">Calculated Subtotal</span>
                  <div className="text-2.5xl font-extrabold text-slate-950 font-sans mt-0.5">
                    ${((selectedProduct.isDeal && selectedProduct.dealPrice ? selectedProduct.dealPrice : selectedProduct.price) * customQty).toFixed(2)}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Quantity adjustments indicator */}
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50 divide-x divide-gray-200">
                    <button
                      onClick={() => setCustomQty((prev) => Math.max(1, prev - 1))}
                      className="px-3 py-2 text-sm font-black hover:bg-gray-150 text-neutral-800 transition-colors cursor-pointer"
                    >
                      &minus;
                    </button>
                    <span className="px-3.5 py-2 text-xs font-extrabold text-neutral-900 bg-white w-10 text-center select-none">
                      {customQty}
                    </span>
                    <button
                      onClick={() => setCustomQty((prev) => Math.min(selectedProduct.stock, prev + 1))}
                      className="px-3 py-2 text-sm font-black hover:bg-gray-150 text-neutral-800 transition-colors cursor-pointer"
                    >
                      &#43;
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(selectedProduct, customQty, customWeight, customNotes);
                      setSelectedProduct(null);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-3.5 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-500 shadow-xs hover:-translate-y-0.5 transition-all cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" /> Add To Shopping List
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
