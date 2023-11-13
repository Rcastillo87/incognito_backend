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
    res.send({ successful: false, error: e, message: e } )
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


module.exports = {
  login,
  user_input
};