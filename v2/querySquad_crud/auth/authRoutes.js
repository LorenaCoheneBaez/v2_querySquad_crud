const express = require("express");
const passport = require("passport");
const { signToken } = require("./jwt");

const router = express.Router();

const setAuthCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 8 * 60 * 60 * 1000
    });
};

router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/?error=1"
    }),
    (req, res) => {
        const payload = {
            id: req.user.id,
            usuario: req.user.usuario,
            rol: req.user.rol,
            permisos: req.user.permisos
        };

        req.session.usuario = payload;

        const token = signToken(payload);
        setAuthCookie(res, token);

        if (req.accepts(["html", "json"]) === "json") {
            return res.json({ token, usuario: payload });
        }

        res.redirect("/empresas");
    }
);

router.get("/logout", (req, res) => {
    res.clearCookie("token");

    req.session.destroy(() => {
        res.redirect("/");
    });

});

module.exports = router;