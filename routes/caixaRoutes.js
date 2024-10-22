// routes/caixaRoutes.js

const express = require('express');
const router = express.Router();
const caixaController = require('../controllers/caixaController');

router.post('/', caixaController.createCaixa);
router.get('/', caixaController.getAllCaixas);
router.get('/:id', caixaController.getCaixaById);
router.put('/:id', caixaController.updateCaixa);
router.delete('/:id', caixaController.deleteCaixa);

module.exports = router;
