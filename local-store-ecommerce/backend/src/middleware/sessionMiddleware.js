'use strict';

const { v4: uuidv4 } = require('uuid');

const sessionMiddleware = (req, res, next) => {
  let sessionId = req.headers['x-session-id'] || req.query.sessionId;

  if (!sessionId || typeof sessionId !== 'string' || sessionId.trim().length === 0) {
    sessionId = uuidv4();
  }

  req.sessionId = sessionId.trim();
  res.setHeader('x-session-id', req.sessionId);
  next();
};

module.exports = sessionMiddleware;
