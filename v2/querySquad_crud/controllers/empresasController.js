const EmpresaModel = require("../models/EmpresaSchema");
const NovedadModel = require("../models/NovedadSchema");
const EmpleadoModel = require("../models/EmpleadoSchema");
const { registrarAccion } = require("./auditoriaController");

const crearEmpresa = async (req, res, next) => {
    
    console.log("Datos que llegaron al body:", req.body);

    try {
        const nuevaEmpresa = new EmpresaModel(req.body);
        await nuevaEmpresa.save(); 

        //auditoria
        await registrarAccion('Empresa', 'Alta', `Se registró la empresa "${nuevaEmpresa.nombre}" con CUIT ${nuevaEmpresa.cuit}.`);

        return res.redirect("/empresas?msg=created");

    } catch (error) {
        
        console.error("Detalles técnicos del fallo:", error.message);
        
        
        return next(error); 
    }
};

// GET: Mostrar el formulario nueva empresa
const mostrarFormularioNuevaEmpresa = (req, res) => {
    res.render("nueva-empresa"); 
};

// GET: Listado de empresas
const listarTodasEmpresas = async (req, res) => {
    try {
        const empresas = await EmpresaModel.find().lean();
        
        const empresasActivas = empresas.filter(e => e.activo).length;

        const novedadesActivas = await NovedadModel.countDocuments({ activo: true });
        
        //Calculo de carga operativa (resumen general)
        const minutosPorNovedad = 10;
        const totalMinutos = novedadesActivas * minutosPorNovedad;
        const horas = Math.floor(totalMinutos / 60);
        const minutosRestantes = totalMinutos % 60;

        const cargaOperativaTexto = horas > 0
            ? `${horas}h ${minutosRestantes}m`
            : `${totalMinutos} minutos`;

        res.render("listado-empresas", { 
            empresas, 
            query: req.query,
            indicadores: {
                empresasActivas,
                novedadesActivas,
                cargaOperativaTexto
            }
        });
    } catch (error) {
        console.error("Error al obtener las empresas:", error);
        res.status(500).send("Error interno al cargar las empresas");
    }
};

// GET: Listado de empresas activas
const listarEmpresasActivas = async (req, res) => {
    try {
        const empresasActivas = await EmpresaModel.find({ activo: true }).lean();
        res.render("listado-empresas-activas", {
            empresas: empresasActivas,
            query: req.query
        });
    } catch (error) {
        console.error("Error al obtener las empresas activas:", error);
        res.status(500).send("Error interno al cargar las empresas");
    }
};

// GET: Listado de empresas inactivas
const listarEmpresasInactivas = async (req, res) => {
    try {
        const empresasInactivas = await EmpresaModel.find({ activo: false }).lean();
        res.render("listado-empresas-inactivas", {
            empresas: empresasInactivas,
            query: req.query
        });
    } catch (error) {
        console.error("Error al obtener las empresas inactivas:", error);
        res.status(500).send("Error interno al cargar las empresas");
    }
};

const cambiarEstadoEmpresa = async (req, res) => {
    try {
        const empresa = await EmpresaModel.findById(req.params.id);

        if (!empresa) {
            return res.status(404).json({
                mensaje: "Empresa no encontrada"
            });
        }

        empresa.activo = !empresa.activo;
        //auditoria
        await registrarAccion('Empresa', 'Cambio de Estado', `Se realizó cambio de estado de la empresa "${empresa.nombre}", nuevo estado "${empresa.activo}"`);

        await empresa.save();

        res.redirect("/empresas?msg=status");

    } catch (error) {
        console.error(error);
        res.status(500).send("Error al cambiar estado");
    }
};

// PUT: Actualizar empresa
const actualizarEmpresa = async (req, res) => {
    try {

        const empresa = await EmpresaModel.findById(req.params.id);

        if (!empresa) {
            return res.status(404).json({
                mensaje: "Empresa no encontrada"
            });
        }

        const cuitExistente = await EmpresaModel.findOne({
            cuit: req.body.cuit,
            _id: { $ne: req.params.id }
        });

        if (cuitExistente) {
            return res.status(400).json({
                mensaje: "Ya existe otra empresa con ese CUIT"
            });
        }

        Object.assign(empresa, req.body);

        await empresa.save();
        //auditoria
        await registrarAccion('Empresa', 'Modificación', `Se realizó  modificación de la empresa "${empresa.nombre}"`)

        res.redirect("/empresas?msg=updated");

    } catch (error) {
        console.error(error);
        res.status(500).send("Error al actualizar empresa");
    }
};

// GET: Mostrar formulario editar empresa
const mostrarFormularioEditarEmpresa = async (req, res) => {
    try {
        const empresa = await EmpresaModel.findById(req.params.id).lean();

        if (!empresa) {
            return res.status(404).send("Empresa no encontrada");
        }

        res.render("editar-empresa", { empresa });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno");
    }
};

// DELETE: eliminar empresa
const eliminarEmpresa = async (req, res) => {
    try {
        const empresa = await EmpresaModel.findById(req.params.id);

        if (!empresa) {
            return res.status(404).json({
                mensaje: "Empresa no encontrada"
            });
        }

        //buscamos si hay empleados activos en esta empresa, no la dejamos borrar si existen
        const empleadosActivos = await EmpleadoModel.countDocuments({ 
            empresaId: empresa._id,
            activo: true 
        });
        if (empleadosActivos > 0) {
            return res.render("conflicto-empresa", {
                mensaje: `No se puede eliminar la empresa "${empresa.nombre}" porque actualmente tiene ${empleadosActivos} empleado(s) activo(s) asociado(s).`
            });
        }

        // si llega aca, no hay empelados activos para la misma ent dejo "borrar" de manera logica
        empresa.activo = false;
        //auditoria
        await registrarAccion('Empresa', 'Baja', `Se realizó la baja lógica de la empresa "${empresa.nombre}".`);

        await empresa.save();

        res.render("desactivar-empresa", {
            mensaje: "La empresa ha sido desactivada correctamente."
        });

    } catch (error) {
        console.error("Error al eliminar empresa:",error);
        res.status(500).send("Error interno");
    }
};

module.exports = {
    crearEmpresa,
    mostrarFormularioNuevaEmpresa,
    listarTodasEmpresas,
    listarEmpresasActivas,
    listarEmpresasInactivas,
    cambiarEstadoEmpresa,
    actualizarEmpresa,
    mostrarFormularioEditarEmpresa,
    eliminarEmpresa
};