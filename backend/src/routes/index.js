const express = require('express');
const router = express.Router();

const csrf = require('csurf');

// CSRF PROTECTION: Configurar middleware de protección CSRF usando sesión (no cookies)
const csrfProtection = csrf({ cookie: false });

// CSRF PROTECTION: Endpoint para obtener token CSRF único por sesión
// El frontend debe llamar este endpoint y usar el token en requests sensibles
router.get('/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Importar todas las rutas
const authRoutes = require('./auth');
const productRoutes = require('./products');
const vulnerabilityRoutes = require('./vulnerabilities');
const captchaRoutes = require('./captcha');

// Usar las rutas
router.use('/', authRoutes);
router.use('/', productRoutes);
router.use('/', vulnerabilityRoutes);
router.use('/', captchaRoutes);

// Ruta de prueba
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'API funcionando correctamente' });
});

module.exports = router;
