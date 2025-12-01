
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


function captchaMiddleware(req, res, next) {
  const { captchaToken } = req.body || {};


  if (requiresCaptcha(req) && !captchaToken) {
    return res.status(400).json({ error: 'captcha' });
  }

  next();
}

module.exports = {captchaMiddleware, registerFailedLogin, resetFailedLogins } ;
