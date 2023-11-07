const express = require('express');
const router = express.Router();
const auth = require('./auth.route')

// app.get('/', function(req, res, next) { res.render('index', { title: 'Express' }); });

// MIDDLEWARE
router.use('/auth', auth);

// RUTAS
// const usuarios = require('./controller/usuarios_controller');
// app.post('/usuarios/create', usuarios.create);
// app.get('/usuarios/all', usuarios.all);
// app.get('/usuarios/one_doc', usuarios.one_doc);
// app.get('/usuarios/login', usuarios.login); 

// router.get('/', function(req, res) {
// //   res.send('routes'); 
// }); 

module.exports = router;