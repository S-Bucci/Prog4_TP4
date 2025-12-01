const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {
    limiter,
  speedLimiter
} = require('../middleware/loginSecurity');
const {captchaMiddleware} = require('../middleware/captchaMiddleware');

// Rutas de autenticación
router.post('/login', speedLimiter, limiter, captchaMiddleware, authController.login);
router.post('/register', authController.register);
router.post('/auth/verify', authController.verifyToken);
router.post('/check-username', authController.checkUsername);

module.exports = router;
