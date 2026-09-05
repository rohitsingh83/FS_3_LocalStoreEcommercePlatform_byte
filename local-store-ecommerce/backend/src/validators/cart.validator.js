'use strict';

const { body, param, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');

const validate = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorList = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));
    return next(new ApiError(400, errorList[0].message, errorList));
  }
  next();
};

const addItemValidator = [
  body('productId')
    .notEmpty().withMessage('Product ID is required')
    .custom((val) => mongoose.Types.ObjectId.isValid(val)).withMessage('Invalid Product ID format'),
  body('quantity')
    .optional()
    .isInt({ min: 1, max: 99 }).withMessage('Quantity must be an integer between 1 and 99'),
  validate,
];

const updateItemValidator = [
  param('productId')
    .notEmpty().withMessage('Product ID parameter is required')
    .custom((val) => mongoose.Types.ObjectId.isValid(val)).withMessage('Invalid Product ID format'),
  body('quantity')
    .notEmpty().withMessage('Quantity is required')
    .isInt({ min: 1, max: 99 }).withMessage('Quantity must be an integer between 1 and 99'),
  validate,
];

const removeItemValidator = [
  param('productId')
    .notEmpty().withMessage('Product ID parameter is required')
    .custom((val) => mongoose.Types.ObjectId.isValid(val)).withMessage('Invalid Product ID format'),
  validate,
];

module.exports = {
  addItemValidator,
  updateItemValidator,
  removeItemValidator,
  validate,
};
