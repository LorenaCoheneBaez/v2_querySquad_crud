const NovedadModel = require("../models/NovedadSchema");
const EmpleadoModel = require("../models/EmpleadoSchema");
const EmpresaModel = require("../models/EmpresaSchema");
const { registrarAccion } = require("./auditoriaController");

// Función auxiliar para detectar si la petición viene de Postman o pide JSON
const isApiRequest = (req) => {
    return (req.headers['user-agent'] && req.headers['user-agent'].includes('Postman')) || 
           (req.headers.accept && req.headers.accept.includes('application/json'));
};

// GET: Listar novedades (vista o JSON)
const listarNovedades = async (req, res, next) => {
    try {
        const { estado, empresaId, estadoActivo } = req.query;

        let filtroNovedades = {};

        if (estadoActivo === 'inactivas') {
            filtroNovedades.activo = false;
        } else if (estadoActivo === 'todas') {
            // No filtramos por activo, trae ambas
        } else {
            filtroNovedades.activo = true; // Por defecto solo activas
        }

        if (estado) {
            filtroNovedades.estado = estado;
        }

        if (empresaId) {
            const empleadosFiltrados = await EmpleadoModel.find({ empresaId: empresaId }).select('_id');
            const idsEmpleados = empleadosFiltrados.map(emp => emp._id);
            filtroNovedades.empleadoId = { $in: idsEmpleados };
        }

        const novedades = await NovedadModel.find(filtroNovedades)
            .populate({
                path: 'empleadoId',
                populate: { path: 'empresaId' }
            })
            .lean();

        // Empresas activas para el filtro de empresas
        const empresasActivas = await EmpresaModel.find({ activo: true }).lean();
        
        // Empleados para el alta, populados para mostrar su empresa
        const empleados = await EmpleadoModel.find({ activo: true }).populate('empresaId').lean();
        
        // Filtramos empleados que tengan una empresa activa y seteamos el nombre para la vista
        const empleadosConEmpresaActiva = empleados
            .filter(emp => emp.empresaId && emp.empresaId.activo === true)
            .map(emp => ({
                ...emp,
                empresaNombre: emp.empresaId.nombre
            }));

        if (isApiRequest(req)) {
            return res.status(200).json(novedades);
        }

        res.render("listado-novedades", {
            novedades: novedades,
            empresas: empresasActivas,
            empleados: empleadosConEmpresaActiva,
            query: req.query,
        });
    } catch (error) {
        console.error("Error al listar novedades:", error);
        next(error);
    }
};

// POST: Crear novedad 
const crearNovedad = async (req, res, next) => {
    try {
        // Agregamos valorImpacto para liquidar
        const { empleadoId, tipo, descripcion, fecha, estado, valorImpacto } = req.body;

        const empleadoExiste = await EmpleadoModel.findById(empleadoId);
        if (!empleadoExiste) {
            return res.status(404).json({
                mensaje: "Empleado no encontrado"
            });
        }

        const nuevaNovedad = new NovedadModel({
            empleadoId,
            tipo,
            descripcion,
            fecha,
            estado: estado || "pendiente",
            valorImpacto: Number(valorImpacto) || 0
        });

        await nuevaNovedad.save();

        await registrarAccion('Novedad', 'Alta', `Se registró una novedad tipo "${tipo}" para el empleado con ID Mongo ${empleadoId}.`);

        if (isApiRequest(req)) {
            return res.status(201).json({
                mensaje: "Novedad creada correctamente",
                novedad: nuevaNovedad
            });
        }

        return res.redirect("/novedades?msg=created");

    } catch (error) {
        console.error("Error al crear novedad:", error);
        return next(error);
    }
};

// GET: Mostrar formulario editar
const mostrarFormularioEditarNovedad = async (req, res, next) => {
    try {
        const novedad = await NovedadModel.findById(req.params.id).populate('empleadoId').lean();
        if (!novedad) {
            return res.status(404).send("Novedad no encontrada");
        }
        res.render("editar-novedad", { novedad });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// PUT: Actualizar novedad
// PUT: Actualizar novedad
const actualizarNovedad = async (req, res, next) => {
    try {
        // Agregamos valorImpacto aquí
        const { tipo, descripcion, fecha, estado, valorImpacto } = req.body;
        const novedad = await NovedadModel.findById(req.params.id);

        if (!novedad) {
            return res.status(404).send("Novedad no encontrada");
        }

        novedad.tipo = tipo;
        novedad.descripcion = descripcion;
        novedad.fecha = fecha;
        novedad.estado = estado;
        novedad.valorImpacto = Number(valorImpacto) || 0;

        await novedad.save();
        await registrarAccion('Novedad', 'Modificación', `Se actualizó la novedad ID ${novedad._id.toString().slice(-5).toUpperCase()}`);

        if (isApiRequest(req)) {
            return res.status(200).json({
                mensaje: "Novedad modificada exitosamente",
                novedad: novedad
            });
        }

        res.redirect("/novedades?msg=updated");
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// DELETE: Eliminar novedad (baja lógica)
const eliminarNovedad = async (req, res, next) => {
    try {
        const novedad = await NovedadModel.findById(req.params.id);
        if (!novedad) {
            return res.status(404).send("Novedad no encontrada");
        }
        
        novedad.activo = false;
        await novedad.save();
        await registrarAccion('Novedad', 'Baja', `Se eliminó (baja lógica) la novedad ID ${novedad._id.toString().slice(-5).toUpperCase()}`);
        
        if (isApiRequest(req)) {
            return res.status(200).json({
                mensaje: "Novedad desactivada exitosamente",
                novedad: novedad
            });
        }

        res.redirect("/novedades?msg=deleted");
    } catch (error) {
        console.error(error);
        next(error);
    }
};

module.exports = {
    listarNovedades,
    crearNovedad,
    mostrarFormularioEditarNovedad,
    actualizarNovedad,
    eliminarNovedad
};