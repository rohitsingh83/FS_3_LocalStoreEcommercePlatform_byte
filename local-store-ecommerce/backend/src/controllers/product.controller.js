'use strict';

const mongoose = require('mongoose');
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');

// @desc    Get all products with filtering, search, and sorting
// @route   GET /api/v1/products
// @access  Public
exports.getAllProducts = async (req, res, next) => {
  try {
    const { category, search, inStock, sort } = req.query;
    const filter = {};

    // Filter by Category
    if (category && category !== 'all') {
      filter.category = category.toLowerCase().trim();
    }

    // Filter by Stock Status
    if (inStock === 'true') {
      filter.stock = { $gt: 0 };
    }

    // Search query across title, description, and origin
    if (search && search.trim().length > 0) {
      const q = search.trim();
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { origin: { $regex: q, $options: 'i' } },
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'name_asc') sortOption = { title: 1 };
    else if (sort === 'stock_desc') sortOption = { stock: -1 };

    const products = await Product.find(filter).sort(sortOption);

    res.status(200).json({
      status: 'success',
      results: products.length,
      data: { products },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get individual product detail by ID or slug
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product;

    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id);
    } else {
      product = await Product.findOne({ slug: id.toLowerCase().trim() });
    }

    if (!product) {
      return next(new ApiError(404, `Product not found with identifier '${id}'`));
    }

    res.status(200).json({
      status: 'success',
      data: { product },
    });
  } catch (err) {
    next(err);
  }
};
