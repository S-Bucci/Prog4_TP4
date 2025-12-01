

const { rateLimit } = require('express-rate-limit')
const {slowDown}  = require("express-slow-down");



/**
 * Rate limiting: 5 intentos / 15 minutos
 */
const limiter = rateLimit({
  windowMs:  1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },

});


const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 5,
  message: { error: 'Too many requests, please try again later.' },
  delayMs: (hits) => hits * 100
});








module.exports = {

  limiter,
  speedLimiter,

  
};