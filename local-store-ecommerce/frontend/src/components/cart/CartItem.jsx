import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();
  const product = item.product;

  if (!product) return null;

  const itemTotal = (item.quantity * item.price).toFixed(2);
  const maxStock = product.stock;

  const handleIncrement = () => {
    if (item.quantity >= maxStock) return;
    updateQuantity(product._id, item.quantity + 1, maxStock);
  };

  const handleDecrement = () => {
    updateQuantity(product._id, item.quantity - 1, maxStock);
  };

  return (
    <div className="flex gap-4 py-4 border-b border-stone-100 last:border-0 items-center">
      {/* Thumbnail */}
      <img
        src={product.imageUrl}
        alt={product.title}
        className="w-16 h-16 rounded-xl object-cover bg-stone-100 shrink-0 border border-stone-200/60"
      />

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm text-slate-900 truncate">
          {product.title}
        </h4>
        <p className="text-xs text-stone-500 mb-2">
          ${item.price.toFixed(2)} / {product.unit || 'unit'}
        </p>

        {/* Quantity Selector & Remove */}
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50 overflow-hidden">
            <button
              onClick={handleDecrement}
              className="p-1.5 hover:bg-stone-200/70 text-slate-700 transition"
              aria-label="Decrease quantity"
            >
              <Minus size={12} />
            </button>
            <span className="px-3 text-xs font-bold text-slate-800 min-w-[24px] text-center">
              {item.quantity}
            </span>
            <button
              onClick={handleIncrement}
              disabled={item.quantity >= maxStock}
              className="p-1.5 hover:bg-stone-200/70 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
              aria-label="Increase quantity"
            >
              <Plus size={12} />
            </button>
          </div>

          <button
            onClick={() => removeItem(product._id, product.title)}
            className="text-stone-400 hover:text-red-600 transition p-1"
            title="Remove item"
            aria-label="Remove item"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Line Total */}
      <div className="text-right shrink-0">
        <span className="font-bold text-sm text-slate-900 block">
          ${itemTotal}
        </span>
        {item.quantity >= maxStock && (
          <span className="text-[10px] text-amber-700 font-semibold block">
            Max stock
          </span>
        )}
      </div>
    </div>
  );
}
