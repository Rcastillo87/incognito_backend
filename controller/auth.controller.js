const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { validationResult } = require('express-validator');
const db = require('../helpers/confi_fire');

async function user_input(req, res, next){
  try {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) { return res.status(422).json({successful: false, errors: errors.array() })}

    const {name,nickname,password,phone,email,profilePhoto} = req.body;
    const salt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash(password, salt);    

    const userJson = {
      name:name,
      phone: phone,
      email: email,
      nickname: nickname,
      profilePhoto: profilePhoto,
      password: pass,
      status: {
        online: true,
        event : {},
      },
      token: jwt.sign(
        { nickname },
        process.env.SAL,
        { expiresIn: "24h", }
      ),
    };
 
    await db.collection("users").add(userJson);
    delete userJson.password;
    res.send({ successful: true, data: userJson } );
  } catch (error) {
    console.log(error)
    res.send({ successful: false, message: error } )
  }
}

async function user_update(req, res, next){
  try {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) { return res.status(422).json({successful: false, errors: errors.array() })}

    const {name,nickname,password,phone,email,profilePhoto,id} = req.body;

    var userJson = {
      name:name,
      phone: phone,
      email: email,
      nickname: nickname,
      profilePhoto: profilePhoto,
      password: null,
      status: {
        online: true,
        event : {},
      }
    };

    var pass = null;
    if( password !== '' ){
      const salt = await bcrypt.genSalt(10);
      pass = await bcrypt.hash(password, salt);
      userJson.password = pass;
    }else{
      delete userJson.password;
    }

    await db.collection('users').doc(id).set(userJson, { merge: true });
    delete userJson.password;
    res.send({ successful: true, data: userJson } );
  } catch (error) {
    console.log(error)
    res.send({ successful: false, message: error } )
  }
}

/*async function login(data, res){
  const errors = validationResult(data);
  if (!errors.isEmpty()) { return res.status(422).json({successful: false, errors: errors.array() })}
  res.send( sokect_login(data) );
}*/

async function login(data, res) {

  const { password, email } = data.body;

  const query = db.collection("users").where("email", "==", email);
  query.get()
  .then(snapshot => {
    //const usuarios = [];
    var user = null;
    snapshot.forEach(doc => {
      const usuario = doc.data();
      //delete usuario.password;
      //delete usuario.token;
      user = usuario;
      //usuarios.push(usuario);
    });

    new Promise(async (_myResolve, myReject) => {
      if (await bcrypt.compare(password, user.password)) {
        delete user.password;
        res.send(
          {
            successful: true, data: jwt.sign(
              { nickname: user.nickname, email: user.email },
              process.env.SAL,
              { expiresIn: "24h" }
            )
          }
        );
      } else {
        res.send({ successful: false, error: "pass invalido" });
      }
    })

  })
  .catch(error => {
    return res.status(422).json({successful: false, errors: error })
  });

}

async function user_uno(req, res, next){

  try {
    const eventosModel = await db.collection('users').doc(req.body.id).get();
    if (!eventosModel.exists) {
        res.send({ successful: false, data: "Documento no encontrado" } );
    } else {        var lista = eventosModel.data();
        delete lista.password;
        delete lista.token;
        res.send({ successful: true, data: lista } );
    }
  } catch(error) {
    res.send({ successful: false, error: error } );
  }

}


module.exports = {
  login,
  user_input,
  user_uno,
  user_update
};