import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Plus, Minus, Check, MapPin, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { productsAPI } from '../api/products';
import StockBadge from '../components/product/StockBadge';
import { useCart } from '../context/CartContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart, setIsDrawerOpen } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await productsAPI.getProduct(id);
        setProduct(data?.data?.product);
      } catch (err) {
        setError(err.response?.data?.message || 'Product could not be found.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
          <div className="aspect-[4/3] bg-stone-100 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-6 bg-stone-100 rounded w-1/4" />
            <div className="h-8 bg-stone-100 rounded w-3/4" />
            <div className="h-5 bg-stone-100 rounded w-1/2" />
            <div className="h-24 bg-stone-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="text-4xl">🍃</div>
        <h2 className="font-serif-display text-2xl font-bold text-slate-800">
          Product Not Found
        </h2>
        <p className="text-xs text-stone-500">
          {error || 'This product might have been unlisted or the URL is incorrect.'}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-brand-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-brand-800 transition"
        >
          <ArrowLeft size={14} />
          <span>Back to Market Catalog</span>
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const inCartItem = cart?.items?.find(
    (i) => i.product?._id === product._id || i.product === product._id
  );
  const inCartQuantity = inCartItem ? inCartItem.quantity : 0;
  const remainingStock = Math.max(0, product.stock - inCartQuantity);

  const handleIncrement = () => {
    if (quantity < remainingStock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    if (isOutOfStock || adding) return;

    setAdding(true);
    const success = await addToCart(product, quantity);
    setAdding(false);

    if (success) {
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-brand-800 transition"
      >
        <ArrowLeft size={14} />
        <span>Back to Marketplace</span>
      </button>

      {/* Main Grid Detail */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-card p-6 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
        {/* Left: Product Image & Badges */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 border border-stone-100 shadow-inner">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
            {product.badge && (
              <span className="bg-slate-900/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                {product.badge}
              </span>
            )}
            {product.isOrganic && (
              <span className="bg-emerald-700 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                <Sparkles size={12} />
                <span>100% Certified Organic</span>
              </span>
            )}
          </div>
        </div>

        {/* Right: Product Info & Actions */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category & Origin */}
            <div className="flex items-center justify-between text-xs font-semibold text-stone-500 uppercase tracking-wider">
              <span>{product.category}</span>
              <StockBadge stock={product.stock} stockStatus={product.stockStatus} />
            </div>

            {/* Title */}
            <h1 className="font-serif-display text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              {product.title}
            </h1>

            {/* Farm Origin Tag */}
            <div className="inline-flex items-center gap-1.5 text-xs text-brand-900 bg-brand-50 border border-brand-200/60 px-3 py-1.5 rounded-xl font-medium">
              <MapPin size={13} className="text-brand-600 shrink-0" />
              <span>Grown & Harvested at: <strong>{product.origin}</strong></span>
            </div>

            {/* Price & Unit */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl font-extrabold text-slate-900">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-xs text-stone-500 font-medium">
                / {product.unit}
              </span>
            </div>

            {/* Description */}
            <div className="pt-2 border-t border-stone-100 text-sm text-stone-700 leading-relaxed space-y-3">
              <p>{product.description}</p>
            </div>

            {/* In-cart status reminder */}
            {inCartQuantity > 0 && (
              <div className="text-xs bg-stone-50 border border-stone-200/70 text-stone-600 px-3 py-2 rounded-xl flex items-center justify-between">
                <span>Currently in your basket:</span>
                <strong className="text-slate-900">{inCartQuantity} {product.unit}</strong>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            {isOutOfStock ? (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-center text-xs font-semibold text-rose-800 space-y-1">
                <p>This artisanal item is currently sold out today.</p>
                <p className="text-[11px] text-rose-600 font-normal">Next harvest delivery expected tomorrow morning at 8:00 AM.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  {/* Quantity Selector */}
                  <div className="flex items-center border-2 border-stone-200 rounded-2xl bg-stone-50 overflow-hidden shadow-inner">
                    <button
                      onClick={handleDecrement}
                      disabled={quantity <= 1}
                      className="p-3 hover:bg-stone-200/70 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={15} />
                    </button>
                    <span className="px-5 font-bold text-sm text-slate-900 min-w-[36px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={handleIncrement}
                      disabled={quantity >= remainingStock}
                      className="p-3 hover:bg-stone-200/70 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
                      aria-label="Increase quantity"
                    >
                      <Plus size={15} />
                    </button>
                  </div>

                  {/* Add to Basket Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={adding || remainingStock <= 0}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-bold text-sm shadow-md transition-all active:scale-[0.99] ${
                      addedSuccess
                        ? 'bg-emerald-700 text-white'
                        : remainingStock <= 0
                        ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                        : 'bg-brand-600 hover:bg-brand-700 text-white hover:shadow-lg'
                    }`}
                  >
                    {addedSuccess ? (
                      <>
                        <Check size={18} className="stroke-[3]" />
                        <span>Added to Basket!</span>
                      </>
                    ) : adding ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : remainingStock <= 0 ? (
                      <span>Stock Limit Reached</span>
                    ) : (
                      <>
                        <ShoppingBag size={18} />
                        <span>Add to Basket · ${(product.price * quantity).toFixed(2)}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Stock Notice */}
                {remainingStock < product.stock && remainingStock > 0 && (
                  <p className="text-[11px] text-amber-700 font-medium text-center">
                    Only {remainingStock} more available to add to your order.
                  </p>
                )}
              </div>
            )}

            {/* Value Props */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] text-stone-500 font-medium">
              <div className="flex items-center gap-1.5">
                <Truck size={14} className="text-brand-600 shrink-0" />
                <span>Next-day local morning delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-brand-600 shrink-0" />
                <span>100% farm freshness guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
