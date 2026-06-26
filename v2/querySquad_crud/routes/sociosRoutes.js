const express = require("express");
const router = express.Router();
const methodOverride = require("method-override");
const { verificarPermiso, verificarLogin } = require("../middlewares/verificarPermiso");

router.use(methodOverride("_method"));

const {
    listarSocios,
    crearSocio,
    mostrarFormularioNuevoSocio,
    mostrarFormularioEditarSocio,
    actualizarSocio,
    eliminarSocio
} = require("../controllers/sociosController");

const { 
    validarSocioFields, 
    validarActualizacionSocio
} = require("../middlewares/validadores");

// Listado
router.get("/", verificarLogin, verificarPermiso("SOCIOS"), listarSocios);

// Formulario nuevo socio
router.get("/nuevo", verificarLogin, verificarPermiso("SOCIOS"), mostrarFormularioNuevoSocio);

// Crear
router.post("/", verificarLogin, verificarPermiso("SOCIOS"), validarSocioFields, crearSocio);

// Formulario editar
router.get("/actualizar/:id", verificarLogin, verificarPermiso("SOCIOS"), mostrarFormularioEditarSocio);

// Actualizar
router.put("/:id", verificarLogin, verificarPermiso("SOCIOS"), validarActualizacionSocio, actualizarSocio);

// Baja lógica
router.delete("/:id", verificarLogin, verificarPermiso("SOCIOS"), eliminarSocio);

module.exports = router;