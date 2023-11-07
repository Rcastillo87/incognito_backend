const jwt = require('jsonwebtoken');

//Firmar
const tokenSign = async ({id, perRoleId })=>{
    return jwt.sign(
        {id, perRoleId},
        process.env.JWT_SECRET,
        {expiresIn: "24h"}
    )
}

//Verificar token
const verifyToken = (token)=>{
    try { return jwt.verify(token, process.env.JWT_SECRET)} 
    catch (error){return null};
}

module.exports = {tokenSign, verifyToken}