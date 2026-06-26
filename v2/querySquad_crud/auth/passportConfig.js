const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const Socio = require("../models/SociosSchema");

passport.use(
    new LocalStrategy(
        {
            usernameField: "usuario",
            passwordField: "password"
        },
        async (usuario, password, done) => {

            try {

                // ADMIN fijo
                if (
                    usuario === "admin" &&
                    password === "1234"
                ) {

                    return done(null, {
                        id: "admin",
                        usuario: "admin",
                        rol: "admin",
                        permisos: [
                            "EMPRESAS",
                            "EMPLEADOS",
                            "NOVEDADES",
                            "LIQUIDACIONES",
                            "SOCIOS",
                            "AUDITORIA"
                        ]
                    });

                }

                const socio = await Socio.findOne({
                    email: usuario,
                    activo: true
                });

                if (!socio) {
                    return done(null, false);
                }

                const passwordValida =
                    await bcrypt.compare(
                        password,
                        socio.password
                    );

                if (!passwordValida) {
                    return done(null, false);
                }

                return done(null, {
                    id: socio._id,
                    usuario: socio.email,
                    rol: "socio",
                    permisos: socio.permisos
                });

            } catch (error) {

                return done(error);

            }

        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

module.exports = passport;