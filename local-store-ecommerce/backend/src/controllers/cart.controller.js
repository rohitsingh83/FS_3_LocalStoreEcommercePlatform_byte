'use strict';

const Cart = require('../models/Cart');
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');

// Helper to find or create cart and populate items
const getOrCreateCart = async (sessionId) => {
  let cart = await Cart.findOne({ sessionId }).populate('items.product');
  if (!cart) {
    cart = await Cart.create({ sessionId, items: [] });
  }
  return cart;
};

// @desc    Get session cart
// @route   GET /api/v1/cart
// @access  Public (Session-based)
exports.getCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.sessionId);
    res.status(200).json({
      status: 'success',
      data: { cart },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add item to session cart
// @route   POST /api/v1/cart/items
// @access  Public (Session-based)
exports.addItem = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const addQty = parseInt(quantity, 10);

    // 1. Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return next(new ApiError(404, 'Product not found'));
    }

    // 2. Validate stock availability (Prevent out-of-stock additions)
    if (product.stock <= 0) {
      return next(
        new ApiError(400, `"${product.title}" is currently out of stock and cannot be added.`)
      );
    }

    // 3. Retrieve or create cart
    let cart = await Cart.findOne({ sessionId: req.sessionId });
    if (!cart) {
      cart = new Cart({ sessionId: req.sessionId, items: [] });
    }

    // 4. Check if item already exists in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    let finalQuantity = addQty;
    if (itemIndex > -1) {
      finalQuantity = cart.items[itemIndex].quantity + addQty;
    }

    // 5. Enforce stock ceiling
    if (finalQuantity > product.stock) {
      return next(
        new ApiError(
          400,
          `Cannot add ${addQty} more. You would have ${finalQuantity} in your cart, but only ${product.stock} are in stock.`
        )
      );
    }

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = finalQuantity;
      cart.items[itemIndex].price = product.price; // sync with current price
    } else {
      cart.items.push({
        product: product._id,
        quantity: finalQuantity,
        price: product.price,
      });
    }

    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({
      status: 'success',
      message: `Added "${product.title}" to cart`,
      data: { cart },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update item quantity in cart
// @route   PATCH /api/v1/cart/items/:productId
// @access  Public (Session-based)
exports.updateQuantity = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const newQty = parseInt(quantity, 10);

    const cart = await Cart.findOne({ sessionId: req.sessionId });
    if (!cart) {
      return next(new ApiError(404, 'Cart not found for this session'));
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return next(new ApiError(404, 'Item not found in cart'));
    }

    // If quantity is 0 or less, remove item
    if (newQty <= 0) {
      cart.items.splice(itemIndex, 1);
      await cart.save();
      await cart.populate('items.product');
      return res.status(200).json({
        status: 'success',
        message: 'Item removed from cart',
        data: { cart },
      });
    }

    // Verify stock limits
    const product = await Product.findById(productId);
    if (!product) {
      return next(new ApiError(404, 'Product not found'));
    }

    if (newQty > product.stock) {
      return next(
        new ApiError(
          400,
          `Cannot set quantity to ${newQty}. Only ${product.stock} items are available in stock.`
        )
      );
    }

    cart.items[itemIndex].quantity = newQty;
    cart.items[itemIndex].price = product.price;
    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({
      status: 'success',
      message: 'Cart updated',
      data: { cart },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove individual item from cart
// @route   DELETE /api/v1/cart/items/:productId
// @access  Public (Session-based)
exports.removeItem = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ sessionId: req.sessionId });
    if (!cart) {
      return next(new ApiError(404, 'Cart not found'));
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    if (cart.items.length === initialLength) {
      return next(new ApiError(404, 'Item not found in cart'));
    }

    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({
      status: 'success',
      message: 'Item removed from cart',
      data: { cart },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/v1/cart
// @access  Public (Session-based)
exports.clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ sessionId: req.sessionId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.status(200).json({
      status: 'success',
      message: 'Cart cleared successfully',
      data: { cart: cart || { sessionId: req.sessionId, items: [], subtotal: 0, totalItems: 0 } },
    });
  } catch (err) {
    next(err);
  }
};
