const express = require('express');
const app = express();
const auth = require('./helpers/auth');

app.get('/', function(req, res, next) { res.render('index', { title: 'Express' }); });

const usuarios = require('./controller/usuarios_controller');
app.post('/usuarios/create', usuarios.create);
app.get('/usuarios/all', usuarios.all);
app.get('/usuarios/one_doc', usuarios.one_doc);
app.get('/usuarios/login', usuarios.login);

module.exports = app;