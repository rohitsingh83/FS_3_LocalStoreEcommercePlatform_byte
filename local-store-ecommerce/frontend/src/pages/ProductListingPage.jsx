import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Sparkles, Filter, RefreshCcw } from 'lucide-react';
import { productsAPI } from '../api/products';
import ProductCard from '../components/product/ProductCard';

const CATEGORIES = [
  { id: 'all', label: 'All Aisles', icon: '🧺' },
  { id: 'produce', label: 'Fresh Produce', icon: '🥬' },
  { id: 'bakery', label: 'Artisan Bakery', icon: '🥖' },
  { id: 'dairy', label: 'Dairy & Eggs', icon: '🥛' },
  { id: 'pantry', label: 'Pantry & Honey', icon: '🍯' },
  { id: 'beverages', label: 'Cold Brew & Cider', icon: '☕' },
];

export default function ProductListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        category: activeCategory,
        search: searchQuery,
        inStock: inStockOnly ? 'true' : undefined,
        sort: sortBy,
      };
      const { data } = await productsAPI.getProducts(params);
      setProducts(data?.data?.products || []);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [activeCategory, inStockOnly, sortBy]);

  const handleCategorySelect = (catId) => {
    if (catId === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ ...Object.fromEntries(searchParams), category: catId });
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="min-h-screen">
      {/* Hero Welcome Banner */}
      <section className="bg-gradient-to-b from-brand-100/60 via-emerald-50/40 to-transparent py-12 px-4 sm:px-6 lg:px-8 border-b border-stone-200/50">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-white text-brand-800 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-sm border border-brand-200/70">
            <Sparkles size={14} className="text-brand-600" />
            <span>Harvested Fresh This Morning</span>
          </div>
          <h1 className="font-serif-display text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Farm-to-Table, Straight to You
          </h1>
          <p className="text-stone-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Support local growers and small-batch artisans. Every item in our store is grown or prepared within 45 miles of our market.
          </p>
        </div>
      </section>

      {/* Main Catalog Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all duration-200 ${
                  isSelected
                    ? 'bg-brand-700 text-white shadow-md shadow-brand-700/20'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200/80 shadow-sm'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search local produce, honey, bread..."
              className="w-full bg-stone-50 border border-stone-200/90 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-stone-400 outline-none focus:border-brand-500 focus:bg-white transition"
            />
          </form>

          {/* Controls: In-Stock Toggle & Sorting */}
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
            {/* In Stock Only Toggle */}
            <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-stone-300"
              />
              <span>In Stock Only</span>
            </label>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={14} className="text-stone-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-700 rounded-xl px-3 py-2 outline-none focus:border-brand-500 cursor-pointer"
              >
                <option value="newest">Featured & Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Count Header */}
        <div className="flex items-center justify-between text-xs text-stone-500 font-medium px-1">
          <span>Showing {products.length} artisanal products</span>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                fetchProducts();
              }}
              className="text-brand-700 hover:underline flex items-center gap-1"
            >
              <RefreshCcw size={11} /> Clear search "{searchQuery}"
            </button>
          )}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-stone-100 p-4 space-y-3 animate-pulse"
              >
                <div className="aspect-[4/3] bg-stone-100 rounded-xl" />
                <div className="h-4 bg-stone-100 rounded w-3/4" />
                <div className="h-3 bg-stone-100 rounded w-1/2" />
                <div className="h-4 bg-stone-100 rounded w-1/4 pt-2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-stone-200/80 p-8 space-y-4">
            <div className="text-4xl">🔍</div>
            <h3 className="font-serif-display text-xl font-bold text-slate-800">
              No products found matching your criteria
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Try adjusting your category filter, clearing your search keywords, or showing out-of-stock items.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setInStockOnly(false);
                handleCategorySelect('all');
              }}
              className="bg-brand-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-brand-700 transition shadow-sm"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
