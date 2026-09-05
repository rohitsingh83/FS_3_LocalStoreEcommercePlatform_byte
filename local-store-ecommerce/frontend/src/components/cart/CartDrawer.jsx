import React, { useState } from 'react';
import { X, ShoppingBag, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import CartItem from './CartItem';
import toast from 'react-hot-toast';

export default function CartDrawer() {
  const { cart, isDrawerOpen, setIsDrawerOpen, clearCart } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  if (!isDrawerOpen) return null;

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const deliveryThreshold = 35;
  const isFreeDelivery = subtotal >= deliveryThreshold;
  const deliveryFee = subtotal === 0 ? 0 : isFreeDelivery ? 0 : 4.99;
  const estimatedTax = parseFloat((subtotal * 0.08).toFixed(2));
  const orderTotal = (subtotal + deliveryFee + estimatedTax).toFixed(2);
  const progressToFree = Math.min(100, Math.round((subtotal / deliveryThreshold) * 100));

  const handleCheckout = () => {
    setCheckingOut(true);
    setTimeout(() => {
      setCheckingOut(false);
      setOrderComplete(true);
      clearCart();
      toast.success('Order placed successfully! We will prepare your local basket.', {
        duration: 4000,
        icon: '🎉',
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={() => setIsDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-slide-left">
          {/* Drawer Header */}
          <div className="p-5 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="text-brand-700" size={20} />
              <h2 className="font-serif-display text-lg font-bold text-slate-900">
                Your Market Basket
              </h2>
              <span className="bg-brand-100 text-brand-800 text-xs font-bold px-2 py-0.5 rounded-full">
                {cart?.totalItems || 0}
              </span>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition"
              aria-label="Close cart drawer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Free Delivery Bar */}
          {items.length > 0 && (
            <div className="bg-brand-50/80 px-5 py-3 border-b border-brand-100">
              <div className="flex items-center justify-between text-xs font-semibold text-brand-900 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Sparkles size={13} className="text-brand-600" />
                  {isFreeDelivery ? (
                    <span className="text-brand-800">You unlocked Free Local Delivery! 🎉</span>
                  ) : (
                    <span>Add ${(deliveryThreshold - subtotal).toFixed(2)} more for Free Delivery</span>
                  )}
                </span>
                <span>{progressToFree}%</span>
              </div>
              <div className="w-full bg-brand-200/60 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-brand-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressToFree}%` }}
                />
              </div>
            </div>
          )}

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5">
            {orderComplete ? (
              <div className="text-center py-16 px-4 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="font-serif-display text-xl font-bold text-slate-900">
                  Thank You for Supporting Local!
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed max-w-xs mx-auto">
                  Your order has been sent to our local packing station. You will receive an SMS when your items are packed.
                </p>
                <button
                  onClick={() => {
                    setOrderComplete(false);
                    setIsDrawerOpen(false);
                  }}
                  className="mt-4 inline-flex items-center gap-2 bg-brand-600 text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-brand-700 transition"
                >
                  Continue Shopping
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-20 px-4 space-y-4">
                <div className="w-16 h-16 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center mx-auto text-2xl">
                  🛒
                </div>
                <h3 className="font-serif-display text-lg font-bold text-slate-900">
                  Your basket is empty
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Explore fresh farm produce, oven-warm artisan sourdough, and local pantry favorites.
                </p>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-sm"
                >
                  <span>Browse Products</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {items.map((item) => (
                  <CartItem key={item.product?._id || item.product} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && !orderComplete && (
            <div className="p-5 border-t border-stone-100 bg-stone-50/50 space-y-3">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-800">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Local Delivery</span>
                  <span>{isFreeDelivery ? <strong className="text-brand-700">FREE</strong> : `$${deliveryFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span>${estimatedTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-stone-200">
                  <span>Estimated Total</span>
                  <span>${orderTotal}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="w-full bg-brand-600 hover:bg-brand-700 active:scale-[0.99] text-white py-3.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
              >
                {checkingOut ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <span>Checkout · ${orderTotal}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                <span>Direct farm dispatch</span>
                <button
                  onClick={clearCart}
                  className="text-stone-400 hover:text-red-600 underline transition"
                >
                  Clear basket
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
