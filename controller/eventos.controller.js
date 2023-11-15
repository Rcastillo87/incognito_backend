const { validationResult } = require('express-validator');
const db = require('../helpers/confi_fire');
var fs = require("fs");

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

    await db.database().ref(`eventos/${id}`).set(eventosJson);
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


module.exports = {
  eventos_input,
  lista_department,
  eventos_update
};