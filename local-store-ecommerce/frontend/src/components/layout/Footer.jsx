import React from 'react';
import { Heart, MapPin, Phone, Clock, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white">
              <span className="text-2xl">🌿</span>
              <span className="font-serif-display text-xl font-bold">GreenLeaf</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your neighborhood local grocery supporting over 30 independent regional family farms and small-batch food crafters.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Shop Categories</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/?category=produce" className="hover:text-brand-400 transition-colors">Seasonal Produce</a></li>
              <li><a href="/?category=bakery" className="hover:text-brand-400 transition-colors">Artisanal Bakery</a></li>
              <li><a href="/?category=dairy" className="hover:text-brand-400 transition-colors">Pasture Dairy</a></li>
              <li><a href="/?category=pantry" className="hover:text-brand-400 transition-colors">Heritage Pantry</a></li>
              <li><a href="/?category=beverages" className="hover:text-brand-400 transition-colors">Cold Brew & Cider</a></li>
            </ul>
          </div>

          {/* Store Hours & Location */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Store & Pickup</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-brand-400 shrink-0 mt-0.5" />
                <span>428 Orchard Valley Way, Suite 100</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={14} className="text-brand-400 shrink-0" />
                <span>Mon–Sat: 7:30 AM – 8:00 PM</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-brand-400 shrink-0" />
                <span>(555) 328-9410</span>
              </li>
            </ul>
          </div>

          {/* Guarantee */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">100% Quality Promise</h4>
            <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/50 space-y-2">
              <div className="flex items-center gap-2 text-brand-300 text-xs font-semibold">
                <ShieldCheck size={16} />
                <span>Freshness Guaranteed</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                If anything you receive isn't peak quality, let us know within 24 hours for a no-questions-asked refund or replacement.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} GreenLeaf Artisan Market. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Fresh local food crafted with <Heart size={12} className="text-red-400 fill-red-400" /> for the community.
          </p>
        </div>
      </div>
    </footer>
  );
}
