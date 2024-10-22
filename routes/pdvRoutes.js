// routes/pdvRoutes.js

const express = require('express');
const router = express.Router();
const pdvController = require('../controllers/pdvController');

router.post('/', pdvController.createPdv);
router.get('/:id', pdvController.getPdvById);

module.exports = router;
