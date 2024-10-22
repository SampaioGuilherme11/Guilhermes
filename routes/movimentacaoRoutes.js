// routes/movimentacaoRoutes.js

const express = require('express');
const router = express.Router();
const movimentacaoController = require('../controllers/movimentacaoController');

router.post('/', movimentacaoController.createMovimentacao);
router.get('/', movimentacaoController.getAllMovimentacoes);
router.get('/:id', movimentacaoController.getMovimentacaoById);
router.put('/:id', movimentacaoController.updateMovimentacao);
router.delete('/:id', movimentacaoController.deleteMovimentacao);

module.exports = router;
