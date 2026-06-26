const express = require("express");
const router = express.Router();
const { verificarPermiso, verificarLogin } = require("../middlewares/verificarPermiso");

const {
    listarNovedades,
    crearNovedad,
    mostrarFormularioEditarNovedad,
    actualizarNovedad,
    eliminarNovedad
} = require("../controllers/novedadesController");

const { validarNovedadFields, validarActualizacionNovedad } = require("../middlewares/validadores");

// GET: listado (vista)
router.get("/", verificarLogin, verificarPermiso("NOVEDADES"), listarNovedades);

// POST: crear
router.post("/", verificarLogin, verificarPermiso("NOVEDADES"), validarNovedadFields, crearNovedad);

// GET: mostrar formulario de edición
router.get("/editar/:id", verificarLogin, verificarPermiso("NOVEDADES"), mostrarFormularioEditarNovedad);

// PUT: actualizar
router.put("/:id", verificarLogin, verificarPermiso("NOVEDADES"), validarActualizacionNovedad, actualizarNovedad);

// DELETE: eliminar (baja lógica)
router.delete("/:id", verificarLogin, verificarPermiso("NOVEDADES"), eliminarNovedad);

module.exports = router;