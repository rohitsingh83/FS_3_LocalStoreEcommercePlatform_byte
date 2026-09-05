import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { cartAPI } from '../api/cart';

const CartContext = createContext();

const LOCAL_CART_CACHE_KEY = 'local_store_cart_cache';

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const cached = localStorage.getItem(LOCAL_CART_CACHE_KEY);
      return cached ? JSON.parse(cached) : { items: [], subtotal: 0, totalItems: 0 };
    } catch {
      return { items: [], subtotal: 0, totalItems: 0 };
    }
  });
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Sync to local cache
  const updateCartState = useCallback((newCart) => {
    setCart(newCart);
    try {
      localStorage.setItem(LOCAL_CART_CACHE_KEY, JSON.stringify(newCart));
    } catch (e) {
      console.warn('Failed to cache cart locally:', e);
    }
  }, []);

  // Fetch initial cart from server
  const refreshCart = useCallback(async () => {
    try {
      const { data } = await cartAPI.getCart();
      if (data?.data?.cart) {
        updateCartState(data.data.cart);
      }
    } catch (err) {
      console.warn('[Cart] Server refresh deferred:', err.message);
    }
  }, [updateCartState]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // Add Item to Cart with Input Validation & Immediate Feedback
  const addToCart = async (product, quantity = 1) => {
    const qty = parseInt(quantity, 10);

    // Validation 1: Positive Integer
    if (isNaN(qty) || qty <= 0) {
      toast.error('Please enter a valid quantity of 1 or more.');
      return false;
    }

    // Validation 2: Out of Stock Check
    if (product.stock <= 0) {
      toast.error(`Sorry, "${product.title}" is currently out of stock!`);
      return false;
    }

    // Validation 3: Current in-cart count + new quantity vs product.stock
    const existing = cart.items?.find(
      (i) => i.product?._id === product._id || i.product === product._id
    );
    const existingQty = existing ? existing.quantity : 0;
    const projectedTotal = existingQty + qty;

    if (projectedTotal > product.stock) {
      toast.error(
        `Only ${product.stock} available in stock. You already have ${existingQty} in your cart.`
      );
      return false;
    }

    setLoading(true);
    try {
      const { data } = await cartAPI.addItem(product._id, qty);
      if (data?.data?.cart) {
        updateCartState(data.data.cart);
      }
      toast.success(`Added ${qty} × "${product.title}" to cart! 🛒`, {
        icon: '🌿',
        style: {
          borderRadius: '12px',
          background: '#052e16',
          color: '#fff',
        },
      });
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add item to cart';
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update Item Quantity
  const updateQuantity = async (productId, newQuantity, productMaxStock) => {
    const qty = parseInt(newQuantity, 10);

    if (isNaN(qty)) return false;

    // Check ceiling
    if (productMaxStock && qty > productMaxStock) {
      toast.error(`Maximum available stock for this item is ${productMaxStock}.`);
      return false;
    }

    setLoading(true);
    try {
      const { data } = await cartAPI.updateQuantity(productId, qty);
      if (data?.data?.cart) {
        updateCartState(data.data.cart);
      }
      if (qty <= 0) {
        toast('Item removed from cart', { icon: '🗑️' });
      }
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update quantity';
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove Item
  const removeItem = async (productId, itemTitle = '') => {
    setLoading(true);
    try {
      const { data } = await cartAPI.removeItem(productId);
      if (data?.data?.cart) {
        updateCartState(data.data.cart);
      }
      toast(`${itemTitle ? `"${itemTitle}"` : 'Item'} removed from cart`, {
        icon: '🗑️',
      });
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to remove item';
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Clear Entire Cart
  const clearCart = async () => {
    setLoading(true);
    try {
      await cartAPI.clearCart();
      updateCartState({ items: [], subtotal: 0, totalItems: 0 });
      toast.success('Cart cleared');
      return true;
    } catch (err) {
      toast.error('Failed to clear cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        isDrawerOpen,
        setIsDrawerOpen,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
