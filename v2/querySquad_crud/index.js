const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const manejarErrores = require("./middlewares/errorHandler");
const session = require("express-session");
const verificarLogin = require("./middlewares/autenticacion");
const config = require("./config/config");

const app = express();
const PORT = config.port;

// Conexión a MongoDB
const conectarMongoDB = async () => {
  try {
    await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Conectado a MongoDB");
  } catch (error) {
    console.error("Error de conexión a MongoDB:", error.message);
    process.exit(1);
  }
};

conectarMongoDB();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false
  })
);

//Para no tener error con PUT
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    return req.body._method;
  }
}));

const empresasRoutes = require("./routes/empresasRoutes");
const empleadosRoutes = require("./routes/empleadosRoutes");
const novedadesRoutes = require("./routes/novedadesRoutes");
const auditoriaRoutes = require("./routes/auditoriaRoutes");
const sociosRoutes = require("./routes/sociosRoutes");
const liquidacionesRoutes = require("./routes/liquidacionesRoutes");

app.use("/empresas", verificarLogin, empresasRoutes);
app.use("/empleados", verificarLogin, empleadosRoutes);
app.use("/novedades", verificarLogin, novedadesRoutes);
app.use("/auditoria", verificarLogin, auditoriaRoutes);
app.use("/socios", verificarLogin, sociosRoutes);
app.use("/liquidaciones", verificarLogin, liquidacionesRoutes);


app.get('/', (req, res) => {
  res.render('login');
});

app.post("/login", (req, res) => {

  const { usuario, password } = req.body;

  if (usuario === "admin" && password === "1234") {

  req.session.usuario = {
    nombre: usuario,
    rol: "admin"
  };

  res.redirect("/empresas");

}

});

app.get("/logout", (req, res) => {

  req.session.destroy(() => {
    res.redirect("/");
  });

});

// Middleware de manejo de errores (debe ir al final)
app.use(manejarErrores);

app.listen(PORT, () => {
  console.log("Servidor corriendo en el puerto " + PORT);
});

module.exports = app;