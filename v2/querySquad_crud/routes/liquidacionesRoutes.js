const express = require("express");
const router = express.Router();
const methodOverride = require("method-override");

router.use(methodOverride("_method"));

const {
    listarLiquidaciones,
    crearLiquidacion,
    mostrarFormularioNuevaLiquidacion,
    mostrarFormularioEditarLiquidacion,
    actualizarLiquidacion,
    eliminarLiquidacion
} = require("../controllers/liquidacionController");
const { verificarPermiso, verificarLogin } = require("../middlewares/verificarPermiso");

const { 
    validarLiquidacionFields,
    validarActualizacionLiquidacion
} = require("../middlewares/validadores");

// Listado
router.get("/", verificarLogin, verificarPermiso("LIQUIDACIONES"), listarLiquidaciones);

// Formulario nueva liquidación
router.get("/nueva", verificarLogin, verificarPermiso("LIQUIDACIONES"), mostrarFormularioNuevaLiquidacion);

// Crear
router.post("/", verificarLogin, verificarPermiso("LIQUIDACIONES"), validarLiquidacionFields, crearLiquidacion);

// Formulario editar
router.get("/actualizar/:id", verificarLogin, verificarPermiso("LIQUIDACIONES"), mostrarFormularioEditarLiquidacion);

// Actualizar
router.put("/:id", verificarLogin, verificarPermiso("LIQUIDACIONES"), validarActualizacionLiquidacion, actualizarLiquidacion);

// Baja lógica
router.delete("/:id", verificarLogin, verificarPermiso("LIQUIDACIONES"), eliminarLiquidacion);

module.exports = router;