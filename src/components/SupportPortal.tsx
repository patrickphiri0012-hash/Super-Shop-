import React, { useState } from 'react';
import { HelpCircle, MessageSquare, Phone, Mail, Clock, ShieldCheck, HelpCircle as HelpIcon, FileText, Send, User, ChevronDown, ChevronUp } from 'lucide-react';
import { SupportTicket, ChatMessage, Order, DeliveryZone } from '../types';

interface SupportPortalProps {
  orders: Order[];
  deliveryZones: DeliveryZone[];
  faqs: { q: string; a: string }[];
  ticketsList: SupportTicket[];
  setTicketsList: (tickets: SupportTicket[]) => void;
  user: { name: string; email: string };
}

export default function SupportPortal({
  orders,
  deliveryZones,
  faqs,
  ticketsList,
  setTicketsList,
  user,
}: SupportPortalProps) {
  const [activeFaqIdx, setActiveFaqIdx] = useState<number | null>(null);
  
  // Interactive bot chat states
  const [userChatInput, setUserChatInput] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { sender: 'agent', text: `Hi ${user.name || 'Gourmet Guest'}! Welcome to Supper Shop automated support. How can I help you today? Ask me about 'Active Orders', 'Delivery Areas', 'My Loyalty Points' or 'Refund rules'.`, timestamp: '15:04' }
  ]);
  const [isBotTyping, setIsBotTyping] = useState<boolean>(false);

  // New ticket/contact form fields
  const [ticketSubject, setTicketSubject] = useState<string>('');
  const [ticketCategory, setTicketCategory] = useState<string>('Delivery Issue');
  const [ticketMessage, setTicketMessage] = useState<string>('');
  const [ticketSuccess, setTicketSuccess] = useState<boolean>(false);

  const toggleFaq = (idx: number) => {
    setActiveFaqIdx(activeFaqIdx === idx ? null : idx);
  };

  // Automated chatbot brains! Personalizes based on user active state
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userChatInput.trim()) return;

    const userMsg = userChatInput.trim();
    const cleanTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const nextHistory = [
      ...chatHistory,
      { sender: 'user' as const, text: userMsg, timestamp: cleanTime }
    ];
    setChatHistory(nextHistory);
    setUserChatInput('');
    setIsBotTyping(true);

    // AI Simulated logic timer
    setTimeout(() => {
      let replyText = "I’ve noted your query! A support host will review your request shortly. Is there anything else about our gourmet suppers I can help with?";
      const lower = userMsg.toLowerCase();

      if (lower.includes('order') || lower.includes('track') || lower.includes('invoice')) {
        if (orders.length > 0) {
          const latest = orders[0];
          replyText = `I found your latest active order ${latest.invoiceNumber} for a total of $${latest.total.toFixed(2)}. Its status is currently listed as '${latest.status.toUpperCase()}' with approx delivery ETA listed as ${latest.eta}. Let me know if you would like me to flag this with your driver!`;
        } else {
          replyText = "I looked up your record but couldn't find any placed orders. Head to our storefront tab to place your first online order!";
        }
      } else if (lower.includes('delivery') || lower.includes('suburb') || lower.includes('zone') || lower.includes('area')) {
        const activeRegions = deliveryZones.filter(z => z.isActive).map(z => z.name).join(', ');
        replyText = `We are actively delivering hot suppers & raw organic baskets near you. Our active circles include: ${activeRegions}. Ground rates range from $2.50 to $6.50, and delivery is completely FREE for spent totals exceeding $50.`;
      } else if (lower.includes('points') || lower.includes('loyalty') || lower.includes('rewards') || lower.includes('member')) {
        replyText = "You earn 1 Loyalty point with every dollar spent. Head to 'User Account > Loyalty rewards' inside your member sidebar. There you can instantly exchange your points into checkout coupon codes worth up to $50!";
      } else if (lower.includes('refund') || lower.includes('return') || lower.includes('bad') || lower.includes('cold') || lower.includes('spoiled')) {
        replyText = "We stand premium behind our culinary freshness. If you are not entirely satisfied, raise a contact ticket on this page with a description or photo within 2 hours. Our team will credit your wallet or trigger a complete refund immediately.";
      } else if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey')) {
        replyText = `Hello there! I am your virtual culinary assistant. Feel free to ask me questions regarding your active order status, active delivery areas, refund terms or loyalty program.`;
      }

      setChatHistory([
        ...nextHistory,
        { sender: 'agent' as const, text: replyText, timestamp: cleanTime }
      ]);
      setIsBotTyping(false);
    }, 1300);
  };

  // Submit contact ticket form
  const handleAddNewTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;

    const newTicket: SupportTicket = {
      id: `tkt-${Date.now()}`,
      name: user.name || 'Patrick Phiri',
      email: user.email || 'guest@suppershop.com',
      category: ticketCategory,
      subject: ticketSubject.trim(),
      message: ticketMessage.trim(),
      status: 'Open',
      date: new Date().toISOString().split('T')[0],
      chat: [],
    };

    setTicketsList([newTicket, ...ticketsList]);
    setTicketSubject('');
    setTicketMessage('');
    setTicketSuccess(true);
    setTimeout(() => setTicketSuccess(false), 3000);
  };

  return (
    <div id="support-policies-workspace" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in text-neutral-900">
      
      {/* 1. Header Area */}
      <section className="text-center max-w-xl mx-auto mb-12">
        <span className="p-2 bg-emerald-50 text-emerald-600 rounded-full inline-block text-sm mb-4 font-mono font-bold">● ONLINE SECTOR SUPPORT</span>
        <h2 className="text-3xl font-black tracking-tight">Support Desk & Legal Rules</h2>
        <p className="text-sm text-gray-500 mt-1">Get immediate, personalized chatbot answers regarding orders, view refund terms, or post direct tickets.</p>
      </section>

      {/* Grid columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Chat bot desk & Ticket creator forms */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Chat desk container */}
          <div className="bg-white border border-gray-150 rounded-2xl shadow-xs overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🤖</span>
                <div>
                  <h4 className="text-xs font-bold tracking-tight">Automated Support Assistant</h4>
                  <p className="text-[10px] text-emerald-450">● Live Typing (inspects active orders)</p>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-white/10 px-2.5 py-1 rounded-md">BOT v1.4</span>
            </div>

            {/* Chat list history */}
            <div className="p-4 h-64 overflow-y-auto space-y-4 bg-gray-50/50 scrollbar-thin">
              {chatHistory.map((chat, idx) => (
                <div key={idx} className={`flex gap-2.5 max-w-[85%] text-xs ${chat.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs ${
                    chat.sender === 'user' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-200 text-slate-800 font-bold'
                  }`}>
                    {chat.sender === 'user' ? 'U' : 'A'}
                  </div>
                  <div>
                    <div className={`p-3 rounded-2xl ${
                      chat.sender === 'user' ? 'bg-neutral-900 text-white rounded-tr-none' : 'bg-white text-neutral-900 rounded-tl-none border border-gray-150 shadow-xs'
                    }`}>
                      <p className="leading-relaxed">{chat.text}</p>
                    </div>
                    <span className="text-[9px] text-gray-400 font-bold font-mono tracking-wide mt-1 block ml-2">{chat.timestamp}</span>
                  </div>
                </div>
              ))}
              
              {isBotTyping && (
                <div className="flex gap-2.5 max-w-[80%] text-xs">
                  <div className="w-7 h-7 rounded-full bg-[#e0e1dd] text-neutral-950 flex items-center justify-center font-bold text-sm">A</div>
                  <div className="bg-white text-gray-400 py-2.5 px-4 rounded-xl rounded-tl-none border border-gray-150 shadow-xs italic animate-pulse">
                    Typing answers...
                  </div>
                </div>
              )}
            </div>

            {/* User chat input form */}
            <form onSubmit={handleChatSubmit} className="border-t border-gray-150 p-3 bg-white flex gap-2">
              <input
                type="text"
                placeholder="Ask me about: latest order status, is Downtown active..."
                value={userChatInput}
                onChange={(e) => setUserChatInput(e.target.value)}
                className="w-full text-xs bg-gray-50 p-2.5 outline-hidden rounded-xl border border-gray-250 font-sans"
              />
              <button
                type="submit"
                disabled={isBotTyping || !userChatInput.trim()}
                className="bg-neutral-900 hover:bg-neutral-800 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold text-xs px-4 rounded-xl flex items-center justify-center shrink-0 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Contact ticket creator forms */}
          <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-black text-neutral-900 tracking-tight flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-emerald-600" /> Lodge A Support Ticket Form
              </h3>
              <p className="text-xs text-gray-400 mt-1">If the bot is unable to settle your query, our operations coordinator will review your request manually.</p>
            </div>

            {ticketSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-950 font-bold border border-emerald-100 rounded-xl text-xs">
                Ticket submitted successfully! A manager will reach out inside your email inbox.
              </div>
            )}

            <form onSubmit={handleAddNewTicket} className="space-y-4 text-xs font-sans">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-black text-gray-450 mb-1">Issue Category</label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="w-full bg-gray-50 rounded-xl p-2.5 border border-gray-250"
                  >
                    <option>Delivery Issue</option>
                    <option>Cold Food / Quality Complaint</option>
                    <option>Missing ingredients Basket item</option>
                    <option>Loyalty Point discrepancy</option>
                    <option>Payment / Voucher failure</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-black text-gray-455 mb-1">Subject Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ribeye steak arrived medium well, not rare"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    className="w-full bg-gray-50 rounded-xl p-3 border border-gray-250 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-black text-gray-450 mb-1">Describe Complete Issue</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Provide precise invoice numbers, photo descriptions or context for automatic approvals..."
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  className="w-full bg-gray-50 rounded-xl p-3 border border-gray-250 font-sans"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-neutral-900 border border-neutral-900 text-white font-extrabold rounded-xl hover:bg-neutral-850"
                >
                  Publish Ticket
                </button>
              </div>

            </form>
          </div>

          {/* Submitted tickets archives */}
          {ticketsList.length > 0 && (
            <div className="bg-white border border-gray-150 p-5 rounded-2xl shadow-xs space-y-4">
              <h4 className="text-xs font-mono font-black text-gray-400 uppercase tracking-widest">Your Submitted Tickets Log</h4>
              <div className="space-y-3.5">
                {ticketsList.map((tk) => (
                  <div key={tk.id} className="p-3 bg-gray-50 border border-gray-150 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-neutral-900">{tk.subject}</span>
                        <span className="text-[10px] font-mono text-gray-400">({tk.category})</span>
                      </div>
                      <p className="text-gray-500 mt-1 lines-clamp-1 leading-normal">&ldquo;{tk.message}&rdquo;</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{tk.date}</p>
                    </div>

                    <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-xs shrink-0">
                      {tk.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Expandable FAQ accordions & Legal Policies */}
        <div className="lg:col-span-5 space-y-8 text-xs">
          
          {/* FAQ Accordions */}
          <div className="bg-white border border-gray-150 p-5 rounded-2xl shadow-xs">
            <h3 className="text-base font-black text-neutral-900 tracking-tight flex items-center gap-1.5 mb-4">
              <HelpCircle className="w-4 h-4 text-emerald-600" /> Knowledge Base Accordion FAQs
            </h3>

            <div className="divide-y divide-gray-150">
              {faqs.map((faq, idx) => {
                const isOpen = activeFaqIdx === idx;
                return (
                  <div key={idx} className="py-3">
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex justify-between items-center text-left font-bold text-neutral-800 transition-colors focus:outline-hidden"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {isOpen && (
                      <p className="mt-2 text-gray-500 leading-relaxed transition-all">
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legal Rules Terms & Returns */}
          <div className="bg-white border border-gray-150 p-5 rounded-2xl shadow-xs space-y-4">
            <h3 className="text-base font-black text-neutral-900 tracking-tight flex items-center gap-1.5 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Consumer Safety & Refund Guarantees
            </h3>

            <div className="space-y-4 leading-relaxed text-gray-550 font-sans">
              <div>
                <h5 className="font-bold text-neutral-850 flex items-center gap-1">
                  🛡 2-Hour Gourmet Freshness Mandate
                </h5>
                <p className="mt-1">
                  Because organic produce and prepped dinners are temperature sensitive, customers must inspect baskets on dispatch. If any leaf, cut, or cheese boasts damage, lodge a ticket within 2 hours. Approved returns are auto-credited instantly back into your payment card wallet!
                </p>
              </div>

              <div>
                <h5 className="font-bold text-neutral-850 flex items-center gap-1">
                  🚲 Metropolitan Zero-Delay Terms
                </h5>
                <p className="mt-1">
                  While our micro-fulfillment centers strive for under-35 minute delivery across Downtown and pinewood suburbs, heavy rain, logistics, or custom kitchen preparation cues can expand ETA. Delayed orders above 15 minutes are credited with a $5.00 voucher manually.
                </p>
              </div>

              <div className="bg-neutral-50 p-3.5 rounded-xl border border-gray-150 text-[11px] text-gray-450 font-mono">
                <p className="font-bold uppercase text-neutral-800 mb-1">Company Headquarters</p>
                <p>Supper Shop Marketplace, LLC</p>
                <p>Industrial Suite 40B, Sunset Harbour, US</p>
                <p className="mt-1">E: concierge@suppershop.com</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
