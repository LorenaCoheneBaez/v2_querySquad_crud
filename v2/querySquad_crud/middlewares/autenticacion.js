const { getTokenFromRequest, verifyToken } = require("../auth/jwt");

function verificarLogin(req, res, next) {
  if (req.session?.usuario || req.user) {
    return next();
  }

  const token = getTokenFromRequest(req);
  if (!token) {
    return res.redirect("/");
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    req.session.usuario = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ error: true, mensaje: "Token inválido o expirado" });
  }
}

module.exports = verificarLogin;