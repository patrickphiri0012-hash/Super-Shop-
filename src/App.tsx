import React, { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, X, ClipboardCheck, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import Navbar from './components/Navbar';
import Storefront from './components/Storefront';
import CartAndCheckout from './components/CartAndCheckout';
import UserAccount from './components/UserAccount';
import SupportPortal from './components/SupportPortal';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';

// Core database seeds & types
import { INITIAL_PRODUCTS, INITIAL_DELIVERY_ZONES, INITIAL_COUPONS, INITIAL_FAQS, INITIAL_ADDRESSES } from './data/mockData';
import { Product, CartItem, Order, UserProfile, Coupon, DeliveryZone, SupportTicket } from './types';

export default function App() {
  
  // 1. Core Global Database state (with custom local-persistence synchronizers)
  const [products, setProducts] = useState<Product[]>(() => {
    const local = localStorage.getItem('suppershop_products');
    return local ? JSON.parse(local) : INITIAL_PRODUCTS;
  });

  const [activeCoupons, setActiveCoupons] = useState<Coupon[]>(() => {
    const local = localStorage.getItem('suppershop_coupons');
    return local ? JSON.parse(local) : INITIAL_COUPONS;
  });

  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>(() => {
    const local = localStorage.getItem('suppershop_zones');
    return local ? JSON.parse(local) : INITIAL_DELIVERY_ZONES;
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const local = localStorage.getItem('suppershop_user');
    if (local) return JSON.parse(local);
    return {
      name: 'Patrick Phiri',
      email: 'patrickphiri0012@gmail.com',
      phone: '+1 (555) 732-2342',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      addresses: INITIAL_ADDRESSES,
      loyaltyPoints: 124,
      tier: 'Silver',
      wishlist: ['prod-1', 'prod-3'],
      pointsLog: [
        { id: 'pts-init-1', points: 74, type: 'earned', description: 'Gourmet Steak dinner harvest loyalty reward', date: '2026-05-12' },
        { id: 'pts-init-2', points: 50, type: 'earned', description: 'Affiliate sign-up wellness credits', date: '2026-05-10' }
      ]
    };
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const local = localStorage.getItem('suppershop_cart');
    return local ? JSON.parse(local) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const local = localStorage.getItem('suppershop_orders');
    if (local) return JSON.parse(local);
    // Seed with 1 historic completed order so metrics maps have visual values!
    return [
      {
        id: 'ord-hist-1',
        invoiceNumber: 'INV-3401-22',
        items: [
          {
            id: 'prod-3-Standard Bowl',
            product: INITIAL_PRODUCTS[2], // Salmon bowl
            quantity: 2,
            selectedWeight: 'Standard Bowl',
            notes: 'A bit of extra cucumber please'
          }
        ],
        subtotal: 33.00,
        discountAmount: 0,
        deliveryFee: 3.50,
        total: 36.50,
        addressName: '🏡 Home',
        addressLines: 'Apt 42B, Sunset Boulevard, Downtown Core',
        phone: '+1 (555) 732-2342',
        paymentMethod: 'Credit/Debit Card (Visa/MC)',
        status: 'delivered',
        progress: 100,
        date: '2026-05-18',
        eta: 'Delivered in 28 MINS'
      }
    ];
  });

  const [ticketsList, setTicketsList] = useState<SupportTicket[]>(() => {
    const local = localStorage.getItem('suppershop_tickets');
    if (local) return JSON.parse(local);
    return [
      {
        id: 'tkt-init-1',
        name: 'Patrick Phiri',
        email: 'patrickphiri0012@gmail.com',
        category: 'Delivery Issue',
        subject: 'Estimated ETA discrepancy in Highlands circle',
        message: 'Order arrived slightly delayed due to rainy conditions. The thermal bag was nicely dry and hot though!',
        status: 'Resolved',
        date: '2026-05-20',
        chat: []
      }
    ];
  });

  // UI state toggles
  const [activeTab, setActiveTab] = useState<'storefront' | 'cart' | 'account' | 'admin' | 'support'>('storefront');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Sync state modifications to LocalStorage for zero-loss reload in preview
  useEffect(() => {
    localStorage.setItem('suppershop_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('suppershop_coupons', JSON.stringify(activeCoupons));
  }, [activeCoupons]);

  useEffect(() => {
    localStorage.setItem('suppershop_zones', JSON.stringify(deliveryZones));
  }, [deliveryZones]);

  useEffect(() => {
    localStorage.setItem('suppershop_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('suppershop_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('suppershop_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('suppershop_tickets', JSON.stringify(ticketsList));
  }, [ticketsList]);

  // Simulated GPS mapper updater triggers order progression updates
  useEffect(() => {
    const gpsInterval = setInterval(() => {
      setOrders((prevOrders) => {
        let changed = false;
        const mapped = prevOrders.map((ord) => {
          // Increment progress if preparing/dispatched to simulate real GPS moving crosshairs!
          if (ord.status === 'preparing' && ord.progress < 50) {
            changed = true;
            const nextProgress = ord.progress + 5;
            return {
              ...ord,
              progress: nextProgress,
              status: nextProgress >= 50 ? 'dispatched' : 'preparing'
            };
          } else if (ord.status === 'dispatched' && ord.progress < 100) {
            changed = true;
            const nextProgress = ord.progress + 6;
            return {
              ...ord,
              progress: nextProgress,
              status: nextProgress >= 100 ? 'delivered' : 'dispatched',
              eta: nextProgress >= 100 ? 'Arrived & Delivered Successfully!' : `${Math.max(2, 20 - Math.round(nextProgress * 0.15))} MINS`
            };
          }
          return ord;
        });
        return changed ? mapped : prevOrders;
      });
    }, 6000);
    return () => clearInterval(gpsInterval);
  }, []);

  // 2. Global state modification callbacks
  const toggleWishlist = (productId: string) => {
    const isWished = user.wishlist.includes(productId);
    const wishlist = isWished
      ? user.wishlist.filter((id) => id !== productId)
      : [...user.wishlist, productId];
    setUser({ ...user, wishlist });
  };

  const addToCart = (product: Product, quantity: number, weight: string, notes: string) => {
    const cartItemId = `${product.id}-${weight}`;
    const copy = [...cart];
    const existing = copy.find((item) => item.id === cartItemId);

    if (existing) {
      existing.quantity += quantity;
      if (notes) existing.notes = notes;
    } else {
      copy.push({
        id: cartItemId,
        product,
        quantity,
        selectedWeight: weight || product.weights[0] || 'Standard Portion',
        notes: notes || undefined
      });
    }

    setCart(copy);
    setIsCartOpen(true); // Always pop drawer immediately to give crisp operational feedback
  };

  const createOrder = (newOrder: Order) => {
    setOrders([newOrder, ...orders]);
  };

  const subtotalCart = cart.reduce((acc, item) => {
    const itemPrice = item.product.isDeal && item.product.dealPrice ? item.product.dealPrice : item.product.price;
    return acc + itemPrice * item.quantity;
  }, 0);

  return (
    <div id="supper-shop-root-canvas" className="min-h-screen flex flex-col justify-between bg-neutral-50/50 text-neutral-900 leading-normal font-sans antialiased selection:bg-amber-400 selection:text-neutral-950">
      
      {/* Dynamic Header navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cart={cart}
        user={user}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setIsCartOpen={setIsCartOpen}
      />

      {/* Primary Workspace Panels Router */}
      <main className="grow pb-12">
        {activeTab === 'storefront' && (
          <Storefront
            products={products}
            user={user}
            toggleWishlist={toggleWishlist}
            addToCart={addToCart}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {activeTab === 'cart' && (
          <CartAndCheckout
            cart={cart}
            setCart={setCart}
            user={user}
            setUser={setUser}
            activeCoupons={activeCoupons}
            createOrder={createOrder}
            activeOrders={orders}
            setActiveTab={setActiveTab}
            setIsCartOpen={setIsCartOpen}
          />
        )}

        {activeTab === 'account' && (
          <UserAccount
            user={user}
            setUser={setUser}
            orders={orders}
            products={products}
            activeCoupons={activeCoupons}
            setActiveCoupons={setActiveCoupons}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanel
            products={products}
            setProducts={setProducts}
            orders={orders}
            setOrders={setOrders}
            activeCoupons={activeCoupons}
            setActiveCoupons={setActiveCoupons}
            deliveryZones={deliveryZones}
            setDeliveryZones={setDeliveryZones}
          />
        )}

        {activeTab === 'support' && (
          <SupportPortal
            orders={orders}
            deliveryZones={deliveryZones}
            faqs={INITIAL_FAQS}
            ticketsList={ticketsList}
            setTicketsList={setTicketsList}
            user={user}
          />
        )}
      </main>

      {/* PERSISTENT CART OVERLAY FLYOUT DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" id="cart-drawer-overlay">
          {/* Black blur background */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
            onClick={() => setIsCartOpen(false)}
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2.5xl flex flex-col justify-between border-l border-gray-100 transform duration-300">
              
              {/* Drawer header */}
              <div className="p-6 border-b border-gray-150 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-neutral-900 tracking-tight">Your Custom Supper Basket</h3>
                    <p className="text-[11px] text-gray-400 font-mono font-bold uppercase tracking-widest">{cart.length} items registered</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
                  title="Close Cart drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer items list */}
              <div className="grow p-6 overflow-y-auto space-y-4 scrollbar-thin">
                {cart.length === 0 ? (
                  <div className="text-center py-16 text-gray-400 space-y-3">
                    <span className="text-4xl block">🧺</span>
                    <p className="text-sm font-bold">Your supper list is completely empty</p>
                    <p className="text-xs">Browse our hot culinary dishes or fresh organic vegetables to fill your table!</p>
                  </div>
                ) : (
                  cart.map((item) => {
                    const itemPrice = item.product.isDeal && item.product.dealPrice ? item.product.dealPrice : item.product.price;
                    return (
                      <div key={item.id} className="p-3 bg-gray-50/60 rounded-xl border border-gray-150 flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-3xl shrink-0">{item.product.image}</span>
                          <div className="min-w-0">
                            <h4 className="font-bold text-neutral-900 truncate">{item.product.name}</h4>
                            <p className="text-[10px] text-gray-400 mt-0.5">Portion: {item.selectedWeight} • ${(itemPrice).toFixed(2)}</p>
                            {item.notes && (
                              <p className="text-[9px] text-amber-600 font-mono mt-1 bg-amber-50 px-1 py-0.5 rounded-sm inline-block">
                                &ldquo;{item.notes}&rdquo;
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Adjust quantities */}
                        <div className="flex items-center gap-2.5 shrink-0 ml-2">
                          <div className="flex items-center border border-gray-205 rounded bg-white">
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
                              className="px-1.5 py-0.5 text-neutral-500 font-black hover:bg-gray-100"
                            >
                              &minus;
                            </button>
                            <span className="px-2 py-0.5 font-bold text-neutral-800">{item.quantity}</span>
                            <button
                              onClick={() => {
                                const copy = [...cart];
                                const match = copy.find((c) => c.id === item.id);
                                if (match) {
                                  match.quantity++;
                                  setCart(copy);
                                }
                              }}
                              className="px-1.5 py-0.5 text-neutral-500 font-black hover:bg-gray-100"
                            >
                              &#43;
                            </button>
                          </div>

                          <button
                            onClick={() => {
                              setCart(cart.filter((c) => c.id !== item.id));
                            }}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Drawer calculations & checkout action */}
              <div className="p-6 border-t border-gray-150 space-y-4 bg-white shrink-0">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">Basket Subtotal</span>
                    <p className="text-[10px] text-gray-450">Excludes shipping zone rates.</p>
                  </div>
                  <span className="text-xl font-black text-neutral-950 font-sans">${subtotalCart.toFixed(2)}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="flex-1 py-3 border border-gray-200 text-gray-600 font-extrabold rounded-xl text-xs hover:bg-gray-50 text-center"
                  >
                    Keep Shopping
                  </button>

                  <button
                    disabled={cart.length === 0}
                    onClick={() => {
                      setIsCartOpen(false);
                      setActiveTab('cart');
                    }}
                    className={`flex-1 py-3 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-transform ${
                      cart.length === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-neutral-950 text-white hover:bg-neutral-850 hover:-translate-y-0.5 active:translate-y-0'
                    }`}
                  >
                    Checkout <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 256-bit Certified Bank Protection
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Dynamic Global Footer */}
      <Footer setActiveTab={setActiveTab} />

    </div>
  );
}
