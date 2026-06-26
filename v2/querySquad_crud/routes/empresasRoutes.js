const express = require("express");
const router = express.Router();
const { validarEmpresaFields } = require("../middlewares/validadores");
const { verificarPermiso, verificarLogin } = require("../middlewares/verificarPermiso");

const {
    crearEmpresa,
    mostrarFormularioNuevaEmpresa,
    listarTodasEmpresas,
    listarEmpresasActivas,
    listarEmpresasInactivas,
    cambiarEstadoEmpresa,
    actualizarEmpresa,
    mostrarFormularioEditarEmpresa,
    eliminarEmpresa
}
    = require("../controllers/empresasController");

router.get("/nueva", verificarLogin, verificarPermiso("EMPRESAS"), (req, res) => {
    res.render("nueva-empresa");
});

//POST: Alta
router.post("/", verificarLogin, verificarPermiso("EMPRESAS"), validarEmpresaFields, crearEmpresa);
//GET: Listado de empresas activas
router.get("/listado-empresas-activas", verificarLogin, verificarPermiso("EMPRESAS"), listarEmpresasActivas);
//GET: Listado de empresas inactivas
router.get("/listado-empresas-inactivas", verificarLogin, verificarPermiso("EMPRESAS"), listarEmpresasInactivas);
//GET: Listado de todas las empresas
router.get("/", verificarLogin, verificarPermiso("EMPRESAS"), listarTodasEmpresas);
// PUT: Cambiar estado de empresa (activar/desactivar)
router.put("/:id/estado", verificarLogin, verificarPermiso("EMPRESAS"), cambiarEstadoEmpresa);
// PUT: Actualizar empresa
router.put("/:id", verificarLogin, verificarPermiso("EMPRESAS"), actualizarEmpresa);
// GET: Mostrar formulario de actualización de empresa          
router.get("/:id/editar", verificarLogin, verificarPermiso("EMPRESAS"), mostrarFormularioEditarEmpresa);
// DELETE: Eliminar empresa (borrado lógico)
router.delete("/:id", verificarLogin, verificarPermiso("EMPRESAS"), eliminarEmpresa);

module.exports = router;
