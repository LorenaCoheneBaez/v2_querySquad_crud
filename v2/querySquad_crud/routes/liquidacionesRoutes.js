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

const { 
    validarLiquidacionFields,
    validarActualizacionLiquidacion
} = require("../middlewares/validadores");

// Listado
router.get("/", listarLiquidaciones);

// Formulario nueva liquidación
router.get("/nueva", mostrarFormularioNuevaLiquidacion)

// Crear
router.post("/", validarLiquidacionFields, crearLiquidacion);

// Formulario editar
router.get("/actualizar/:id", mostrarFormularioEditarLiquidacion);

// Actualizar
router.put("/:id", validarActualizacionLiquidacion, actualizarLiquidacion);

// Baja lógica
router.delete("/:id", eliminarLiquidacion);

module.exports = router;