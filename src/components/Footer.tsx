import React, { useState } from 'react';
import { Mail, Phone, MapPin, ShieldCheck, HelpCircle, Heart, Utensils } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: 'storefront' | 'cart' | 'account' | 'admin' | 'support') => void;
}

export default function Footer({ setActiveTab }: FooterProps) {
  const [emailInput, setEmailInput] = useState<string>('');
  const [subscribedMsg, setSubscribedMsg] = useState<string>('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setSubscribedMsg(`Thank you! &ldquo;${emailInput}&rdquo; has been registered for weekly gourmet chef discount newsletters.`);
    setEmailInput('');
  };

  return (
    <footer id="global-footer" className="bg-[#111827] text-white border-t border-neutral-800">
      
      {/* 1. Newsletter Form Subscription area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-neutral-800">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="max-w-md">
            <h4 className="text-lg font-extrabold tracking-tight">Subscribe to Chef’s Suppers Newsletter</h4>
            <p className="text-xs text-gray-400 mt-1">Get exclusive discount vouchers, early access to dry-aged steaks, and healthy kitchen recipes weekly.</p>
          </div>

          <div className="w-full max-w-sm">
            <form onSubmit={handleSubscribe} className="flex gap-2 text-xs">
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 placeholder-gray-500 focus:outline-hidden text-white"
              />
              <button
                type="submit"
                className="bg-amber-500 text-neutral-950 font-black px-5 rounded-xl hover:bg-amber-400 transition-colors shrink-0"
              >
                Join List
              </button>
            </form>
            {subscribedMsg && (
              <p className="text-[11px] text-amber-400 mt-2 font-medium font-sans leading-relaxed">
                {subscribedMsg}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 2. Core links lists */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs font-sans text-gray-400 leading-normal">
        
        {/* Brand details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-neutral-900 text-amber-500 rounded-xl">
              <Utensils className="w-4.5 h-4.5" />
            </div>
            <h5 className="text-[13px] font-black tracking-tight text-white">Supper Shop</h5>
          </div>
          <p className="leading-relaxed">
            Metropolitan’s leading micro-zoned digital marketplace delivering A5 Wagyu meats, woodfired pizzas, raw organic vegetables, and chef-curated hot suppers directly.
          </p>
          <div className="flex text-amber-400 text-[10px] font-black uppercase tracking-wider items-center gap-2">
            <span>🟢 All Systems Active</span>
            <span>•</span>
            <span>Grade-A Sourced</span>
          </div>
        </div>

        {/* Categories explore */}
        <div className="space-y-3">
          <h5 className="text-sm font-extrabold text-white">Core Food Catalogs</h5>
          <ul className="space-y-2">
            {['Gourmet Suppers', 'Italian Specials', 'Healthy & Fresh', 'Fresh Groceries', 'Desserts & Sweets', 'Drinks & Elixirs'].map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => {
                    setActiveTab('storefront');
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left focus:outline-hidden"
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Support links */}
        <div className="space-y-3">
          <h5 className="text-sm font-extrabold text-white">Customer Support Desk</h5>
          <ul className="space-y-2">
            <li>
              <button onClick={() => setActiveTab('support')} className="hover:text-white transition-colors cursor-pointer">
                Lodge Support Ticket
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('support')} className="hover:text-white transition-colors cursor-pointer">
                Interactive Bot Chat
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('support')} className="hover:text-white transition-colors cursor-pointer">
                Knowledge Base FAQs
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('support')} className="hover:text-white transition-colors cursor-pointer">
                Returns & Refund Policy
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('account')} className="hover:text-white transition-colors cursor-pointer">
                Live Rider GPS Map
              </button>
            </li>
          </ul>
        </div>

        {/* Contact credentials */}
        <div className="space-y-3.5">
          <h5 className="text-sm font-extrabold text-white">Direct Connect Concierge</h5>
          <div className="space-y-2.5">
            <p className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-neutral-500" />
              <span>Suite 900, Sunset Harbour Marketplace, US</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-neutral-500" />
              <span>+1 (555) SUPPER-732</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-neutral-500" />
              <span>concierge@suppershop.com</span>
            </p>
          </div>
        </div>

      </div>

      {/* 3. Safety Badges Copyright bar */}
      <div className="bg-[#0b0f19] py-6 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-4">
          <p>© 2026 Supper Shop Corporation Inc. All privileges and gourmet recipes reserved.</p>
          
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> USDA Grade-A Inspected
            </span>
            <span>•</span>
            <span>HACCP Food Safety Certified</span>
          </div>
        </div>
      </div>

    </footer>
  );
}
