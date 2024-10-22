// routes/formaPagamentoRoutes.js

const express = require('express');
const router = express.Router();
const formaPagamentoController = require('../controllers/formaPagamentoController');

router.post('/', formaPagamentoController.createFormaPagamento );
router.get('/', formaPagamentoController.getAllFormasPagamento );
router.get('/:id', formaPagamentoController.getFormaPagamentoById );
router.put('/:id', formaPagamentoController.updateFormaPagamento );
router.delete('/:id', formaPagamentoController.deleteFormaPagamento );

module.exports = router;
