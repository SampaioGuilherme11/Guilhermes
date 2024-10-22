const express = require('express');
const router = express.Router();
const produtosPdvController = require('../controllers/produtosPdvController');

router.post('/', produtosPdvController.createProdutoPdv);
router.get('/:pdvId', produtosPdvController.getProdutosPdvByPdvId);

module.exports = router;
