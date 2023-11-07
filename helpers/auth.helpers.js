const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization ? req.headers.authorization.split(' ').pop() : null;

  if (!token) {
    return res.send({ successful: false, error: "Se requiere autenticacion por Token" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SAL);
    req.user = decoded;
  } catch (err) {
    return res.send({ successful: false, error: "Token invalido" });
  }
  return next();
};

module.exports = verifyToken;