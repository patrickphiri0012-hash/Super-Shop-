import React, { useState } from 'react';
import { ShieldCheck, TrendingUp, Users, ShoppingBag, Plus, Trash2, CheckCircle, ToggleLeft, ToggleRight, DollarSign, Map, Compass, Sparkles, Filter, Edit2, FileText } from 'lucide-react';
import { Product, Order, Coupon, DeliveryZone } from '../types';

interface AdminPanelProps {
  products: Product[];
  setProducts: (products: Product[]) => void;
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  activeCoupons: Coupon[];
  setActiveCoupons: (coupons: Coupon[]) => void;
  deliveryZones: DeliveryZone[];
  setDeliveryZones: (zones: DeliveryZone[]) => void;
}

export default function AdminPanel({
  products,
  setProducts,
  orders,
  setOrders,
  activeCoupons,
  setActiveCoupons,
  deliveryZones,
  setDeliveryZones,
}: AdminPanelProps) {
  const [adminTab, setAdminTab] = useState<'metrics' | 'inventory' | 'orders' | 'promotions' | 'delivery'>('metrics');

  // Inventory creation states
  const [showAddProduct, setShowAddProduct] = useState<boolean>(false);
  const [newProdName, setNewProdName] = useState<string>('');
  const [newProdPrice, setNewProdPrice] = useState<number>(10);
  const [newProdDesc, setNewProdDesc] = useState<string>('');
  const [newProdCat, setNewProdCat] = useState<string>('Gourmet Suppers');
  const [newProdBrand, setNewProdBrand] = useState<string>('Supper Butchery');
  const [newProdImage, setNewProdImage] = useState<string>('🍽️');
  const [newProdWeights, setNewProdWeights] = useState<string>('Portion Weight');
  const [newProdStock, setNewProdStock] = useState<number>(20);
  const [newProdCalories, setNewProdCalories] = useState<number>(350);
  const [newProdProtein, setNewProdProtein] = useState<string>('24g');
  const [newProdCarbs, setNewProdCarbs] = useState<string>('40g');
  const [newProdFat, setNewProdFat] = useState<string>('12g');
  const [newProdTags, setNewProdTags] = useState<string>('Chef Made, Fresh');

  // Coupon creation states
  const [newCouponCode, setNewCouponCode] = useState<string>('');
  const [newCouponType, setNewCouponType] = useState<'percent' | 'flat'>('flat');
  const [newCouponValue, setNewCouponValue] = useState<number>(10);
  const [newCouponMin, setNewCouponMin] = useState<number>(30);
  const [newCouponDesc, setNewCouponDesc] = useState<string>('');

  // Settle calculations
  const totalSales = orders
    .filter((o) => o.status === 'delivered')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingSales = orders
    .filter((o) => o.status !== 'delivered' && o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  // Core metrics analytics list
  const metricsData = {
    totalRevenue: totalSales,
    pendingFulfilment: pendingSales,
    activeOrders: orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length,
    productCount: products.length,
  };

  // Product addition operation
  const handleAddNewProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdDesc.trim()) return;

    const newProd: Product = {
      id: `prod-added-${Date.now()}`,
      name: newProdName.trim(),
      price: newProdPrice,
      description: newProdDesc.trim(),
      category: newProdCat,
      rating: 5.0,
      reviewsCount: 0,
      reviews: [],
      image: newProdImage,
      nutrition: {
        calories: newProdCalories,
        protein: newProdProtein,
        carbs: newProdCarbs,
        fat: newProdFat,
      },
      weights: newProdWeights.split(',').map((w) => w.trim()),
      stock: newProdStock,
      brand: newProdBrand,
      tags: newProdTags.split(',').map((t) => t.trim()),
    };

    setProducts([newProd, ...products]);
    setShowAddProduct(false);

    // clear fields
    setNewProdName('');
    setNewProdDesc('');
  };

  // Delete product card helper
  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  // Promotion adding operator
  const handleAddCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim() || newCouponValue <= 0) return;

    const newCp: Coupon = {
      code: newCouponCode.trim().toUpperCase(),
      type: newCouponType,
      value: newCouponValue,
      minOrder: newCouponMin,
      isActive: true,
      description: newCouponDesc || `${newCouponType === 'flat' ? '$' : ''}${newCouponValue}${newCouponType === 'percent' ? '%' : ''} Off Promo`,
    };

    setActiveCoupons([newCp, ...activeCoupons]);
    setNewCouponCode('');
    setNewCouponValue(10);
    setNewCouponDesc('');
  };

  // Toggle active coupons
  const toggleCouponStatus = (code: string) => {
    setActiveCoupons(
      activeCoupons.map((cp) => {
        if (cp.code === code) {
          return { ...cp, isActive: !cp.isActive };
        }
        return cp;
      })
    );
  };

  // Promote kitchen order status
  const updateOrderStatus = (id: string, newStatus: Order['status']) => {
    setOrders(
      orders.map((ord) => {
        if (ord.id === id) {
          let progressVal = 100;
          if (newStatus === 'pending') progressVal = 10;
          else if (newStatus === 'preparing') progressVal = 40;
          else if (newStatus === 'dispatched') progressVal = 75;
          else if (newStatus === 'delivered') progressVal = 100;
          else if (newStatus === 'cancelled') progressVal = 0;

          return { ...ord, status: newStatus, progress: progressVal };
        }
        return ord;
      })
    );
  };

  // Toggle Delivery Suburbs Zone isActive state
  const toggleZoneStatus = (id: string) => {
    setDeliveryZones(
      deliveryZones.map((z) => {
        if (z.id === id) {
          return { ...z, isActive: !z.isActive };
        }
        return z;
      })
    );
  };

  return (
    <div id="admin-workspace-deck" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in text-neutral-900">
      
      {/* 1. Header Banner */}
      <section id="admin-header" className="bg-[#1b263b] border border-neutral-800 text-white p-6 rounded-3xl mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] bg-amber-400 text-neutral-950 font-black px-3 py-1 rounded-full uppercase tracking-wider">
            Office Desk Mode
          </span>
          <h2 className="text-3xl font-black tracking-tight mt-1">Supper Shop Admin Panel</h2>
          <p className="text-xs text-neutral-400 mt-1">Manage warehouse stock, fulfill hot kitchen dispatches, configure promo coupons, and track earnings.</p>
        </div>

        {/* Global toggles inside admin */}
        <div className="flex flex-wrap gap-2 text-xs font-bold text-gray-350">
          {[
            { id: 'metrics', label: 'Overview Metrics' },
            { id: 'inventory', label: 'Inventory Creator' },
            { id: 'orders', label: 'Fulfillment Desk', valNum: orders.filter(o => o.status !== 'delivered').length },
            { id: 'promotions', label: 'Promotions Coupons' },
            { id: 'delivery', label: 'Delivery Suburbs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                adminTab === tab.id
                  ? 'bg-amber-400 text-neutral-950 font-black shadow-md'
                  : 'bg-neutral-800 hover:bg-neutral-750 text-white'
              }`}
            >
              {tab.label} {tab.valNum !== undefined && tab.valNum > 0 && <span className="bg-rose-500 text-white rounded-full px-1.5 py-0.5 text-[9px] font-black">{tab.valNum}</span>}
            </button>
          ))}
        </div>
      </section>

      {/* 2. OVERVIEW METRICS */}
      {adminTab === 'metrics' && (
        <div className="space-y-8">
          {/* Bento metric widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white border border-gray-150 p-5 rounded-2xl shadow-xs">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl w-10 h-10 flex items-center justify-center mb-3">
                <DollarSign className="w-5 h-5" />
              </div>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-black">Authorized Revenue</p>
              <h4 className="text-2.5xl font-black text-neutral-950 font-sans mt-1">${metricsData.totalRevenue.toFixed(2)}</h4>
              <p className="text-[10px] text-emerald-600 mt-1">✔ Confirmed Delivered sales</p>
            </div>

            <div className="bg-white border border-gray-150 p-5 rounded-2xl shadow-xs">
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl w-10 h-10 flex items-center justify-center mb-3">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-black">Pending Receivables</p>
              <h4 className="text-2.5xl font-black text-neutral-950 font-sans mt-1">${metricsData.pendingFulfilment.toFixed(2)}</h4>
              <p className="text-[10px] text-amber-600 mt-1">🍳 Kitchen preps & active riders</p>
            </div>

            <div className="bg-white border border-gray-150 p-5 rounded-2xl shadow-xs">
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl w-10 h-10 flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-black">Active Dispatch Orders</p>
              <h4 className="text-2.5xl font-black text-neutral-950 font-sans mt-1">{metricsData.activeOrders}</h4>
              <p className="text-[10px] text-rose-500 mt-1">🔥 Live tracking active</p>
            </div>

            <div className="bg-white border border-gray-150 p-5 rounded-2xl shadow-xs">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl w-10 h-10 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-black">Linked Store Catalog</p>
              <h4 className="text-2.5xl font-black text-neutral-950 font-sans mt-1">{metricsData.productCount} Items</h4>
              <p className="text-[10px] text-blue-500 mt-1">🚀 Gourmet dish catalog active</p>
            </div>

          </div>

          {/* SVG Analytical Charts container */}
          <div className="bg-white border border-gray-150 p-6 rounded-2xl">
            <h4 className="text-sm font-black text-neutral-900 mb-4 flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-[#52796f]" /> Weekly Peak Order Hours & Category Sales Density
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              {/* Chart A: Categories shares */}
              <div className="space-y-4">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Sale Breakdown by Primary Categories</p>
                
                {/* Visual custom lists bars */}
                <div className="space-y-4">
                  {[
                    { label: 'Gourmet Suppers', val: 1450, color: 'bg-rose-500', pct: '45%' },
                    { label: 'Italian Specials', val: 980, color: 'bg-amber-400', pct: '30%' },
                    { label: 'Fresh Groceries', val: 420, color: 'bg-green-500', pct: '13%' },
                    { label: 'Healthy & Fresh', val: 380, color: 'bg-emerald-500', pct: '12%' },
                  ].map((bar, i) => (
                    <div key={i} className="text-xs space-y-1">
                      <div className="flex justify-between font-bold text-neutral-800">
                        <span>{bar.label}</span>
                        <span>${bar.val} ({bar.pct})</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 shadow-inner overflow-hidden">
                        <div style={{ width: bar.pct }} className={`${bar.color} h-full rounded-full`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart B: Weekly Hourly peaks drawn under raw SVGs */}
              <div className="text-center font-sans space-y-4">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider text-left">Supper Orders Count Peak Hour Curve Chart</p>
                
                {/* SVG Curves */}
                <div className="relative border border-gray-100 rounded-xl bg-gray-50/50 p-4 h-48 flex items-end">
                  <svg className="w-full h-full" viewBox="0 0 400 150">
                    {/* Grids helper */}
                    <line x1="0" y1="50" x2="400" y2="50" stroke="#e9ecef" strokeWidth="1" />
                    <line x1="0" y1="100" x2="400" y2="100" stroke="#e9ecef" strokeWidth="1" />
                    
                    {/* Interpolate Peak Hours: 4 PM, 6 PM, 8 PM, 10 PM */}
                    <path 
                      d="M 10 140 Q 80 120, 150 70 T 250 20 T 350 110 T 390 140" 
                      fill="none" 
                      stroke="#f4a261" 
                      strokeWidth="3.5" 
                      strokeLinecap="round"
                    />
                    
                    {/* Interactive dot */}
                    <circle cx="250" cy="20" r="5" fill="#e76f51" />
                    
                    <text x="250" y="38" fontSize="8" fontWeight="bold" fill="#264653">Dinner Peak (8 PM)</text>
                  </svg>
                  
                  {/* labels coordinates */}
                  <div className="absolute bottom-2 left-6 right-6 flex justify-between font-mono text-[9px] text-gray-400">
                    <span>12 PM</span>
                    <span>4 PM</span>
                    <span>8 PM</span>
                    <span>11 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. INVENTORY CREATOR & MANAGER */}
      {adminTab === 'inventory' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white border border-gray-150 p-4 rounded-xl">
            <div>
              <h3 className="text-lg font-black text-neutral-900 tracking-tight">Catalog Inventory & Additions</h3>
              <p className="text-xs text-gray-400 mt-1">Insert gourmet hot items or fresh agricultural harvest products into the market.</p>
            </div>
            
            <button
              onClick={() => setShowAddProduct(!showAddProduct)}
              className="px-4 py-2 bg-neutral-900 border border-neutral-900 text-white hover:bg-neutral-800 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4 text-amber-400" /> {showAddProduct ? 'Close Form' : 'Register New Dish'}
            </button>
          </div>

          {/* Core product adding form drawer */}
          {showAddProduct && (
            <form onSubmit={handleAddNewProductSubmit} className="bg-white border border-gray-150 rounded-2xl p-6 shadow-md space-y-4 text-xs font-sans">
              <h4 className="text-sm font-extrabold text-neutral-900 flex items-center gap-1 border-b border-gray-100 pb-2">
                <Sparkles className="w-4 h-4 text-amber-500" /> Enter Recipe Catalog Parameters
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase font-black text-gray-400 mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Handmade Fettuccine with Truffle cream"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    className="w-full bg-gray-50 rounded-xl p-3 border border-gray-250 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-black text-gray-400 mb-1">Base Price ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(parseFloat(e.target.value))}
                    className="w-full bg-gray-50 rounded-xl p-3 border border-gray-250 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-black text-gray-400 mb-1">Comprehensive Cooking Description</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Details regarding cooking ingredients, chef methods, serving layout..."
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full bg-gray-50 rounded-xl p-3 border border-gray-250 font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-black text-gray-400 mb-1">Category Category</label>
                  <select
                    value={newProdCat}
                    onChange={(e) => setNewProdCat(e.target.value)}
                    className="w-full bg-gray-50 rounded-xl p-2.5 border border-gray-250"
                  >
                    <option>Gourmet Suppers</option>
                    <option>Italian Specials</option>
                    <option>Healthy & Fresh</option>
                    <option>Fresh Groceries</option>
                    <option>Desserts & Sweets</option>
                    <option>Drinks & Elixirs</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-black text-gray-400 mb-1">Brand/Supplier Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Supper Butchery"
                    value={newProdBrand}
                    onChange={(e) => setNewProdBrand(e.target.value)}
                    className="w-full bg-gray-50 rounded-xl p-3 border border-gray-250"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-black text-gray-400 mb-1">Culinary Emoji / Emblem</label>
                  <select
                    value={newProdImage}
                    onChange={(e) => setNewProdImage(e.target.value)}
                    className="w-full bg-gray-50 rounded-xl p-2.5 border border-gray-250"
                  >
                    <option>🥩</option>
                    <option>🍝</option>
                    <option>🍕</option>
                    <option>🥗</option>
                    <option>🍔</option>
                    <option>🍅</option>
                    <option>🧁</option>
                    <option>🍹</option>
                    <option>🍗</option>
                    <option>🧀</option>
                    <option>🍊</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-black text-gray-400 mb-1">Initial Stock Units</label>
                  <input
                    type="number"
                    required
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(parseInt(e.target.value))}
                    className="w-full bg-gray-50 rounded-xl p-3 border border-gray-250"
                  />
                </div>
              </div>

              {/* NutritionFacts parameters */}
              <div className="bg-neutral-50 px-5 py-4 rounded-xl border border-gray-200">
                <h5 className="text-[10px] uppercase font-black text-gray-400 mb-2">Estimate Nutritional Breakdown</h5>
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[9px] text-gray-400 mb-1">Calories (kcal)</label>
                    <input type="number" required value={newProdCalories} onChange={(e) => setNewProdCalories(parseInt(e.target.value))} className="w-full bg-white rounded-lg p-2 border border-gray-200" />
                  </div>
                  <div>
                    <label className="block text-[9px] text-gray-400 mb-1">Protein (g)</label>
                    <input type="text" required value={newProdProtein} onChange={(e) => setNewProdProtein(e.target.value)} className="w-full bg-white rounded-lg p-2 border border-gray-200" />
                  </div>
                  <div>
                    <label className="block text-[9px] text-gray-400 mb-1">Carbon Carbohydrates</label>
                    <input type="text" required value={newProdCarbs} onChange={(e) => setNewProdCarbs(e.target.value)} className="w-full bg-white rounded-lg p-2 border border-gray-200" />
                  </div>
                  <div>
                    <label className="block text-[9px] text-gray-400 mb-1">Fats Lipid Fats</label>
                    <input type="text" required value={newProdFat} onChange={(e) => setNewProdFat(e.target.value)} className="w-full bg-white rounded-lg p-2 border border-gray-200" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-black text-gray-400 mb-1">Selectable Weights (comma parted)</label>
                  <input
                    type="text"
                    required
                    placeholder="Standard Bowl, Double portion"
                    value={newProdWeights}
                    onChange={(e) => setNewProdWeights(e.target.value)}
                    className="w-full bg-gray-50 rounded-xl p-3 border border-gray-250"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-black text-gray-400 mb-1">Filter Tags tags (comma parted)</label>
                  <input
                    type="text"
                    required
                    placeholder="High Protein, Woodfire, Vegetarian"
                    value={newProdTags}
                    onChange={(e) => setNewProdTags(e.target.value)}
                    className="w-full bg-gray-50 rounded-xl p-3 border border-gray-250"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 bg-neutral-900 border border-neutral-900 text-white font-extrabold text-xs rounded-xl shadow-xs hover:bg-neutral-800 transition-colors"
                >
                  Save & Publish New Product
                </button>
              </div>
            </form>
          )}

          {/* Simple inventory listing manager table */}
          <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 border-b border-gray-200 uppercase font-bold tracking-widest text-[9px]">
                    <th className="p-4">Dish Details</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">brand</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock Units</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50">
                      <td className="p-4 flex items-center gap-2 font-sans font-bold">
                        <span className="text-2.5xl bg-gray-100 rounded-lg p-2 inline-block shrink-0">{p.image}</span>
                        <div>
                          <p className="text-sm font-extrabold text-neutral-900 leading-tight">{p.name}</p>
                          <span className="text-[10px] text-amber-600">★ {p.rating} Avg</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600 font-medium">{p.category}</td>
                      <td className="p-4 text-gray-500 font-mono">{p.brand}</td>
                      <td className="p-4 font-extrabold font-mono text-neutral-900">${p.price.toFixed(2)}</td>
                      <td className="p-4 font-black">{p.stock} units</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg inline-flex items-center gap-1 cursor-pointer"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. ORDERS DISPATCH & FULFILLMENT DESK */}
      {adminTab === 'orders' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-black text-neutral-900 tracking-tight">Active Cooking & Delivery Dispatch</h3>
            <p className="text-xs text-gray-400 mt-1">Settle statuses. Your update triggers live steps and coordinate moving indicators instantly on user account tracking maps!</p>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 border border-gray-200 rounded-xl border-dashed">
              <span className="text-3xl text-gray-400 inline-block mb-2">📋</span>
              <p className="text-xs font-bold text-gray-400">No client orders placed yet.</p>
            </div>
          ) : (
            <div className="space-y-4 font-sans text-xs">
              {orders.map((ord) => (
                <div key={ord.id} className="border border-gray-150 bg-white rounded-2xl p-4 shadow-xs flex flex-col md:flex-row justify-between gap-4">
                  {/* Left part */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-amber-650 bg-neutral-950 px-2 py-0.5 rounded-sm">Invoice: {ord.invoiceNumber}</span>
                      <span className="text-gray-400 font-medium">{ord.date}</span>
                    </div>

                    <div className="space-y-1 text-gray-655 font-sans">
                      <p className="font-bold text-neutral-900">Ordered Basket:</p>
                      {ord.items.map((it, i) => (
                        <p key={i}>
                          • {it.product.image} {it.product.name} (Portion: {it.selectedWeight} x{it.quantity})
                        </p>
                      ))}
                    </div>

                    <div className="pt-2 text-gray-500">
                      <p>Recipient: <span className="font-bold text-neutral-900">{ord.addressName}</span></p>
                      <p>Street: <span className="font-bold text-neutral-900">{ord.addressLines}</span></p>
                      <p>Phone: <span className="font-bold text-neutral-900">{ord.phone}</span></p>
                    </div>
                  </div>

                  {/* Right part: active dispatcher operations */}
                  <div className="md:text-right flex flex-col justify-between items-start md:items-end gap-3 shrink-0">
                    <div>
                      <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">Calculated Invoice Payment</p>
                      <p className="text-lg font-black text-neutral-950">${ord.total.toFixed(2)}</p>
                    </div>

                    <div className="space-y-2 text-left md:text-right">
                      <label className="block text-[9px] uppercase font-black text-gray-400">Trigger Status Updates</label>
                      <div className="flex flex-wrap gap-1.5 justify-end">
                        {[
                          { val: 'pending', label: 'Hold' },
                          { val: 'preparing', label: '🍳 Kitchen Prep' },
                          { val: 'dispatched', label: '🛵 Rider Out' },
                          { val: 'delivered', label: '✔ Ready Delivered' },
                        ].map((btn) => (
                          <button
                            key={btn.val}
                            onClick={() => updateOrderStatus(ord.id, btn.val as any)}
                            className={`px-3 py-1.5 rounded-lg font-black text-[10px] uppercase transition-all ${
                              ord.status === btn.val
                                ? 'bg-neutral-950 text-white font-black scale-105'
                                : 'bg-gray-100 hover:bg-gray-200 text-neutral-800'
                            }`}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. PROMOTIONS & COUPONS MANAGER */}
      {adminTab === 'promotions' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans text-xs">
          {/* Left panel: Add Coupon form */}
          <div className="lg:col-span-5 bg-white border border-gray-150 p-5 rounded-2xl shadow-xs space-y-4">
            <h4 className="text-base font-extrabold text-neutral-900 flex items-center gap-1 pb-2 border-b">
              <Plus className="w-4 h-4 text-emerald-600" /> Generate Promotional Coupon
            </h4>

            <form onSubmit={handleAddCouponSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-black text-gray-400 mb-1">Coupon Redeeem Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CHEF30"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  className="w-full bg-gray-50 rounded-xl p-3 border border-gray-250 focus:ring-1 focus:ring-amber-500 uppercase font-mono tracking-widest font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] uppercase font-black text-gray-400 mb-1">Type Option</label>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as any)}
                    className="w-full bg-gray-50 rounded-xl p-2.5 border border-gray-250"
                  >
                    <option value="flat">Flat ($ Discount) </option>
                    <option value="percent">Percentage (% Ratio) </option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-black text-gray-400 mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={newCouponValue}
                    onChange={(e) => setNewCouponValue(parseFloat(e.target.value))}
                    className="w-full bg-gray-50 rounded-xl p-3 border border-gray-250 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-black text-gray-400 mb-1">Min Spend Required ($)</label>
                <input
                  type="number"
                  required
                  value={newCouponMin}
                  onChange={(e) => setNewCouponMin(parseFloat(e.target.value))}
                  className="w-full bg-gray-50 rounded-xl p-3 border border-gray-250 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-black text-gray-400 mb-1">Voucher Description Highlight</label>
                <input
                  type="text"
                  placeholder="e.g. Save $30 on orders above $100"
                  value={newCouponDesc}
                  onChange={(e) => setNewCouponDesc(e.target.value)}
                  className="w-full bg-gray-50 rounded-xl p-3 border border-gray-250"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-neutral-900 border border-neutral-900 text-white font-extrabold rounded-xl hover:bg-neutral-850"
              >
                Create Coupon Code
              </button>
            </form>
          </div>

          {/* Right panel: coupon listings list */}
          <div className="lg:col-span-7 bg-white border border-gray-150 p-5 rounded-2xl shadow-xs space-y-4">
            <h4 className="text-base font-extrabold text-[#2a9d8f] pb-2 border-b">Active Campaign Promos</h4>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {activeCoupons.map((cp) => (
                <div key={cp.code} className="p-3.5 bg-gray-50 border border-gray-150 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-black font-mono text-amber-700 bg-white p-1 rounded-sm border border-amber-300">{cp.code}</code>
                      <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-sm ${
                        cp.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {cp.isActive ? 'Running' : 'Suspended'}
                      </span>
                    </div>
                    <p className="font-bold text-neutral-800 mt-2">{cp.description}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Spend restriction: Min ${cp.minOrder} spend</p>
                  </div>

                  <button
                    onClick={() => toggleCouponStatus(cp.code)}
                    className="p-2 text-neutral-600 hover:text-black shrink-0 transition-colors"
                    title={cp.isActive ? "Suspend Coupon" : "Activate Coupon"}
                  >
                    {cp.isActive ? <ToggleRight className="w-8 h-8 text-emerald-600" /> : <ToggleLeft className="w-8 h-8 text-gray-400" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. DELIVERY ZONES */}
      {adminTab === 'delivery' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-black text-neutral-900 tracking-tight flex items-center gap-2">
              <Map className="w-5 h-5 text-amber-500" /> Metropolitan Delivery Suburbs & Tariffs
            </h3>
            <p className="text-xs text-gray-400 mt-1">Configure active courier delivery circles, suburb groupings, fee rates and ETA predictions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
            {deliveryZones.map((z) => (
              <div key={z.id} className="bg-white border border-gray-150 rounded-2xl p-4 flex justify-between items-start shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-neutral-900">{z.name}</h4>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-sm ${
                      z.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {z.isActive ? 'Active Circle' : 'Offline'}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-gray-550 mt-1 lines-clamp-1">Suburbs: <span className="font-bold text-neutral-800">{z.suburbs}</span></p>
                  
                  <div className="grid grid-cols-3 gap-4 pt-3.5 mt-3 border-t border-gray-100 font-sans">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Rate fee</p>
                      <h5 className="font-extrabold text-neutral-900 text-sm mt-0.5">${z.price.toFixed(2)}</h5>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Min Spend</p>
                      <h5 className="font-extrabold text-neutral-900 text-sm mt-0.5">${z.minOrder.toFixed(2)}</h5>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Avg ETA</p>
                      <h5 className="font-extrabold text-neutral-900 text-sm mt-0.5">{z.etaRange}</h5>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleZoneStatus(z.id)}
                  className="p-1 text-gray-400 hover:text-black shrink-0 transition-colors"
                  title="Toggle active status"
                >
                  {z.isActive ? <ToggleRight className="w-8 h-8 text-[#52796f]" /> : <ToggleLeft className="w-8 h-8 text-gray-400" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
