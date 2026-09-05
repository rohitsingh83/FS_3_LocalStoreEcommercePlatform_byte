import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CartDrawer from './components/cart/CartDrawer';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailPage from './pages/ProductDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-[#fcfbf9] text-slate-900 selection:bg-brand-200">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: '16px',
                padding: '12px 16px',
                fontSize: '13px',
                fontWeight: '600',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
              },
            }}
          />
          <Navbar />
          <CartDrawer />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<ProductListingPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}
