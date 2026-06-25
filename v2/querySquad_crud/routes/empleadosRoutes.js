const express = require("express");
const router = express.Router();
const EmpresaModel = require("../models/EmpresaSchema");
const { validarActualizacionEmpleado, validarEmpleadoFields } = require("../middlewares/validadores");

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
router.get("/", listarEmpleados);
// GET: Form nuevo empleado
router.get("/nuevo", async (req, res) => {
    try {
        const empresas = await EmpresaModel.find({ activo: true }).lean();
        res.render("nuevo-empleado", { empresas });
    } catch (error) {
        console.error("Error al cargar formulario de nuevo empleado:", error);
        res.status(500).send("Error al cargar las empresas disponibles.");
    }
});
// GET: Listar empleados (API)
router.get("/api", obtenerEmpleados);
// GET: Obtener empleado por ID (API)
router.get("/api/:id", obtenerEmpleadoPorId);
// GET: Form actualizar empleado
router.get("/actualizar/:id", mostrarFormularioActualizar);
// PUT: Actualizar empleado
router.put("/:id", validarActualizacionEmpleado, actualizarEmpleado);
// DELETE: Eliminar empleado
router.delete("/:id", eliminarEmpleado);
// GET: Obtener empleado por ID (API)
router.get("/:id", obtenerEmpleadoPorId);
// POST: Crear nuevo empleado
router.post("/", validarEmpleadoFields, crearEmpleado);

module.exports = router;
