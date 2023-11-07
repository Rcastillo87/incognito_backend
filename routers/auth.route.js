const express = require('express');
const router = express.Router();
const { register_validator } = require('../validators/auth.validator');
const {checkAuth} = require('../middlewares/auth.middleware');

// const {login, register, logout, userByToken} = require('../controllers/auth.controllers');

// router.post('/login', login);
// router.post('/logout', logout);
// router.post('/userByToken', checkAuth, userByToken);
// router.post('/register', register_validator, register);
// router.get('/verifyToken', checkAuth, (req, res)=>{res.send(true)});

module.exports = router;