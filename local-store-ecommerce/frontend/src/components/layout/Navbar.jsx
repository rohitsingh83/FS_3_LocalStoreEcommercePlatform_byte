import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Sparkles, MapPin } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const { cart, setIsDrawerOpen } = useCart();
  const itemCount = cart?.totalItems || 0;

  return (
    <header className="sticky top-0 z-40 w-full glass-nav border-b border-stone-200/80 transition-all">
      {/* Top micro-banner */}
      <div className="bg-brand-900 text-brand-100 text-[11px] font-medium tracking-wide py-1.5 px-4 text-center flex items-center justify-center gap-2">
        <Sparkles size={13} className="text-brand-300" />
        <span>Farm-to-Door Local Delivery · Free on orders over $35</span>
        <span className="hidden sm:inline text-brand-400/60">|</span>
        <span className="hidden sm:inline flex items-center gap-1 text-brand-200">
          <MapPin size={11} /> Valley Springs & Surrounding Neighborhoods
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-700 via-brand-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-brand-700/20 group-hover:scale-105 transition-transform duration-300">
            <span className="text-xl">🌿</span>
          </div>
          <div>
            <span className="font-serif-display text-2xl font-bold tracking-tight text-slate-900 group-hover:text-brand-800 transition-colors">
              GreenLeaf
            </span>
            <span className="block text-[10px] uppercase font-bold tracking-widest text-brand-700 -mt-1">
              Artisan Market
            </span>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700">
          <Link to="/" className="hover:text-brand-700 transition-colors">
            All Products
          </Link>
          <Link to="/?category=produce" className="hover:text-brand-700 transition-colors">
            Fresh Produce
          </Link>
          <Link to="/?category=bakery" className="hover:text-brand-700 transition-colors">
            Bakery
          </Link>
          <Link to="/?category=dairy" className="hover:text-brand-700 transition-colors">
            Dairy & Eggs
          </Link>
          <Link to="/?category=pantry" className="hover:text-brand-700 transition-colors">
            Pantry & Honey
          </Link>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Cart Button with Dynamic Animated Counter Badge */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="relative flex items-center gap-2.5 bg-brand-50 hover:bg-brand-100/80 border border-brand-200/80 text-brand-900 px-4 py-2.5 rounded-full font-semibold text-sm shadow-sm hover:shadow transition-all duration-200 active:scale-95 group"
            aria-label="View shopping cart"
          >
            <ShoppingBag size={18} className="text-brand-700 group-hover:rotate-6 transition-transform" />
            <span className="hidden sm:inline">Cart</span>
            {itemCount > 0 && (
              <span className="bg-brand-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center -ml-1 animate-pulse">
                {itemCount}
              </span>
            )}
            {cart?.subtotal > 0 && (
              <span className="hidden lg:inline text-xs font-bold text-brand-800 pl-1 border-l border-brand-200">
                ${cart.subtotal.toFixed(2)}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
