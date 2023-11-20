const { body, check } = require('express-validator');
const { db, admin } = require('../helpers/confi_fire');

const eventos_input = [
    body('name').notEmpty().custom(async (value, { }) => {
        try{
            const eventosModel = db.collection('eventos');
            const eventos = await eventosModel.where('name', '==', value).get();
            if (!eventos.empty) {
              throw new Error('El eventos ya existe');
            }
        } catch(e){
            throw new Error(e ?? 'Internal Server Error');
        }
    }),
    body('city').notEmpty(),
    body('department').notEmpty(),
    body('type').notEmpty(),
    body('address').notEmpty(),
    body('organizer_name').notEmpty(),
    body('organizer_phone').notEmpty()
];
const eventos_update = [
    body('id').custom(async (id, { }) => {
        return new Promise(async (resolve, reject) => {
            const eventosModel = await db.collection('eventos').doc(id).get();
            if (!eventosModel.exists) {
                reject(new Error('Documento no encontrado.'))
            } else {
                resolve(true)
                console.log(eventosModel.data());
            }
        })
    }),
    body('name').notEmpty(),
    body('city').notEmpty(),
    body('department').notEmpty(),
    body('type').notEmpty(),
    body('address').notEmpty(),
    body('organizer_name').notEmpty(),
    body('organizer_phone').notEmpty()
];
const ingreso_evento = [
    check('id').custom(async (id, { }) => {
        return new Promise(async (resolve, reject) => {
            const eventosModel = await db.collection('eventos').doc(id).get();
            if (!eventosModel.exists) {
                reject(new Error('Documento no encontrado.'))
            } else {
                resolve(true)
            }
        })
    })
];

module.exports = {
    eventos_input,
    eventos_update,
    ingreso_evento
}