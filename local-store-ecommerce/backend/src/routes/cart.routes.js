'use strict';

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const {
  addItemValidator,
  updateItemValidator,
  removeItemValidator,
} = require('../validators/cart.validator');

router.get('/', cartController.getCart);
router.post('/items', addItemValidator, cartController.addItem);
router.patch('/items/:productId', updateItemValidator, cartController.updateQuantity);
router.delete('/items/:productId', removeItemValidator, cartController.removeItem);
router.delete('/', cartController.clearCart);

module.exports = router;
