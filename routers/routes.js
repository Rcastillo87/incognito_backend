const express = require('express');
const router = express.Router();
const auth = require('./auth.route')

router.get('/', (req, res, next)=>{ res.send('Express') });

// MIDDLEWARE
router.use('/auth', auth);

module.exports = router;