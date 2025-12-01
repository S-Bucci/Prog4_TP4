

const { rateLimit } = require('express-rate-limit')
const {slowDown}  = require("express-slow-down");

const failedLoginsByIp = {};

/**
 * Obtener IP (tests usan X-Forwarded-For)
 */
function getIp(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.ip ||
    req.connection?.remoteAddress ||
    'unknown'
  );
}

/**
 * Rate limiting: 5 intentos / 15 minutos
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
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



/**
 * Registrar login fallido
 */
function registerFailedLogin(req) {
  const ip = getIp(req);
  const now = Date.now();

  if (!failedLoginsByIp[ip]) {
    failedLoginsByIp[ip] = {
      failures: 0,
      lastFailedAt: now
    };
  }

  failedLoginsByIp[ip].failures++;
  failedLoginsByIp[ip].lastFailedAt = now;
}

/**
 * Resetear contador después de login exitoso
 */
function resetFailedLogins(req) {
  const ip = getIp(req);
  delete failedLoginsByIp[ip];
}

/**
 * ¿Se requiere CAPTCHA para este IP?
 * Sí, a partir de 3 fallos
 */
function requiresCaptcha(req) {
  const ip = getIp(req);
  const data = failedLoginsByIp[ip];
  return data && data.failures >= 3;
}




module.exports = {

  limiter,
  speedLimiter,
  registerFailedLogin,
  resetFailedLogins,
  requiresCaptcha
  
};