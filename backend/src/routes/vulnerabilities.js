const express = require('express');
const router = express.Router();
const vulnerabilityController = require('../controllers/vulnerabilityController');
const { uploadMiddleware, uploadFile } = require('../controllers/uploadController');
const csrf = require('csurf');

// CSRF PROTECTION: Configurar middleware de protección CSRF
const csrfProtection = csrf({ cookie: false });

// CSRF PROTECTION: Middleware para validar Origin/Referer
// Rechaza requests de orígenes no autorizados (previene ataques cross-site)
const validateOrigin = (req, res, next) => {
    const allowedOrigins = ['http://localhost:3000', 'http://localhost:5000'];
    const origin = req.get('origin') || req.get('referer');
        if (origin) {
            const isAllowed = allowedOrigins.some(allowed => origin.startsWith(allowed));
            if (!isAllowed) {
                return res.status(403).json({ error: 'Invalid Origin' });
            }
    }
next();
};

// CSRF PROTECTION: Middleware para asegurar que cookies tengan atributo SameSite
// Intercepta la respuesta y agrega SameSite=Strict si no está presente
const ensureSameSite = (req, res, next) => {
    const originalSetHeader = res.setHeader;
    res.setHeader = function(name, value) {
        if (name.toLowerCase() === 'set-cookie') {
            if (Array.isArray(value)) {
                value = value.map(cookie => {
                    if (cookie.includes('connect.sid') && !cookie.includes('SameSite')) {
                        return cookie + '; SameSite=Strict';
                    }
        return cookie;
        });
    } else if (typeof value === 'string') {
        if (value.includes('connect.sid') && !value.includes('SameSite')) {
        value = value + '; SameSite=Strict';
        }
    }
    }
    return originalSetHeader.call(this, name, value);
    };
    next();
};

// CSRF PROTECTION: Endpoint para obtener token CSRF único
// Aplica ensureSameSite para garantizar cookies seguras en el test
router.get('/csrf-token', ensureSameSite, csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// Command Injection
router.post('/ping', vulnerabilityController.ping);

// CSRF PROTECTION: Endpoint /transfer protegido contra CSRF
// 1. validateOrigin: Verifica que el request venga de un origen permitido
// 2. csrfProtection: Valida que el token CSRF sea correcto
router.post('/transfer', validateOrigin, csrfProtection, vulnerabilityController.transfer);

// Local File Inclusion
router.get('/file', vulnerabilityController.readFile);

// File Upload
router.post('/upload', uploadMiddleware, uploadFile);

// CSRF PROTECTION: Middleware de manejo de errores CSRF
// Captura errores de token CSRF inválido y retorna mensaje apropiado
router.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        return res.status(403).json({ error: 'Validacion de token CSRF fallida' });
    }
    next(err);
});


module.exports = router;
