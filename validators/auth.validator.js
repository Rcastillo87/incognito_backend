const { body } = require('express-validator');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
const db = getFirestore();

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
    body('user').notEmpty(),
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

const user_login = [
    body('password').isLength({ min: 8 }).notEmpty(),
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

module.exports = {
    user_input,
    user_login
}