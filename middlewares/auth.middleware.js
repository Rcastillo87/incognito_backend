// const Token = require('../models/token.model');
// const {verifyToken} = require('../helpers/token.helper');

const checkAuth = async (req, res, next)=>{
    // try {
    //     const token = req.headers.authorization ? req.headers.authorization.split(' ').pop() : null;
    //     if(await Token.findOne({where: {token: token}}) && verifyToken(token)){return next()}
    //     else res.status(401).send({successful: false, message: 'No estás autorizado'});
    // } catch (e) {
    //     res.status(500).send({successful: false, message: '¡Lo siento!, tenemos problemas técnicos, estamos trabajando para solucionarlo.'});
    // }
}

module.exports = {checkAuth}