const { validationResult } = require('express-validator');
const { db, admin } = require('../helpers/confi_fire');
var fs = require("fs");
const auth = require('../helpers/auth.helpers');
const jwt = require("jsonwebtoken");


async function eventos_input(req, res, next){
  try {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) { return res.status(422).json({successful: false, errors: errors.array() })}

    const {name,city,type,department,address,organizer_name, organizer_phone } = req.body;

    const eventosJson = {
      name:name,
      city: city,
      type: type,
      department: department,
      address: address,
      cantpeople:0,
      organizer: {
        name: organizer_name,
        phone: organizer_phone,
      }
    };
 
    await db.collection("eventos").add(eventosJson);
    res.send({ successful: true, data: eventosJson } );
  } catch (error) {
    console.log(error)
    res.send({ successful: false, error: e, message: e } )
  }
}

async function eventos_update(req, res, next){
  try {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) { return res.status(422).json({successful: false, errors: errors.array() })}

    const {name,city,type,department,address,organizer_name, organizer_phone, id } = req.body;

    const eventosJson = {
      name:name,
      city: city,
      type: type,
      department: department,
      address: address,
      cantpeople:0,
      organizer: {
        name: organizer_name,
        phone: organizer_phone,
      }
    };

    await db.collection('eventos').doc(id).set(eventosJson, { merge: true });
    res.send({ successful: true, data: eventosJson } );
  } catch (error) {
    console.log(error)
    res.send({ successful: false, error: error } )
  }
}

async function lista_department(req, res, next){
  fs.readFile(__dirname + "/../helpers/lista_dpt_y_ciudades.json", 'utf8', function (err, data) {
      res.set({ 'content-type': 'application/json; charset=utf-8' });
      res.end( data );
  });
}

async function lista_evento_tipos(req, res, next){

  try {
    const tipos = db.collection('evento_tipos');
    const snapshot = await tipos.get();

    var arrar =[];
    snapshot.forEach(doc => {
        var  data = doc.data();
        data.id = doc.id
        arrar.push(data);
    });
    res.send({ successful: true, data: arrar } );

  } catch(error) {
    res.send({ successful: false, error: error } );
  }

}

async function ingreso_evento(req, res, next){

try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { return res.status(422).json({successful: false, errors: errors.array() })}

    const { id } = req.query;
    const token = req.headers.authorization ? req.headers.authorization.split(' ').pop() : null;

    if(token){
      var dat= new Date(); //Obtienes la fecha
      var dat2 = Date.parse(dat); //Lo parseas para transformarlo
      const decoded = jwt.verify(token, process.env.SAL);
      const ingreso_evento = {
        correo: decoded.email,
        id_evento: id,
        fecha_actual: dat2
      };
      await db.collection("eventos_asistencia").add(ingreso_evento);
    }

    const userRef = db.collection('eventos').doc(id);
    const increment = admin.firestore.FieldValue.increment(1);
    userRef.update({ cantpeople: increment });

    res.send({ successful: true, data: "ID valido" } );

  } catch (error) {
    console.log(error)
    res.send({ successful: false, error: error } )
  }

}

module.exports = {
  eventos_input,
  lista_department,
  eventos_update,
  lista_evento_tipos,
  ingreso_evento
};