const express = require("express");
const router = express.Router();
const EmpresaModel = require("../models/EmpresaSchema");
const { validarActualizacionEmpleado, validarEmpleadoFields } = require("../middlewares/validadores");
const { verificarPermiso, verificarLogin } = require("../middlewares/verificarPermiso");

const {
    obtenerEmpleados,
    obtenerEmpleadoPorId,
    actualizarEmpleado,
    mostrarFormularioActualizar,
    listarEmpleados,
    eliminarEmpleado,
    crearEmpleado
} = require("../controllers/empleadosController");

// GET: Listar empleados
router.get("/", verificarLogin, verificarPermiso("EMPLEADOS"), listarEmpleados);
// GET: Form nuevo empleado
router.get("/nuevo", verificarLogin, verificarPermiso("EMPLEADOS"), async (req, res) => {
    try {
        const empresas = await EmpresaModel.find({ activo: true }).lean();
        res.render("nuevo-empleado", { empresas });
    } catch (error) {
        console.error("Error al cargar formulario de nuevo empleado:", error);
        res.status(500).send("Error al cargar las empresas disponibles.");
    }
});
// GET: Listar empleados (API)
router.get("/api", verificarLogin, verificarPermiso("EMPLEADOS"), obtenerEmpleados);
// GET: Obtener empleado por ID (API)
router.get("/api/:id", verificarLogin, verificarPermiso("EMPLEADOS"), obtenerEmpleadoPorId);
// GET: Form actualizar empleado
router.get("/actualizar/:id", verificarLogin, verificarPermiso("EMPLEADOS"), mostrarFormularioActualizar);
// PUT: Actualizar empleado
router.put("/:id", verificarLogin, verificarPermiso("EMPLEADOS"), validarActualizacionEmpleado, actualizarEmpleado);
// DELETE: Eliminar empleado
router.delete("/:id", verificarLogin, verificarPermiso("EMPLEADOS"), eliminarEmpleado);
// GET: Obtener empleado por ID (API)
router.get("/:id", verificarLogin, verificarPermiso("EMPLEADOS"), obtenerEmpleadoPorId);
// POST: Crear nuevo empleado
router.post("/", verificarLogin, verificarPermiso("EMPLEADOS"), validarEmpleadoFields, crearEmpleado);

module.exports = router;
