const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/productController.js');

router.get('/', productCtrl.getProducts);
router.get('/:id', productCtrl.getProductById);

router.post('/', productCtrl.createProduct);
router.put('/:id', productCtrl.updateProduct);
router.delete('/:id', productCtrl.deleteProduct);

module.exports = router;