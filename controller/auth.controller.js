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
      name,
      phone,
      email,
      nickname,
      profilePhoto,
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

async function login(data, callback, io) {
  const { password, email } = data.body;

    // Sign in with email and pass.
    db.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
        } else {
            alert(errorMessage);
        }
        console.log(error);
    });
}


module.exports = {
  login,
  user_input
};