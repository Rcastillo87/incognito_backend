const express = require('express');
const router = express.Router();
const Validator  = require('../validators/eventos.validator');
const eventos = require('../controller/eventos.controller');


router.post('/input', Validator.eventos_input, eventos.eventos_input);
router.post('/update', Validator.eventos_update, eventos.eventos_update);
router.get('/lista_department', eventos.lista_department);

module.exports = router;