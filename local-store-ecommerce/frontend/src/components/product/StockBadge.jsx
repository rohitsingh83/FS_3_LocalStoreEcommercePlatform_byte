import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export default function StockBadge({ stock = 0, stockStatus, size = 'sm' }) {
  const status = stockStatus || (stock <= 0 ? 'out_of_stock' : stock <= 5 ? 'low_stock' : 'in_stock');

  if (status === 'out_of_stock') {
    return (
      <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200/80 px-2.5 py-1 rounded-full text-xs font-semibold">
        <XCircle size={13} className="text-rose-500" />
        <span>Out of Stock</span>
      </span>
    );
  }

  if (status === 'low_stock') {
    return (
      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200/80 px-2.5 py-1 rounded-full text-xs font-semibold animate-pulse">
        <AlertTriangle size={13} className="text-amber-600" />
        <span>Only {stock} Left!</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2.5 py-1 rounded-full text-xs font-semibold">
      <CheckCircle2 size={13} className="text-emerald-600" />
      <span>In Stock ({stock})</span>
    </span>
  );
}
