const express = require("express");
const router = express.Router();
const methodOverride = require("method-override");

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
router.get("/", listarSocios);

// Formulario nuevo socio
router.get("/nuevo", mostrarFormularioNuevoSocio);

// Crear
router.post("/", validarSocioFields, crearSocio);

// Formulario editar
router.get("/actualizar/:id", mostrarFormularioEditarSocio);

// Actualizar
router.put("/:id", validarActualizacionSocio, actualizarSocio);

// Baja lógica
router.delete("/:id", eliminarSocio);

module.exports = router;