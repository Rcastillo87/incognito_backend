const express = require('express');
const router = express.Router();
const auth = require('./auth.route')
const eventos = require('./eventos.route')

router.get('/', (req, res, next)=>{ res.send('Express') });

// MIDDLEWARE
router.use('/auth', auth);
router.use('/eventos', eventos);

module.exports = router;