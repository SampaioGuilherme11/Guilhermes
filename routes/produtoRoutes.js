// routes/produtoRoutes.js

const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

router.post('/', produtoController.createProduto);
router.get('/', produtoController.getAllProdutos);
router.get('/:id', produtoController.getProdutoById);
router.put('/:id', produtoController.updateProduto);
router.delete('/:id', produtoController.deleteProduto);

module.exports = router;
