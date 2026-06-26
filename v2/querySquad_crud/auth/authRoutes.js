const express = require("express");
const passport = require("passport");

const router = express.Router();

router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/?error=1"
    }),
    (req, res) => {

        req.session.usuario = {
            id: req.user.id,
            usuario: req.user.usuario,
            rol: req.user.rol,
            permisos: req.user.permisos
        };

        res.redirect("/empresas");
    }
);

router.get("/logout", (req, res) => {

    req.session.destroy(() => {
        res.redirect("/");
    });

});

module.exports = router;