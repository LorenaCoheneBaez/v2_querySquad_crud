const verificarPermiso = (permisoRequerido) => {
    return (req, res, next) => {

        if (!req.isAuthenticated() || !req.user) {
            return res.redirect("/");
        }

        const usuarioActual = req.user;

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
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect("/");
};

module.exports = {
    verificarPermiso,
    verificarLogin
};