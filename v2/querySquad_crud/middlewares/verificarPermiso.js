module.exports = (permiso) => {

    return (req, res, next) => {

        if (!req.session.usuario) {
            return res.redirect("/");
        }

        if (req.session.usuario.rol === "admin") {
            return next();
        }

        if (
            req.session.usuario.permisos &&
            req.session.usuario.permisos.includes(permiso)
        ) {
            return next();
        }

        return res.status(403).send(
            "No tiene permisos para acceder a este módulo"
        );

    };

};