const { body } = require('express-validator');
const { initializeApp, cert} = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount  = require("../helpers/firekey.json");

//Database
initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

const registerUserValidator = [
    body('nickname').notEmpty().custom(async (value, { req }) => {
        try{
            const userModel = db.collection('users');
            const user = await userModel.where('nickname', '==', value).get();
    
            if (!user.empty) {
              throw new Error('¡Este apodo ya está en uso!');
            }
        } catch(e){
            throw new Error(e ?? 'Internal Server Error');
        }
    }),
    body('name').notEmpty(),
    body('password').isLength({ min: 8 }).notEmpty()
];

module.exports = {registerUserValidator}