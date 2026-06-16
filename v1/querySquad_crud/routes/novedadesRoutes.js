const express = require("express");
const router = express.Router();

const {
    listarNovedades,
    crearNovedad,
    mostrarFormularioEditarNovedad,
    actualizarNovedad,
    eliminarNovedad
} = require("../controllers/novedadesController");

const { validarNovedadFields, validarActualizacionNovedad } = require("../middlewares/validadores");

// GET: listado (vista)
router.get("/", listarNovedades);

// POST: crear
router.post("/", validarNovedadFields, crearNovedad);

// GET: mostrar formulario de edición
router.get("/editar/:id", mostrarFormularioEditarNovedad);

// PUT: actualizar
router.put("/:id", validarActualizacionNovedad, actualizarNovedad);

// DELETE: eliminar (baja lógica)
router.delete("/:id", eliminarNovedad);

module.exports = router;