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

        if (req.user?.rol === "admin") {
            return next();
        }

        if (!req.user?.permisos || !Array.isArray(req.user.permisos)) {
            return res.status(403).send("No tiene permisos asignados.");
        }

        const permisoBuscado = permisoRequerido.toLowerCase();

        const tienePermiso = req.user.permisos.some(
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