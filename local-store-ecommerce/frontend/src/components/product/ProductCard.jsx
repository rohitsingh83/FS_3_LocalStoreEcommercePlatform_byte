import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ShoppingBag, Check } from 'lucide-react';
import StockBadge from './StockBadge';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isOutOfStock = product.stock <= 0;

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || adding) return;

    setAdding(true);
    const success = await addToCart(product, 1);
    setAdding(false);

    if (success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1500);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-stone-200/80 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image Container with Badges */}
      <Link to={`/products/${product._id}`} className="relative block aspect-[4/3] overflow-hidden bg-stone-100">
        <img
          src={product.imageUrl}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {product.badge && (
            <span className="bg-slate-900/90 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              {product.badge}
            </span>
          )}
          {product.isOrganic && (
            <span className="bg-emerald-600/90 backdrop-blur-sm text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              100% Organic
            </span>
          )}
        </div>

        {/* Stock Badge Overlay */}
        <div className="absolute bottom-3 left-3">
          <StockBadge stock={product.stock} stockStatus={product.stockStatus} />
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium mb-1.5 uppercase tracking-wider">
            <span>{product.category}</span>
            <span>{product.unit}</span>
          </div>

          <Link to={`/products/${product._id}`}>
            <h3 className="font-serif-display text-lg font-bold text-slate-900 group-hover:text-brand-700 transition-colors line-clamp-1 mb-1">
              {product.title}
            </h3>
          </Link>

          <p className="text-xs text-stone-500 italic mb-2">
            From {product.origin}
          </p>

          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4">
            {product.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-xs text-stone-400 block font-medium -mb-1">Price</span>
            <span className="text-xl font-extrabold text-slate-900">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock || adding}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm ${
              isOutOfStock
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
                : justAdded
                ? 'bg-emerald-700 text-white'
                : 'bg-brand-600 hover:bg-brand-700 text-white hover:shadow-md active:scale-95'
            }`}
            aria-label={`Add ${product.title} to cart`}
          >
            {justAdded ? (
              <>
                <Check size={14} className="stroke-[3]" />
                <span>Added!</span>
              </>
            ) : adding ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isOutOfStock ? (
              <span>Sold Out</span>
            ) : (
              <>
                <Plus size={15} className="stroke-[2.5]" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
