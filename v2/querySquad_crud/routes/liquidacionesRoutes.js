const express = require("express");
const router = express.Router();
const methodOverride = require("method-override");

router.use(methodOverride("_method"));

const {
    listarLiquidaciones,
    crearLiquidacion,
    //mostrarFormularioNuevaLiquidacion,
    //mostrarFormularioEditarLiquidacion,
    actualizarLiquidacion,
    eliminarLiquidacion
} = require("../controllers/liquidacionController");

// Listado
router.get("/", listarLiquidaciones);

// Formulario nueva liquidación
//router.get("/nueva", mostrarFormularioNuevaLiquidacion);

// Crear
router.post("/", crearLiquidacion);

// Formulario editar
//router.get("/actualizar/:id", mostrarFormularioEditarLiquidacion);

// Actualizar
router.put("/:id", actualizarLiquidacion);

// Baja lógica
router.delete("/:id", eliminarLiquidacion);

module.exports = router;