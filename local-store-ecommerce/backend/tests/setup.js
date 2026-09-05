'use strict';

require('dotenv').config();

process.env.NODE_ENV = 'test';
process.env.PORT = 5002;
process.env.MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb://mongo:mmBctinBbEWNMQiNtHrYseyOBcrTgOaF@acela.proxy.rlwy.net:51312/local_store_test_db?authSource=admin';
