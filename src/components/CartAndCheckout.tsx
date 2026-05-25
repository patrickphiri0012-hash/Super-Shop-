import React, { useState } from 'react';
import { ShoppingCart, Trash2, MapPin, CreditCard, Gift, ShieldCheck, ShoppingBag, ArrowRight, Truck, CheckCircle, Ticket, FileText, ArrowLeft } from 'lucide-react';
import { CartItem, UserProfile, Order, Coupon, UserAddress } from '../types';

interface CartAndCheckoutProps {
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  activeCoupons: Coupon[];
  createOrder: (order: Order) => void;
  activeOrders: Order[];
  setActiveTab: (tab: 'storefront' | 'cart' | 'account' | 'admin' | 'support') => void;
  setIsCartOpen: (open: boolean) => void;
}

export default function CartAndCheckout({
  cart,
  setCart,
  user,
  setUser,
  activeCoupons,
  createOrder,
  activeOrders,
  setActiveTab,
  setIsCartOpen,
}: CartAndCheckoutProps) {
  
  // Checkout flow phase handles
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'payment'>('cart');
  const [successOrder, setSuccessOrder] = useState<Order | null>(null);

  // Addresses selection handles
  const [selectedAddressId, setSelectedAddressId] = useState<string>(user.addresses[0]?.id || '');
  const [showNewAddressForm, setShowNewAddressForm] = useState<boolean>(false);
  const [newAddrLabel, setNewAddrLabel] = useState<string>('🏡 Home');
  const [newAddrRecipient, setNewAddrRecipient] = useState<string>(user.name || '');
  const [newAddrLines, setNewAddrLines] = useState<string>('');
  const [newAddrPhone, setNewAddrPhone] = useState<string>(user.phone || '');

  // Promo handling codes
  const [couponInput, setCouponInput] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string>('');

  // Payment Form input handles
  const [cardHolder, setCardHolder] = useState<string>(user.name || '');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvv, setCardCvv] = useState<string>('');
  const [paymentError, setPaymentError] = useState<string>('');
  const [checkoutNotes, setCheckoutNotes] = useState<string>('');

  // Subtotal calculations
  const subtotal = cart.reduce((acc, item) => {
    const itemPrice = item.product.isDeal && item.product.dealPrice ? item.product.dealPrice : item.product.price;
    return acc + itemPrice * item.quantity;
  }, 0);

  // Delivery fee estimation logic
  const deliveryFee = subtotal > 50 ? 0.00 : 3.50;

  // Coupon application discount
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      discountAmount = (subtotal * appliedCoupon.value) / 100;
    } else {
      discountAmount = appliedCoupon.value;
    }
  }

  // Final Total calculation
  const total = Math.max(0, subtotal + deliveryFee - discountAmount);

  // Address add helper
  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrLines.trim() || !newAddrPhone.trim()) return;

    const newAddr: UserAddress = {
      id: `addr-${Date.now()}`,
      label: newAddrLabel,
      recipient: newAddrRecipient,
      addressLines: newAddrLines.trim(),
      phone: newAddrPhone.trim(),
      isDefault: false,
    };

    const updatedAddresses = [...user.addresses, newAddr];
    setUser({
      ...user,
      addresses: updatedAddresses,
    });

    setSelectedAddressId(newAddr.id);
    setShowNewAddressForm(false);
    setNewAddrLines('');
  };

  // Format credit card numbers beautifully with spacing
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value.replace(/\D/g, '');
    const matched = text.match(/.{1,4}/g);
    setCardNumber(matched ? matched.join(' ') : text);
  };

  // Format expiry Month/Year dates
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value.replace(/\D/g, '');
    if (text.length <= 4) {
      const parts = text.match(/.{1,2}/g);
      setCardExpiry(parts ? parts.join('/') : text);
    }
  };

  // Apply code checks
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');

    const match = activeCoupons.find((c) => c.code.toUpperCase() === couponInput.toUpperCase());
    if (!match) {
      setCouponError('Invalid voucher / coupon code');
      return;
    }

    if (!match.isActive) {
      setCouponError('This coupon code is currently deactivated.');
      return;
    }

    if (subtotal < match.minOrder) {
      setCouponError(`Min order of $${match.minOrder.toFixed(2)} is required for this offer.`);
      return;
    }

    setAppliedCoupon(match);
    setCouponInput('');
  };

  // Submit secure checkout process
  const handleFinalCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError('');

    if (cardNumber.replace(/\s/g, '').length !== 16) {
      setPaymentError('Please supply a valid 16-digit credit card.');
      return;
    }

    if (cardExpiry.length !== 5) {
      setPaymentError('Please fill in a valid expiry date (MM/YY).');
      return;
    }

    if (cardCvv.length !== 3) {
      setPaymentError('Provide your 3-digit CVV safety code.');
      return;
    }

    // Capture chosen address metadata
    const activeAddress = user.addresses.find((a) => a.id === selectedAddressId) || user.addresses[0];

    const finalInvoiceNumber = `INV-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(10 + Math.random() * 90)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      items: [...cart],
      subtotal,
      discountAmount,
      deliveryFee,
      total,
      addressName: activeAddress?.label || 'Direct Collection',
      addressLines: activeAddress?.addressLines || 'No physical delivery required',
      phone: activeAddress?.phone || user.phone,
      paymentMethod: 'Credit/Debit Card (Visa/MC)',
      status: 'pending',
      progress: 10,
      date: new Date().toISOString().split('T')[0],
      eta: '25 - 40 MINS',
      notes: checkoutNotes,
      invoiceNumber: finalInvoiceNumber,
    };

    // Credit Loyalty points! Earn 1 point per $ of cost
    const pointsEarned = Math.round(total);
    const updatedPointsLog = [
      {
        id: `pts-${Date.now()}`,
        points: pointsEarned,
        type: 'earned' as const,
        description: `Order ${finalInvoiceNumber} delivery credits`,
        date: new Date().toISOString().split('T')[0],
      },
      ...user.pointsLog,
    ];

    const currentTotalPoints = user.loyaltyPoints + pointsEarned;
    let computedTier = user.tier;
    if (currentTotalPoints >= 600) computedTier = 'Platinum';
    else if (currentTotalPoints >= 300) computedTier = 'Gold';
    else if (currentTotalPoints >= 100) computedTier = 'Silver';

    setUser({
      ...user,
      loyaltyPoints: currentTotalPoints,
      tier: computedTier,
      pointsLog: updatedPointsLog,
    });

    createOrder(newOrder);
    setSuccessOrder(newOrder);
    
    // Wipe shopping cart
    setCart([]);
    setIsCartOpen(false);
  };

  if (successOrder) {
    return (
      <div id="checkout-success-container" className="max-w-4xl mx-auto px-4 py-12 animate-fade-in text-center">
        <div className="bg-white border border-gray-100 rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="inline-flex p-5 bg-emerald-50 text-emerald-600 rounded-full mb-6">
            <CheckCircle className="w-16 h-16" />
          </div>
          
          <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Your Supper Order is Confirmed!</h2>
          <p className="text-sm text-gray-500 mt-2">
            Invoice Number: <span className="font-mono font-black text-amber-600 bg-neutral-950 px-2 py-1 rounded-sm text-xs">{successOrder.invoiceNumber}</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">Chef-prepared kitchen has already received your order details.</p>

          {/* Quick tracker preview inside checkout */}
          <div className="my-10 bg-gray-50 rounded-2xl p-6 border border-gray-150 text-left">
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2 mb-4">
              <Truck className="w-4 h-4 text-emerald-600" /> Preping Dispatch Tracker (Live Updates)
            </h4>
            
            <div className="grid grid-cols-4 gap-2 text-center relative">
              {/* Connector line */}
              <div className="absolute top-4 left-10 right-10 h-1 bg-gray-200 -z-5" />
              {[
                { label: 'Confirmed', done: true, icon: '📋' },
                { label: 'Preparing', done: false, icon: '🍳' },
                { label: 'Dispatched', done: false, icon: '🛵' },
                { label: 'Delivered', done: false, icon: '🏡' },
              ].map((step, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs border-2 z-10 ${
                    step.done ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-gray-400 border-gray-200'
                  }`}>
                    {step.icon}
                  </div>
                  <span className={`text-[10px] font-bold mt-2 ${step.done ? 'text-emerald-600' : 'text-gray-400'}`}>{step.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-gray-150 pt-4 flex justify-between items-center text-sm">
              <div>
                <p className="text-xs text-gray-400">Estimated Delivery Time:</p>
                <p className="font-extrabold text-neutral-900">{successOrder.eta}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Recipient Destination:</p>
                <p className="font-bold text-neutral-900">{successOrder.addressName} ({successOrder.phone})</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => {
                setActiveTab('account');
                setSuccessOrder(null);
              }}
              className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl text-sm shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" /> Track in My Account
            </button>
            <button 
              onClick={() => {
                setActiveTab('storefront');
                setSuccessOrder(null);
              }}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold rounded-xl text-sm shadow-xs transition-all cursor-pointer"
            >
              Order Something Else
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div id="shopping-flow-workspace" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* 1. Header indicators */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-150 pb-6 mb-8">
        <div>
          <h2 className="text-3xl font-black text-neutral-900 tracking-tight">Supper Order Checkout</h2>
          <p className="text-sm text-gray-500 mt-1">Review your basket, select preferred delivery address rates and proceed with secure payments.</p>
        </div>
        
        {/* Step highlights */}
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
          <span className={`px-3 py-1.5 rounded-lg border ${checkoutStep === 'cart' ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>1. Review Cart</span>
          <ArrowRight className="w-3.5 h-3.5" />
          <span className={`px-3 py-1.5 rounded-lg border ${checkoutStep === 'shipping' ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>2. Shipping</span>
          <ArrowRight className="w-3.5 h-3.5" />
          <span className={`px-3 py-1.5 rounded-lg border ${checkoutStep === 'payment' ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>3. Checkout Pay</span>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 border border-dashed border-gray-200 rounded-3xl">
          <div className="inline-flex p-5 bg-amber-50 text-amber-500 rounded-full text-4xl mb-4">🛒</div>
          <h3 className="text-xl font-bold text-neutral-900">Your basket is currently empty</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">Head back to our storefront to fill your cupboard with hot recipes and organic vegetables.</p>
          <button 
            onClick={() => setActiveTab('storefront')}
            className="mt-6 px-6 py-3 bg-neutral-900 text-white text-sm font-semibold rounded-xl shadow-xs hover:bg-neutral-800 transition-all"
          >
            Go Settle Supper
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main workspace section */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* PHASE A: REVIEW BASKET ITEMS */}
            {checkoutStep === 'cart' && (
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xs">
                <h3 className="text-lg font-black text-neutral-900 tracking-tight flex items-center gap-2 mb-4">
                  <ShoppingCart className="w-5 h-5 text-amber-500" /> Items Inside Your Cart ({cart.length})
                </h3>

                <div className="divide-y divide-gray-150">
                  {cart.map((item) => {
                    const itemIsDeal = item.product.isDeal && item.product.dealPrice;
                    const cardPrice = itemIsDeal ? item.product.dealPrice! : item.product.price;
                    return (
                      <div key={item.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                          <span className="text-4xl bg-gray-50 border border-gray-100 rounded-xl p-3 inline-block shrink-0">{item.product.image}</span>
                          <div>
                            <h4 className="text-sm font-bold text-neutral-900 truncate max-w-xs">{item.product.name}</h4>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
                              <span>Portion: <span className="font-semibold text-neutral-800">{item.selectedWeight}</span></span>
                              <span>•</span>
                              <span>Unit Price: <span className="font-semibold text-neutral-800">${cardPrice.toFixed(2)}</span></span>
                            </div>
                            {item.notes && (
                              <p className="text-[11px] text-amber-600 font-mono font-medium mt-1 bg-amber-50 px-2 py-0.5 rounded-sm inline-block">
                                Requests: &ldquo;{item.notes}&rdquo;
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Adjust quantities */}
                        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 sm:gap-4">
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50 divide-x divide-gray-200">
                            <button
                              onClick={() => {
                                const copy = [...cart];
                                const match = copy.find((c) => c.id === item.id);
                                if (match) {
                                  if (match.quantity > 1) {
                                    match.quantity--;
                                    setCart(copy);
                                  } else {
                                    setCart(copy.filter((c) => c.id !== item.id));
                                  }
                                }
                              }}
                              className="px-2.5 py-1.5 text-xs font-black hover:bg-gray-155 text-neutral-850"
                            >
                              &minus;
                            </button>
                            <span className="px-3 py-1.5 text-xs font-bold text-neutral-900 bg-white w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => {
                                const copy = [...cart];
                                const match = copy.find((c) => c.id === item.id);
                                if (match) {
                                  match.quantity++;
                                  setCart(copy);
                                }
                              }}
                              className="px-2.5 py-1.5 text-xs font-black hover:bg-gray-155 text-neutral-850"
                            >
                              &#43;
                            </button>
                          </div>

                          <span className="text-sm font-black text-neutral-950 w-20 text-right">
                            ${(cardPrice * item.quantity).toFixed(2)}
                          </span>

                          <button
                            onClick={() => {
                              setCart(cart.filter((c) => c.id !== item.id));
                            }}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setCheckoutStep('shipping')}
                    className="px-6 py-3.5 bg-neutral-900 border border-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    Confirm Delivery Address <ArrowRight className="w-4 h-4 text-amber-500" />
                  </button>
                </div>
              </div>
            )}

            {/* PHASE B: SHIPPING DETAILS FORM SELECT */}
            {checkoutStep === 'shipping' && (
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xs space-y-6">
                <div>
                  <h3 className="text-lg font-black text-neutral-900 tracking-tight flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-amber-500" /> Destination & Delivery Details
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Pick among your saved delivery locations or define a brand-new target below.</p>
                </div>

                {/* Grid List of of stored addresses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedAddressId === addr.id
                          ? 'border-neutral-950 bg-neutral-950 text-white shadow-md'
                          : 'border-gray-200 text-neutral-800 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-extrabold px-2 py-0.5 rounded-sm ${
                          selectedAddressId === addr.id ? 'bg-amber-500 text-neutral-950' : 'bg-gray-100 text-neutral-700'
                        }`}>{addr.label}</span>
                        {addr.isDefault && <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">★ Default</span>}
                      </div>
                      <h4 className="text-sm font-bold mt-2 font-sans">{addr.recipient}</h4>
                      <p className="text-xs mt-1 leading-normal text-gray-350">{addr.addressLines}</p>
                      <p className="text-xs font-mono mt-2 text-gray-400">{addr.phone}</p>
                    </div>
                  ))}
                </div>

                {/* Manual triggers to append addresses */}
                {!showNewAddressForm ? (
                  <button
                    onClick={() => setShowNewAddressForm(true)}
                    className="inline-flex items-center gap-1.5 text-xs text-[#52796f] bg-[#e8f1f5] hover:bg-[#d0e1e9] font-black px-4 py-2.5 rounded-lg transition-all"
                  >
                    🚀 Register & Deliver To A New Address Choice
                  </button>
                ) : (
                  <form onSubmit={handleAddNewAddress} className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#2f3e46]">Register A New Custom Address</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Save Label</label>
                        <select
                          value={newAddrLabel}
                          onChange={(e) => setNewAddrLabel(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs"
                        >
                          <option>🏡 Home</option>
                          <option>💼 Office</option>
                          <option>⛱️ Holiday Home</option>
                          <option>📦 Other</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Recipient Full Name</label>
                        <input
                          type="text"
                          required
                          value={newAddrRecipient}
                          onChange={(e) => setNewAddrRecipient(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs"
                          placeholder="e.g. Patrick Phiri"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Complete Street Location Lines</label>
                      <input
                        type="text"
                        required
                        value={newAddrLines}
                        onChange={(e) => setNewAddrLines(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs"
                        placeholder="e.g. Loft Apt 4, 18 Highlands Avenue, Suburban North"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Contact Phone</label>
                        <input
                          type="text"
                          required
                          value={newAddrPhone}
                          onChange={(e) => setNewAddrPhone(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-mono"
                          placeholder="e.g. +1 (555) 753-2313"
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-4">
                        <button
                          type="submit"
                          className="bg-neutral-900 border border-neutral-900 text-white font-extrabold text-xs px-4 py-2 rounded-lg"
                        >
                          Save Location
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowNewAddressForm(false)}
                          className="text-gray-500 font-bold text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                <div className="pt-4 border-t border-gray-150 flex items-center justify-between gap-4">
                  <button
                    onClick={() => setCheckoutStep('cart')}
                    className="px-4 py-2 text-gray-600 font-bold text-sm bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" /> Go Back
                  </button>

                  <button
                    onClick={() => {
                      if (!selectedAddressId) {
                        alert('Please pick or save a valid shipping address destination first.');
                        return;
                      }
                      setCheckoutStep('payment');
                    }}
                    className="px-6 py-3.5 bg-neutral-900 border border-neutral-900 hover:bg-neutral-800 text-white font-extrabold text-sm rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    Proceed To Payment Page <ArrowRight className="w-4 h-4 text-amber-500" />
                  </button>
                </div>

              </div>
            )}

            {/* PHASE C: SECURE BANK CARD checkout */}
            {checkoutStep === 'payment' && (
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xs space-y-6">
                <div>
                  <h3 className="text-lg font-black text-neutral-900 tracking-tight flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-amber-500" /> Payment & Secure Authentication
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Simulated 256-bit bank card payments. We support major card brands securely.</p>
                </div>

                {/* Animated credit card preview */}
                <div className="relative w-full max-w-sm mx-auto h-48 rounded-2xl bg-gradient-to-br from-amber-500 via-rose-500 to-amber-700 text-white p-6 shadow-lg overflow-hidden flex flex-col justify-between">
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-mono font-extrabold tracking-widest bg-white/20 px-3 py-1.5 rounded-md uppercase">Supper Card</span>
                    <span className="text-xl font-black italic">VISA</span>
                  </div>

                  <span className="text-lg sm:text-xl font-mono tracking-widest truncate mt-4">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </span>

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[8px] uppercase text-amber-100 font-bold">Cardholder</p>
                      <h5 className="text-xs font-bold font-mono tracking-wide truncate max-w-[120px] uppercase">
                        {cardHolder || 'PARTNER USER'}
                      </h5>
                    </div>
                    <div>
                      <p className="text-[8px] uppercase text-amber-100 font-bold">Expires</p>
                      <h5 className="text-xs font-bold font-mono tracking-wider">
                        {cardExpiry || 'MM/YY'}
                      </h5>
                    </div>
                  </div>
                </div>

                {/* Checkout secure form validation */}
                <form onSubmit={handleFinalCheckoutSubmit} className="space-y-4">
                  
                  {paymentError && (
                    <div className="p-3 bg-red-50 text-red-650 text-xs font-bold rounded-xl border border-red-100">
                      ⚠ Error: {paymentError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-black text-gray-400 mb-1.5">Cardholder Full Name</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. Patrick Phiri"
                        value={cardHolder} 
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full bg-gray-50 text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-amber-500 uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-black text-gray-400 mb-1.5">16-Digit Credit Card Number</label>
                      <input 
                        type="text" 
                        maxLength={19}
                        required 
                        placeholder="4532 9021 3412 9011"
                        value={cardNumber} 
                        onChange={handleCardNumberChange}
                        className="w-full bg-gray-50 text-xs font-mono px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-black text-gray-400 mb-1.5">Expiry Date</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="MM/YY"
                        value={cardExpiry} 
                        onChange={handleExpiryChange}
                        className="w-full bg-gray-50 text-xs font-mono px-3.5 py-2.5 rounded-xl border border-gray-200 text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-black text-gray-400 mb-1.5">CVV Safety Key</label>
                      <input 
                        type="password" 
                        maxLength={3}
                        required 
                        placeholder="***"
                        value={cardCvv} 
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-gray-50 text-xs font-mono px-3.5 py-2.5 rounded-xl border border-gray-200 text-center"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-black text-gray-400 mb-1.5">Add Delivery Rider Message (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Ring doorbell, leave at front desk, code is 4920"
                      value={checkoutNotes}
                      onChange={(e) => setCheckoutNotes(e.target.value)}
                      className="w-full bg-gray-50 text-xs px-3.5 py-2.5 rounded-xl border border-gray-200"
                    />
                  </div>

                  <div className="pt-4 border-t border-gray-150 flex justify-between items-center bg-white gap-4">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('shipping')}
                      className="px-4 py-2 text-gray-600 font-bold text-sm bg-white border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center gap-1"
                    >
                      <ArrowLeft className="w-4 h-4" /> Destination
                    </button>

                    <button
                      type="submit"
                      className="px-8 py-3.5 bg-emerald-600 border border-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-xl cursor-pointer flex items-center gap-2 hover:shadow-lg transition-all"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-300" /> Secure Submit: Pay ${total.toFixed(2)}
                    </button>
                  </div>

                </form>
              </div>
            )}

          </div>

          {/* Checkout Totals Summary sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. Totals pricing matrix */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs">
              <h3 className="text-xs font-bold font-mono tracking-widest text-gray-400 uppercase border-b border-gray-100 pb-2 mb-4">Payment Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Cart Subtotal</span>
                  <span className="font-extrabold text-neutral-900">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Muted Delivery Fee</span>
                  <span className="font-bold text-neutral-900">
                    {deliveryFee === 0 ? <span className="text-emerald-600 font-black">FREE (Order &gt;$50)</span> : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-sm text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100/30 font-bold">
                    <span className="flex items-center gap-1"><Ticket className="w-4 h-4" /> Discount ({appliedCoupon.code})</span>
                    <span>&minus; ${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t border-gray-150 pt-3 flex justify-between items-end bg-white">
                  <div>
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">Total cost</span>
                    <p className="text-xs text-gray-400 font-medium">VAT and duty tax included.</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#52796f]">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Coupon submission panel */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs">
              <h3 className="text-xs font-bold font-mono tracking-widest text-gray-400 uppercase mb-3 flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-amber-500" /> Redeem Promo / Coupon
              </h3>

              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. SUPPER10"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="bg-gray-50 text-xs px-3.5 py-2 w-full rounded-lg border border-gray-200 placeholder-gray-400 focus:outline-hidden uppercase"
                />
                <button
                  type="submit"
                  className="bg-neutral-900 text-white font-bold text-xs px-4 rounded-lg hover:bg-neutral-800 shrink-0"
                >
                  Apply
                </button>
              </form>

              {couponError && <p className="text-[11px] text-rose-500 font-bold mt-2 font-mono">⚠ {couponError}</p>}
              
              <div className="mt-4 bg-gray-50 border border-gray-150 rounded-xl p-3">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-2">Available Codes Finder</p>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <code className="text-[10px] font-black text-amber-600 bg-amber-50 px-1 py-0.5 rounded-sm">SUPPER10</code>
                    <span className="text-[11px] text-gray-550">Save $10 (Spend &gt; $30)</span>
                  </div>
                  <div className="flex justify-between">
                    <code className="text-[10px] font-black text-amber-600 bg-amber-50 px-1 py-0.5 rounded-sm">ORGANIC20</code>
                    <span className="text-[11px] text-gray-550">20% discount (Spend &gt; $50)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Secure and Safety parameters */}
            <div className="bg-neutral-50 rounded-2xl p-4 border border-gray-150 text-xs text-gray-500 space-y-2">
              <p className="font-bold text-neutral-800 flex items-center gap-1 text-[11px] uppercase tracking-wider mb-2">
                🛡 Verified Protection Guarantee
              </p>
              <p>Your grocery order is protected. Fast courier and rider networks carry high-grade transport cooling kits and hot pizza thermal compartments.</p>
              <p>Need custom changes? Give our support line a call before dispatch.</p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
