const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {

  limiter,
 speedLimiter
} = require('../middleware/loginSecurity');

// Rutas de autenticación
router.post('/login', speedLimiter, limiter , authController.login);
router.post('/register', authController.register);
router.post('/auth/verify', authController.verifyToken);
router.post('/check-username', authController.checkUsername);

module.exports = router;
