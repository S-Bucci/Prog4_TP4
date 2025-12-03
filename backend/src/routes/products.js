const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { validarCaracteresPeligrosos } = require('../middleware/validateInput');

// Ruta actualizada y protegida por el middleware de validación 
router.get('/products', validarCaracteresPeligrosos, productController.getProducts);

module.exports = router;
