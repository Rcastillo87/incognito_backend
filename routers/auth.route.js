const express = require('express');
const router = express.Router();
const Validator  = require('../validators/auth.validator');
const user = require('../controller/auth.controller');

router.get('/', (req, res, next)=>{ res.send('home auth routes') });

router.post('/user/input', Validator.user_input, user.user_input);

module.exports = router;