const express = require('express');
const app = express();
const router = require('../routers/routes');
const os = require('os');
const cors = require('cors');
const ifaces = os.networkInterfaces();
const dotenv = require('dotenv').config();
const auth = require('../routers/auth.route');

//Settings
/* Get port from environment and store in Express.*/
// const port = normalizePort(process.env.PORT || '5000');
// app.set('port', port);

app.use(cors({origin: '*'}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Routers
app.use('/', router);

//Listening
console.log(`🖥️  Iniciando servidor - levantando servicios...`);

/* API Create HTTP server */
app.listen(process.env.PORT_API, ()=>{
    let ipv4 = null;
    ifaces[ifaces['Wi-Fi'] ? 'Wi-Fi' : 'Loopback Pseudo-Interface 1'].forEach((iface)=>{
        if ('IPv4' !== iface.family) { return }; ipv4 = iface.address
    });

    console.log('\x1b[36m%s\x1b[0m', ` ${ifaces['Wi-Fi'] ? '🌏 Wi-Fi:' : '🗺  Local:'} http://${ipv4}:${process.env.PORT_API}`);    
    // console.log('\x1b[36m%s\x1b[0m', '🗺  ¡Estamos en producción! ');    
    
    // ORM
    // connectionDB();
    
    //MariaDB
    // testConnection();
});

module.exports = app;