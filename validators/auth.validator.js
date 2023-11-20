const { body } = require('express-validator');
const { db, admin } = require('../helpers/confi_fire');

const user_input = [
    body('name').notEmpty(),
    body('nickname').notEmpty().custom(async (value, { }) => {
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
    body('password').isLength({ min: 8 }).notEmpty(),
    body('profilePhoto').isEmpty(),
    body('phone').isInt(),
    body('email').isEmail().withMessage('Solo se admiten correos'),
    body('email', 'Invalid email').custom(async (value) => {
        try{
            const userModel = db.collection('users');
            const user = await userModel.where('email', '==', value).get();
            if (!user.empty) {
                throw new Error('¡Este email ya está en uso!');
            }
        } catch(e){
            throw new Error(e ?? 'Internal Server Error');
        }
     })
];

const user_update = [
    body('id').custom(async (id, { }) => {
        return new Promise(async (resolve, reject) => {
            const eventosModel = await db.collection('users').doc(id).get();
            if (!eventosModel.exists) {
                reject(new Error('Documento no encontrado.'))
            } else {
                resolve(true)
                console.log(eventosModel.data());
            }
        })
    }),
    body('name').notEmpty(),
    body('nickname').notEmpty(),
    body('profilePhoto').isEmpty(),
    body('phone').isInt(),
    body('email').isEmail().withMessage('Solo se admiten correos')
];

const user_login = [
    body('password').isLength({ min: 8 }).notEmpty(),
    body('email', 'Invalid email').custom(async (value) => {
        try{
            const userModel = db.collection('users');
            const user = await userModel.where('email', '==', value).get();
            if (user.empty == true) {
                throw new Error('Email no encontrado');
            }
        } catch(e){
            throw new Error(e ?? 'Internal Server Error');
        }
     })
];

module.exports = {
    user_input,
    user_login,
    user_update
}