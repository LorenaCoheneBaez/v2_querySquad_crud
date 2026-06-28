const { getTokenFromRequest, verifyToken } = require("../auth/jwt");

const verificarPermiso = (permisoRequerido) => {
    return (req, res, next) => {
        const usuarioActual = req.user || req.session?.usuario;

        if (!usuarioActual) {
            const token = getTokenFromRequest(req);

            if (!token) {
                return res.redirect("/");
            }

            try {
                const decoded = verifyToken(token);
                req.user = decoded;
                req.session.usuario = decoded;
            } catch (error) {
                return res.status(401).json({ error: true, mensaje: "Token inválido o expirado" });
            }
        }

        if (usuarioActual.rol === "admin") {
            return next();
        }

        if (!usuarioActual.permisos || !Array.isArray(usuarioActual.permisos)) {
            return res.status(403).send("No tiene permisos asignados.");
        }

        const permisoBuscado = permisoRequerido.toLowerCase();

        const tienePermiso = usuarioActual.permisos.some(
            (p) => p.toLowerCase() === permisoBuscado
        );

        if (tienePermiso) {
            return next();
        }

        return res.status(403).send("No tiene permisos para acceder a este módulo");
    };
};

const verificarLogin = (req, res, next) => {
    if (req.isAuthenticated() || req.user || req.session?.usuario) {
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
};

module.exports = {
    verificarPermiso,
    verificarLogin
};