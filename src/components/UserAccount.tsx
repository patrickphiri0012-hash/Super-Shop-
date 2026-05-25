import React, { useState } from 'react';
import { Award, User, ShoppingBag, Heart, MapPin, Gift, Settings, Star, ExternalLink, RefreshCw, ChevronRight, Phone, MessageSquare, Compass, Copy } from 'lucide-react';
import { UserProfile, Order, Product, Coupon } from '../types';

interface UserAccountProps {
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  orders: Order[];
  products: Product[];
  activeCoupons: Coupon[];
  setActiveCoupons: (coupons: Coupon[]) => void;
  setActiveTab: (tab: 'storefront' | 'cart' | 'account' | 'admin' | 'support') => void;
}

export default function UserAccount({
  user,
  setUser,
  orders,
  products,
  activeCoupons,
  setActiveCoupons,
  setActiveTab,
}: UserAccountProps) {
  const [subTab, setSubTab] = useState<'dashboard' | 'orders' | 'wishlist' | 'addresses' | 'loyalty' | 'settings'>('dashboard');
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | null>(null);
  
  // Voucher redemptions states
  const [copiedCode, setCopiedCode] = useState<string>('');
  const [redeemedCouponMsg, setRedeemedCouponMsg] = useState<string>('');

  // Edit fields states
  const [editName, setEditName] = useState<string>(user.name);
  const [editEmail, setEditEmail] = useState<string>(user.email);
  const [editPhone, setEditPhone] = useState<string>(user.phone);
  const [isSavedMsg, setIsSavedMsg] = useState<boolean>(false);

  // Filter wishlist products
  const wishedProducts = products.filter((p) => user.wishlist.includes(p.id));

  // Determine milestone progression for tier levels
  const getTierThreshold = () => {
    if (user.tier === 'Bronze') return 100;
    if (user.tier === 'Silver') return 300;
    if (user.tier === 'Gold') return 600;
    return 1000; // max reached theoretically
  };

  const getNextTier = () => {
    if (user.tier === 'Bronze') return 'Silver';
    if (user.tier === 'Silver') return 'Gold';
    if (user.tier === 'Gold') return 'Platinum';
    return 'Ultimate Elite';
  };

  const nextThreshold = getTierThreshold();
  const percentageToNext = Math.min(100, Math.round((user.loyaltyPoints / nextThreshold) * 100));

  // Address operations
  const handleDeleteAddress = (id: string) => {
    const addresses = user.addresses.filter((a) => a.id !== id);
    setUser({ ...user, addresses });
  };

  const handleSetDefaultAddress = (id: string) => {
    const addresses = user.addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    setUser({ ...user, addresses });
  };

  // Loyalty Points conversion to coupons
  const handleRedeemVoucher = (pointsCost: number, voucherValue: number) => {
    if (user.loyaltyPoints < pointsCost) return;

    const voucherCode = `REDEEM-${voucherValue}-${Math.floor(100 + Math.random() * 900)}`;

    const newCoupon: Coupon = {
      code: voucherCode,
      type: 'flat',
      value: voucherValue,
      minOrder: voucherValue + 5, // e.g. $15 spent for $10 off
      isActive: true,
      description: `Redeemed Loyalty points Coupon worth $${voucherValue}`,
    };

    const updatedPointsLog = [
      {
        id: `pts-${Date.now()}`,
        points: -pointsCost,
        type: 'redeemed' as const,
        description: `Redeemed Coupon Voucher ${voucherCode}`,
        date: new Date().toISOString().split('T')[0],
      },
      ...user.pointsLog,
    ];

    setUser({
      ...user,
      loyaltyPoints: user.loyaltyPoints - pointsCost,
      pointsLog: updatedPointsLog,
    });

    setActiveCoupons([newCoupon, ...activeCoupons]);
    setRedeemedCouponMsg(`Success! Created coupon code ${voucherCode}. It is active for checkout immediately.`);
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      ...user,
      name: editName,
      email: editEmail,
      phone: editPhone,
    });
    setIsSavedMsg(true);
    setTimeout(() => setIsSavedMsg(false), 2500);
  };

  return (
    <div id="user-account-workspace" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* 1. Profile Status Dashboard Hub */}
      <section id="profile-heading" className="bg-slate-50 border border-slate-100/80 rounded-3xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 relative">
        <div className="absolute top-0 right-0 w-48 h-full bg-emerald-500/5 rounded-r-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-emerald-600 overflow-hidden shadow-xs">
              <img referrerPolicy="no-referrer" src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1.5 rounded-full border-2 border-white text-xs font-bold" title="Membership Level">
              <Award className="w-4 h-4" />
            </span>
          </div>

          <div className="text-center sm:text-left">
            <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {user.tier} Membership Tier
            </span>
            <h2 className="text-2xl font-extrabold text-neutral-900 mt-1">{user.name}</h2>
            <p className="text-gray-500 text-xs font-medium mt-0.5">{user.email}</p>
          </div>
        </div>

        {/* Milestone milestones */}
        <div className="w-full md:max-w-xs space-y-2">
          <div className="flex justify-between text-xs font-bold text-gray-500">
            <span>Points Ledger: {user.loyaltyPoints} PTS</span>
            <span>Target: {nextThreshold} ({getNextTier()})</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 border border-gray-200 overflow-hidden p-0.5 shadow-inner">
            <div 
              style={{ width: `${percentageToNext}%` }} 
              className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
            />
          </div>
          <p className="text-[10px] text-gray-400 text-center md:text-right font-medium">
            Earn <span className="font-bold text-neutral-800">{nextThreshold - user.loyaltyPoints}</span> more points to reach {getNextTier()} tier.
          </p>
        </div>
      </section>

      {/* 2. Sidebars Nav Drawer & Core Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation buttons column */}
        <div className="lg:col-span-3 bg-white border border-gray-100 p-4 rounded-2xl shadow-xs space-y-1">
          <h3 className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-widest px-3 mb-3">User Menu Navigation</h3>
          
          {[
            { id: 'dashboard', label: 'Membership Feed', icon: User },
            { id: 'orders', label: 'Order History & Map', icon: ShoppingBag, badge: orders.length },
            { id: 'wishlist', label: 'Saved Wishlist', icon: Heart, badge: wishedProducts.length },
            { id: 'addresses', label: 'My Saved Addresses', icon: MapPin },
            { id: 'loyalty', label: 'Loyalty Rewards Wallet', icon: Gift },
            { id: 'settings', label: 'Account Details', icon: Settings },
          ].map((nav) => {
            const Icon = nav.icon;
            return (
              <button
                key={nav.id}
                onClick={() => setSubTab(nav.id as any)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold tracking-tight transition-all text-left cursor-pointer ${
                  subTab === nav.id
                    ? 'bg-neutral-900 text-white shadow-md'
                    : 'text-gray-650 hover:bg-gray-100'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${subTab === nav.id ? 'text-emerald-400' : 'text-slate-400'}`} />
                  {nav.label}
                </span>
                {nav.badge !== undefined && nav.badge > 0 && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${subTab === nav.id ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                    {nav.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content displays column */}
        <div className="lg:col-span-9 bg-white border border-gray-100 rounded-2xl p-6 shadow-xs min-h-[450px]">
          
          {/* MEMBERSHIP FEED */}
          {subTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-black text-neutral-900 tracking-tight">Active Membership Feed</h3>
                <p className="text-xs text-gray-400 mt-1">Hello, Patrick! Settle back, track orders progress and review food points logs.</p>
              </div>

              {/* Status bento columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Fast shortcut list */}
                <div className="border border-emerald-100 rounded-2xl p-4 bg-emerald-50/30">
                  <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-emerald-600" /> Executive Privileges
                  </h4>
                  <ul className="space-y-2.5 text-xs text-slate-705">
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✔</span> Double Points on special Gourmet Suppers deals is active.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✔</span> Complimentary organic lime-juices added automatically to orders above $60.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✔</span> Fast priority rider dispatch inside active metropolitan suburbs.
                    </li>
                  </ul>
                  <button 
                    onClick={() => setSubTab('loyalty')}
                    className="mt-4 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    Go Exchange point-vouchers <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Default address preview */}
                <div className="border border-gray-150 rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900 mb-2 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-neutral-500" /> Default Shipping Destination
                    </h4>
                    {user.addresses.find((a) => a.isDefault) ? (
                      <div className="text-xs">
                        <p className="font-bold text-neutral-800">{user.addresses.find((a) => a.isDefault)?.recipient}</p>
                        <p className="text-gray-500 mt-1">{user.addresses.find((a) => a.isDefault)?.addressLines}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic">No default addresses loaded. Define one in settings.</p>
                    )}
                  </div>
                  <button 
                    onClick={() => setSubTab('addresses')}
                    className="text-xs font-bold text-blue-600 hover:underline mt-4 text-left"
                  >
                    Manage address directories &rarr;
                  </button>
                </div>

              </div>

               {/* Feed recent activity orders history */}
              <div className="border-t border-gray-150 pt-6">
                <h4 className="text-sm font-bold text-neutral-900 mb-3 flex items-center justify-between">
                  <span>Recent Transaction Entries</span>
                  <button onClick={() => setSubTab('orders')} className="text-xs text-emerald-600 hover:underline font-bold">See All</button>
                </h4>
                
                {orders.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No grocery orders dispatched. Place your first order today!</p>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 2).map((ord) => (
                      <div key={ord.id} className="p-3 bg-gray-50 border border-gray-150 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-neutral-900">Supper Order {ord.id.substring(4, 9).toUpperCase()}</p>
                          <p className="text-gray-400">{ord.date} • {ord.items.length} dishes</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-neutral-950">${ord.total.toFixed(2)}</p>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-xs ${
                            ord.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800 animate-pulse'
                          }`}>{ord.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ORDER HISTORY & TRACKER */}
          {subTab === 'orders' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-black text-neutral-900 tracking-tight">Purchase Logs & Live Rider Dispatch</h3>
                <p className="text-xs text-gray-400 mt-1">Check current preps, statuses, review past purchases or trigger interactive maps.</p>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 border border-dashed border-gray-200 rounded-2xl">
                  <span className="text-3xl text-gray-400 inline-block mb-2">🍽</span>
                  <p className="text-sm font-bold text-gray-500">No food receipts loaded yet.</p>
                  <button onClick={() => setActiveTab('storefront')} className="mt-2 text-xs font-bold text-emerald-600 underline hover:text-emerald-700">Visit Food Storefront</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => {
                    const isTracking = activeTrackingOrderId === ord.id;
                    return (
                      <div key={ord.id} className="border border-gray-150 rounded-2xl p-4 space-y-3 shadow-xs bg-white">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-100 pb-3 text-xs">
                          <div>
                            <span className="font-bold text-neutral-600">ID: </span>
                            <span className="font-mono font-bold text-emerald-400 bg-slate-950 px-2.5 py-0.5 rounded-xs shrink-0">{ord.invoiceNumber}</span>
                            <span className="text-gray-400 ml-2">Ordered on {ord.date}</span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <span className="text-xs text-gray-400 font-medium">Recipient Address Label: <span className="font-bold text-neutral-800">{ord.addressName}</span></span>
                            <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-sm ${
                              ord.status === 'delivered' ? 'bg-green-100 text-green-950' : 'bg-amber-100 text-amber-950 animate-pulse'
                            }`}>
                              ● {ord.status}
                            </span>
                          </div>
                        </div>

                        {/* List summary of items inside order */}
                        <div className="text-xs space-y-1 my-2">
                          <p className="font-bold text-neutral-900">Dishes & Ingredients Basket:</p>
                          <div className="flex flex-wrap gap-2 text-gray-600">
                            {ord.items.map((it, i) => (
                              <span key={i} className="bg-gray-100 px-2.5 py-1 rounded-lg">
                                {it.product.image} {it.product.name} (x{it.quantity})
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-3 border-t border-gray-100 gap-4 text-xs font-sans">
                          <div>
                            <span className="font-medium text-gray-400">Total Purchase: </span>
                            <span className="font-black text-neutral-950 font-mono text-sm">${ord.total.toFixed(2)}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Trigger live vector coordinates tracking */}
                            {ord.status !== 'cancelled' && (
                              <button
                                onClick={() => setActiveTrackingOrderId(isTracking ? null : ord.id)}
                                className="px-3.5 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-bold flex items-center gap-1 cursor-pointer transition-all"
                              >
                                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                                {isTracking ? 'Close Tracking' : 'See Live Map Tracking'}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* LIVE TRACKER COORDINATES COMPONENT VIEW */}
                        {isTracking && (
                          <div className="relative mt-4 border border-slate-200 bg-slate-50/50 rounded-2xl p-4 sm:p-5 animate-fade-in space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1">
                              <Compass className="w-4 h-4 text-emerald-600" /> Simulated Live Drone & Rider GPS Feed
                            </h4>

                            {/* Beautiful visual vector map frame */}
                            <div className="relative h-44 bg-neutral-950 rounded-xl overflow-hidden border border-neutral-800 flex items-center justify-center">
                              {/* Background vector lines */}
                              <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:12px_12px] opacity-40" />
                              <div className="absolute left-1/4 top-1/2 w-48 h-0.5 bg-dashed bg-amber-500/20 shadow-xs" />
                              
                              {/* Marker pins */}
                              {/* Kitchen dispatch */}
                              <div className="absolute left-1/4 top-1/2 -translate-y-1/2 text-center">
                                <span className="text-2xl animate-pulse">🍳</span>
                                <p className="text-[8px] font-black text-gray-400 uppercase mt-1">Kitchen hub</p>
                              </div>

                              {/* Destination customer */}
                              <div className="absolute right-1/4 top-1/2 -translate-y-1/2 text-center">
                                <span className="text-2xl">🏡</span>
                                <p className="text-[8px] font-bold text-emerald-400 uppercase mt-1">Your location</p>
                              </div>

                              {/* Moving active rider */}
                              <div 
                                style={{ left: `${25 + (ord.progress * 0.5)}%` }}
                                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-center z-15 transition-all duration-1000"
                              >
                                <span className="text-3xl filter drop-shadow-md">🛵</span>
                                <p className="text-[9px] font-bold text-emerald-400 uppercase mt-0.5 bg-neutral-900 px-1 rounded-sm border border-emerald-500/10">Rider Active</p>
                              </div>

                              {/* Grid HUD tags overlay */}
                              <div className="absolute bottom-3 left-4 text-left font-mono text-[8px] text-gray-400 bg-black/80 px-2 py-1 rounded-sm">
                                <p>LAT: 37.7889° N</p>
                                <p>LNG: -122.404° W</p>
                              </div>

                              <div className="absolute top-3 right-4 text-right font-mono text-[8px] text-emerald-400 bg-black/80 px-2 py-1 rounded-sm">
                                <p>SIGNAL: STABLE</p>
                                <p>ALT: BAROMETRIC</p>
                              </div>
                            </div>

                            {/* Deliver process details bar */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                              {/* Status parameters */}
                              <div className="space-y-1">
                                <p className="font-bold text-neutral-900 border-b border-gray-200 pb-1.5 uppercase tracking-wider text-[10px] text-gray-400">Step Status</p>
                                <div className="space-y-1 mt-2">
                                  <div className="flex justify-between font-bold">
                                    <span>Preparation Done</span>
                                    <span className="text-emerald-600">✔ Done</span>
                                  </div>
                                  <div className="flex justify-between font-bold">
                                    <span>Rider Dispatched</span>
                                    <span className={ord.progress >= 50 ? "text-emerald-600" : "text-gray-400"}>
                                      {ord.progress >= 50 ? "✔ Done" : "Preparing..."}
                                    </span>
                                  </div>
                                  <div className="flex justify-between font-bold">
                                    <span>Rider Arrived</span>
                                    <span className={ord.progress >= 100 ? "text-emerald-600" : "text-gray-400"}>
                                      {ord.progress >= 100 ? "✔ Done" : "ETA Minutes"}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Contact courier info and ETA progress */}
                              <div className="space-y-2.5">
                                <p className="font-bold text-neutral-900 border-b border-gray-200 pb-1.5 uppercase tracking-wider text-[10px] text-gray-400">Contact Courier</p>
                                <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-gray-200 shadow-xs">
                                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-neutral-950 font-bold flex items-center justify-center text-sm uppercase">JG</div>
                                  <div>
                                    <h5 className="font-bold text-neutral-800 text-xs">Jimmy G. (Flash Courier)</h5>
                                    <p className="text-[10px] text-gray-400">Authorized local micro contractor</p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <a href="tel:+1555431102" className="flex-1 bg-gray-100 hover:bg-gray-200 text-neutral-800 font-extrabold text-xs py-2 rounded-lg text-center flex items-center justify-center gap-1.5 cursor-pointer">
                                    <Phone className="w-3.5 h-3.5" /> Call Rider
                                  </a>
                                  <button onClick={() => setActiveTab('support')} className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold text-xs py-2 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer">
                                    <MessageSquare className="w-3.5 h-3.5" /> Support Chat
                                  </button>
                                </div>
                              </div>
                            </div>

                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* SAVED WISHLIST */}
          {subTab === 'wishlist' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-black text-neutral-900 tracking-tight">Your Saved Wishlist</h3>
                <p className="text-xs text-gray-400 mt-1">Gourmet dishes and fresh organic staples you earmarked as favorites.</p>
              </div>

              {wishedProducts.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 border border-dashed border-gray-200 rounded-2xl">
                  <span className="text-3xl text-gray-400 inline-block mb-2">💚</span>
                  <p className="text-sm font-bold text-gray-500">Your wishlist is currently clear.</p>
                  <button onClick={() => setActiveTab('storefront')} className="mt-2 text-xs font-bold text-amber-600 underline">Add dishes at storefront</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishedProducts.map((p) => (
                    <div key={`wished-${p.id}`} className="bg-white border border-gray-150 p-4 rounded-xl flex gap-3.5 items-center justify-between">
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-3xl">{p.image}</span>
                        <div>
                          <h4 className="font-bold text-neutral-900 line-clamp-1">{p.name}</h4>
                          <span className="text-amber-600 font-mono font-black">${(p.isDeal && p.dealPrice ? p.dealPrice : p.price).toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setActiveTab('storefront');
                            // Let the storefront selected modal handle customize additions
                          }}
                          className="bg-neutral-900 hover:bg-neutral-800 text-white text-[10px] font-black uppercase px-2.5 py-1.5 rounded-lg cursor-pointer"
                        >
                          Checkout
                        </button>
                        <button
                          onClick={() => {
                            const wishlist = user.wishlist.filter((id) => id !== p.id);
                            setUser({ ...user, wishlist });
                          }}
                          className="text-rose-500 hover:bg-rose-50 px-2 py-1 text-xs font-bold rounded-lg"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MANAGED ADDRESSES */}
          {subTab === 'addresses' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-black text-neutral-900 tracking-tight">Your Delivery Addresses</h3>
                <p className="text-xs text-gray-400 mt-1">Coordinate multiple locations like your suburban home, tech office block, or family.</p>
              </div>

              {user.addresses.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No delivery locations synced yet.</p>
              ) : (
                <div className="space-y-4">
                  {user.addresses.map((addr) => (
                    <div key={addr.id} className="p-4 border border-gray-150 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-sans bg-white">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-neutral-900 bg-gray-100 px-2.5 py-1 rounded-sm">{addr.label}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-xs font-bold uppercase tracking-wider">★ Standard Default</span>
                          )}
                        </div>
                        <h4 className="font-bold text-neutral-850 mt-3">{addr.recipient}</h4>
                        <p className="text-gray-500 mt-1.5 max-w-sm">{addr.addressLines}</p>
                        <p className="text-gray-450 font-mono mt-1">{addr.phone}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {!addr.isDefault && (
                          <button
                            onClick={() => handleSetDefaultAddress(addr.id)}
                            className="text-blue-500 hover:underline font-bold text-xs"
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-rose-500 hover:bg-rose-50 px-2 py-1.5 rounded-lg font-bold text-xs"
                          title="Delete address"
                        >
                          Delete Location
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* LOYALTY LEDGER WALLET */}
          {subTab === 'loyalty' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-black text-neutral-900 tracking-tight">Executive Loyalty Wallet</h3>
                <p className="text-xs text-gray-400 mt-1">Earn 1 pt per dollar spent. Convert points to custom vouchers that slice total cart prices.</p>
              </div>

              {/* Redemptions box message banner */}
              {redeemedCouponMsg && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-950 font-bold text-xs rounded-2xl">
                  {redeemedCouponMsg}
                </div>
              )}

              {/* Point rewards list */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { points: 100, val: 10, label: '$10 Off Coupon' },
                  { points: 250, val: 25, label: '$25 Off Coupon' },
                  { points: 500, val: 50, label: '$50 Off Coupon' },
                ].map((item, idx) => {
                  const cannotAfford = user.loyaltyPoints < item.points;
                  return (
                    <div key={idx} className="border border-gray-150 rounded-2xl p-4 text-center bg-gray-50 flex flex-col justify-between">
                      <div>
                        <span className="text-3xl inline-block mb-1">🎁</span>
                        <h4 className="text-sm font-bold text-neutral-900">{item.label}</h4>
                        <p className="text-xs text-gray-400 mt-1 bg-white p-1 rounded-md border border-gray-150 inline-block">Cost: {item.points} PTS</p>
                      </div>
                      <button
                        disabled={cannotAfford}
                        onClick={() => handleRedeemVoucher(item.points, item.val)}
                        className={`w-full mt-4 py-2 text-xs font-black rounded-lg uppercase tracking-wider ${
                          cannotAfford 
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                            : 'bg-neutral-900 text-white hover:bg-neutral-800 cursor-pointer'
                        }`}
                      >
                        {cannotAfford ? 'Need Point Balance' : 'Redeem & Activate'}
                      </button>
                    </div>
                  );
                })}
              </div>

               {/* Dynamic voucher promo lists */}
              <div className="mt-6 border-t border-gray-150 pt-6">
                <h4 className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-1.5">
                  <Copy className="w-4 h-4 text-gray-400" /> Active Point Redemptions Vouchers
                </h4>
                
                {activeCoupons.filter((c) => c.code.startsWith('REDEEM')).length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No points voucher codes currently registered. Accumulate more points to exchange!</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeCoupons.filter((c) => c.code.startsWith('REDEEM')).map((c, i) => (
                      <div key={i} className="bg-emerald-50/50 border border-emerald-100 p-3.5 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <p className="font-extrabold text-neutral-900">Voucher Coupon code:</p>
                          <code className="text-sm font-bold font-mono text-emerald-700 bg-white p-1 rounded-xs border border-emerald-200 block mt-1">{c.code}</code>
                        </div>
                        <button
                          onClick={() => copyToClipboard(c.code)}
                          className="px-3 py-1.5 bg-neutral-950 text-white hover:bg-emerald-600 text-[10px] font-bold uppercase rounded-lg shrink-0 transition-colors cursor-pointer"
                        >
                          {copiedCode === c.code ? 'Copied! ✔' : 'Copy Code'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Point audit Logs ledger ledger */}
              <div className="mt-6 border-t border-gray-150 pt-6">
                <h4 className="text-sm font-bold text-neutral-900 mb-3">Loyalty Points History Log</h4>
                <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                  {user.pointsLog.map((log) => (
                    <div key={log.id} className="p-2.5 bg-gray-50 border border-gray-100 rounded-lg flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-neutral-800">{log.description}</p>
                        <p className="text-[10px] text-gray-400">{log.date}</p>
                      </div>
                      <span className={`font-black tracking-wider ${
                        log.type === 'earned' ? 'text-emerald-600' : 'text-rose-500'
                      }`}>
                        {log.type === 'earned' ? '+' : ''}{log.points} PTS
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PROFILE SETTINGS */}
          {subTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-black text-neutral-900 tracking-tight">Update Details</h3>
                <p className="text-xs text-gray-400 mt-1">Review contact parameters, notification triggers or profile labels.</p>
              </div>

              {isSavedMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-950 font-bold border border-emerald-100 rounded-xl text-xs">
                  Your profiles settings have been saved successfully!
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-black text-gray-400 mb-1">Full Member Name</label>
                    <input 
                      type="text" 
                      required 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-gray-50 rounded-xl p-3 border border-gray-250 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-black text-gray-400 mb-1">Authenticated Email</label>
                    <input 
                      type="email" 
                      required 
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full bg-gray-50 rounded-xl p-3 border border-gray-250"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-black text-gray-400 mb-1">Authenticated Contact Mobile</label>
                  <input 
                    type="text" 
                    required 
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full bg-gray-50 rounded-xl p-3 border border-gray-250 font-mono"
                  />
                </div>

                <div className="border-t border-gray-150 pt-5 flex justify-end">
                  <button 
                    type="submit" 
                    className="px-6 py-3 bg-neutral-950 hover:bg-neutral-850 text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    Save Changes Properties
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
