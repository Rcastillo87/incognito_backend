const express = require('express');
const router = express.Router();
const Validator  = require('../validators/auth.validator');
const user = require('../controller/auth.controller');

router.get('/', (req, res, next)=>{ res.send('home auth routes') });

router.post('/user/input', Validator.user_input, user.user_input);
router.put('/user/update', Validator.user_update, user.user_update);
router.post('/user/login', Validator.user_login, user.login);

router.get('/user/user_uno',  user.user_uno);


module.exports = router;