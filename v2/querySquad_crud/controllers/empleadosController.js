const mongoose = require("mongoose");

const EmpleadoModel = require("../models/EmpleadoSchema");
const EmpresaModel = require("../models/EmpresaSchema");
const { registrarAccion } = require("./auditoriaController");

const crearEmpleado = async (req, res) => {
    try {
        console.log("Datos recibidos del formulario:", req.body);
        const { nombre, apellido, dni, empresa, salario } = req.body;
        const empresaExiste = await EmpresaModel.findById(empresa);

        if (!empresaExiste) {
            return res.status(404).render("error-nuevo-empleado", {
                mensaje: "La empresa con ID " + empresaIdRecibido + " no existe en nuestra base de datos."
            });
        }

        const dniExistente = await EmpleadoModel.findOne({ dni: dni });
        if (dniExistente) {
            return res.status(400).render("error-nuevo-empleado", {
                mensaje: "Ya existe un empleado con el DNI " + dni
            });
        }

        const ultimoEmpleado = await EmpleadoModel.findOne().sort({ id: -1 });
        const nuevoId = ultimoEmpleado && ultimoEmpleado.id ? ultimoEmpleado.id + 1 : 1;

        const nuevoEmpleado = new EmpleadoModel({
            id: nuevoId,
            nombre,
            apellido,
            dni,
            empresaId: empresa,
            salario: parseFloat(salario),
            activo: true
        });
        await nuevoEmpleado.save();

        //auditoria
        await registrarAccion('Empleado', 'Alta', `Se registró al empleado ${nuevoEmpleado.nombre} ${nuevoEmpleado.apellido} (DNI: ${nuevoEmpleado.dni}).`);

        return res.redirect("/empleados?msg=created");

    } catch (error) {
        console.error("Error al crear empleado en MongoDB:", error.message);

        if (error.name === 'ValidationError') {
            const mensajes = Object.values(error.errors).map(err => err.message).join(', ');

            return res.status(400).render("error-nuevo-empleado", {
                mensaje: mensajes
            });
        }

        if (error.code === 11000) {
            return res.status(400).render("error-nuevo-empleado", {
                mensaje: "Ya existe un empleado registrado con ese DNI."
            });
        }

        return res.status(500).render("error-nuevo-empleado", {
            mensaje: "Error interno del servidor al intentar crear el empleado."
        });
    }
};

const obtenerEmpleados = async (req, res) => {
    try {
        const empleados = await EmpleadoModel.find({ activo: true }).populate("empresaId").lean();
        const empleadosConEmpresa = empleados.map(emp => {
            return {
                ...emp,
                nombreEmpresa: emp.empresaId ? emp.empresaId.nombre : "Sin empresa asignada",
                empresaActiva: emp.empresaId ? emp.empresaId.activo : false
            };
        });

        res.json(empleadosConEmpresa);
    } catch (error) {
        console.error("Error en la API de empleados:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

const obtenerEmpleadoPorId = async (req, res) => {
    try {
        const idParam = parseInt(req.params.id);
        const empleado = await EmpleadoModel.findOne({ id: idParam, activo: true }).lean();

        if (!empleado) {
            return res.status(404).json({ mensaje: "Empleado no encontrado o inactivo" });
        }

        const empresaAsociada = await EmpresaModel.findOne({ id: empleado.empresaId }).lean();
        empleado.nombreEmpresa = empresaAsociada ? empresaAsociada.nombre : "Empresa no encontrada";

        res.json(empleado);
    } catch (error) {
        console.error("Error al obtener empleado por ID:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

// GET: Mostrar formulario de actualización
const mostrarFormularioActualizar = async (req, res, next) => {

    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send("ID inválido");
        }

        const empleado = await EmpleadoModel
            .findById(id)
            .populate("empresaId");

        if (!empleado) {
            return res.status(404).send("Empleado no encontrado");
        }

        let queryEmpresas = { activo: true };
        if (empleado.empresaId) {
            queryEmpresas = {
                $or: [
                    { activo: true },
                    { _id: empleado.empresaId._id }
                ]
            };
        }

        const empresas = await EmpresaModel
            .find(queryEmpresas)
            .lean();

        if (!empleado) {
            return res.status(404).send(
                "Empleado no encontrado"
            );
        }

        return res.render("actualizar-empleado", {
            empleado,
            empresas
        });

    } catch (error) {

        console.error(error);

        next(error);
    }
};

// PUT: Actualizar empleado por ID
const actualizarEmpleado = async (req, res, next) => {
    try {

        let {
            nombre,
            apellido,
            dni,
            salario,
            empresaId
        } = req.body;

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).render(
                "actualizar-empleado",
                {
                    error: "ID inválido",
                    empleado: {},
                    empresas: []
                }
            );
        }

        const empleado = await EmpleadoModel.findById(id);


        if (!empleado) {
            return res.status(404).render(
                "actualizar-empleado",
                {
                    error: "Empleado no encontrado",
                    empleado: {},
                    empresas
                }
            );
        }

        if (dni) {
            dni = dni.replace(/\./g, '').trim();
        }

        let queryEmpresas = { activo: true };
        if (empleado.empresaId) {
            queryEmpresas = {
                $or: [
                    { activo: true },
                    { _id: empleado.empresaId } // Aquí NO está populado, usamos el campo directo
                ]
            };
        }

        const empresas = await EmpresaModel
            .find(queryEmpresas)
            .lean();

        let salarioNumerico = 0;
        if (salario) {
            const salarioLimpio = salario.toString().replace(/,/g, '.').trim();
            salarioNumerico = Number(salarioLimpio);
        }

        // validar dni
        if (dni && dni !== empleado.dni) {

            const dniExistente =
                await EmpleadoModel.findOne({
                    dni,
                    _id: { $ne: empleado._id }
                });

            if (dniExistente) {
                return res.status(400).render(
                    "actualizar-empleado",
                    {
                        error:
                            "El DNI ya pertenece a otro empleado",
                        empleado: empleado.toObject(),
                        empresas
                    }
                );
            }
        }

        // validar empresa
        if (empresaId && empresaId !== "") {
            if (!mongoose.Types.ObjectId.isValid(empresaId)) {
                return res.status(400).render("actualizar-empleado", {
                    error: "Empresa inválida",
                    empleado: empleado.toObject(),
                    empresas
                });
            }

            const empresaExiste = await EmpresaModel.findById(empresaId);
            if (!empresaExiste) {
                return res.status(404).render("actualizar-empleado", {
                    error: "Empresa no encontrada",
                    empleado: empleado.toObject(),
                    empresas
                });
            }
            empleado.empresaId = empresaId;
        }

        let salarioFinal = empleado.salario;

        if (salario !== undefined && salario !== "") {
            const salarioLimpio = salario.toString().replace(/,/g, '.').trim();
            salarioFinal = Number(salarioLimpio);
        }

        empleado.nombre = nombre;
        empleado.apellido = apellido;
        empleado.dni = dni;
        empleado.set('salario', salarioFinal);

        empleado.markModified('salario');
        await empleado.save();

         //auditoria
        await registrarAccion('Empleado', 'Modificación', `Se modifico al empleado ${empleado.nombre} ${empleado.apellido} (DNI: ${empleado.dni}).`);


        return res.redirect("/empleados?msg=updated");

    } catch (error) {
        console.error("Error en actualizarEmpleado:", error);
        next(error);
    }
};

const eliminarEmpleado = async (req, res) => {

    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                mensaje: "ID inválido"
            });
        }

        const empleado = await EmpleadoModel.findOne({ _id: id });

        if (!empleado) {
            return res.status(404).json({
                mensaje: "Empleado no encontrado"
            });
        }

        // Borrado lógico
        empleado.activo = false;

        await empleado.save();

         //auditoria
        await registrarAccion('Empleado', 'Baja', `Se registró baja del empleado ${empleado.nombre} ${empleado.apellido} (DNI: ${empleado.dni}).`);


        return res.redirect(
            "/empleados?msg=deleted"
        );

    } catch (error) {

        console.error(
            "Error al eliminar empleado:",
            error
        );

        return res.status(500).json({
            mensaje: "Error interno del servidor"
        });
    }
};


const listarEmpleados = async (req, res) => {
    try {
        const { nombre } = req.query;
        let filtro = { activo: true };

        if (nombre) {
            filtro.$or = [
                { nombre: { $regex: nombre, $options: "i" } },
                { apellido: { $regex: nombre, $options: "i" } }
            ];
        }
        const empleados = await EmpleadoModel.find(filtro).lean();
        const empresas = await EmpresaModel.find().lean();
        const empleadosConEmpresa = empleados.map(emp => {
            const empresa = empresas.find(e => String(e._id) === String(emp.empresaId));
            return {
                ...emp,
                nombreEmpresa: empresa ? empresa.nombre : "Sin empresa",
                empresaActiva: empresa ? empresa.activo : null
            };
        });
        res.render("listado-empleado", {
            empleados: empleadosConEmpresa,
            query: req.query
        });
    } catch (error) {
        console.error("Error al listar empleados:", error);
        res.status(500).send("Error interno al cargar el listado de empleados.");
    }
};

module.exports = {
    crearEmpleado,
    obtenerEmpleados,
    obtenerEmpleadoPorId,
    actualizarEmpleado,
    mostrarFormularioActualizar,
    eliminarEmpleado,
    listarEmpleados
};