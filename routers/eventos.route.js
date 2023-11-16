const express = require('express');
const router = express.Router();
const Validator  = require('../validators/eventos.validator');
const eventos = require('../controller/eventos.controller');
const auth = require('../helpers/auth.helpers');


router.post('/input', auth, Validator.eventos_input, eventos.eventos_input);
router.put('/update', auth, Validator.eventos_update, eventos.eventos_update);
router.get('/lista_department', eventos.lista_department);
router.get('/lista_evento_tipos', eventos.lista_evento_tipos);

module.exports = router;