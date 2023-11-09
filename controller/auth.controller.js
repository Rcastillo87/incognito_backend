const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { validationResult } = require('express-validator');
// const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
const db = getFirestore();

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

  const collection = db.collection('usuarios');
  const user = await collection.where('email', '==', email).get();
  if (user.empty) {
    callback.send({ successful: false, error: 'Usuario no encontrado!' } );
  }  
console.log(user);

  var arrar =[];
  user.forEach(doc => {
      var  data = doc.data();
      data.id = doc.id
      arrar.push(data);
      
  });
  
  var usuario = arrar[0];


    
    new Promise(async function (myResolve, myReject) {
        if (await bcrypt.compare(password, usuario.password)) {
          callback.send(
                {
                    successful: true, data: {
                        token: jwt.sign(
                            { name: usuario.nickname, id: usuario.id },
                            process.env.SAL,
                            { expiresIn: "24h", }
                        ),
                        user:{
                            id: usuario.id,
                            nombre: usuario.nickname,
                            correo: usuario.email
                        }
                    }
                }
            )
        }else {
          callback.send( { successful: false, error: "password invalido" } )
        }
    })
  }


  //const userRef = db.collection('users');

  //console.log(data);
  // const snapshot = await userRef.where('nickname', '==', data.user).get();

  // if (snapshot.empty) {
  //   res.send({successful: false, error: 'create:usernotfound'} );
  // }  

  // const arrar =[];
  // snapshot.forEach(doc => {
  //     const data = doc.data();
  //     data.id = doc.id
  //     arrar.push(data);
  // });

  // const usuario = arrar[0];
  
  // new Promise(async function (myResolve, myReject) {
  //     if (await bcrypt.compare(req.body.pass, usuario.pass)) {
  //       res.send(
  //             {
  //                 successful: true, data: {
  //                     token: jwt.sign(
  //                         { name: usuario.nombre_completo, id: usuario.id },
  //                         process.env.SAL,
  //                         { expiresIn: "24h", }
  //                     ),
  //                     user:{
  //                         id: usuario.id,
  //                         nombre: usuario.nombre_completo,
  //                         correo: usuario.email
  //                     }
  //                 }
  //             }
  //         )
  //     }else {
  //       res.send( { successful: false, error: "pass invalido" } )
  //     }
  // });


module.exports = {
  login,
  user_input
};

// async function create(req, res, next) {
//   const citiesRef = db.collection('usuarios');
//   const snapshot = await citiesRef.where('email', '==', req.body.email).get();
//   if (!snapshot.empty) {
//     res.send({ successful: false, error: 'vorreo ya existe' } );
//   }

//     try {
//       var salt = await bcrypt.genSalt(10);
//       var pass = await bcrypt.hash(req.body.pass, salt);

//       const id = req.body.email;
//       const userJson = {
//         email: req.body.email,
//         nombre_completo: req.body.nombre_completo,
//         mobil: req.body.mobil,
//         pass: pass,
//         imagenes:[]
//       };
//       var response = await db.collection("usuarios").add(userJson);
//       res.send({ successful: true, data: response } );
//     } catch(error) {
//       res.send({ successful: false, error: error } );
//     }
// }

// async function all(req, res, next) {
//     try {
//         const cityRef = db.collection('usuarios');
//         const snapshot = await cityRef.get();

//         var arrar =[];
//         snapshot.forEach(doc => {
//             var  data = doc.data();
//             data.id = doc.id
//             arrar.push(data);
//         });
//         res.send({ successful: true, data: arrar } );

//       } catch(error) {
//         res.send({ successful: false, error: error } );
//       }
// }

// async function one_doc(req, res, next) {
//   try {
//       const cityRef = db.collection('usuarios').doc(req.body.id);
//       const doc = await cityRef.get();

//       if (!doc.exists) {
//         res.send({ successful: false, error: 'No such document!' } );
//       } else {
//         res.send({ successful: true, data: doc.data() } );
//       }

//     } catch(error) {
//       res.send({ successful: false, error: error } );
//     }
// }