const express = require('express');
const router = express.Router();
const { registerUserValidator } = require('../validators/auth.validator');
const {registerUser} = require('../controller/auth.controller');
// const {checkAuth} = require('../middlewares/auth.middleware');

router.get('/', (req, res, next)=>{
    res.send('home auth routes')
});

router.post('/register/user', registerUserValidator, registerUser);

router.get('/register/user', (req, res, next)=>{
    res.send('auth/register/user')
});

// router.post('/login', login);
// router.post('/logout', logout);
// router.post('/userByToken', checkAuth, userByToken);
// router.post('/register', register_validator, register);
// router.get('/verifyToken', checkAuth, (req, res)=>{res.send(true)});

module.exports = router;