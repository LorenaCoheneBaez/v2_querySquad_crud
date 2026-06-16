const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const manejarErrores = require("./middlewares/errorHandler");

const app = express();
const PORT = 3000;

// Conexión a MongoDB
const conectarMongoDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/query_squad_db", {
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

app.use("/empresas", empresasRoutes);
app.use("/empleados", empleadosRoutes);
app.use("/novedades", novedadesRoutes);
app.use("/auditoria", auditoriaRoutes);

app.get('/', (req, res) => {
  res.render('login');
});
/*
app.listen(PORT, () => {
  console.log("Servidor corriendo en el puerto " + PORT);
});

app.use(express.urlencoded({ extended: true }));
*/

app.post("/login", (req, res) => {

  const { usuario, password } = req.body;

  if (usuario === "admin" && password === "1234") {

    res.redirect("/empresas");

  } else {

    res.redirect("/?error=1");

  }

});

app.get("/logout", (req, res) => {

  res.redirect("/");

});

// Middleware de manejo de errores (debe ir al final)
app.use(manejarErrores);

app.listen(PORT, () => {
  console.log("Servidor corriendo en el puerto " + PORT);
});

module.exports = app;