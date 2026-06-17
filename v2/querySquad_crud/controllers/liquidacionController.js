const LiquidacionModel = require("../models/LiquidacionSchema");
const EmpleadoModel = require("../models/EmpleadoSchema");
const NovedadModel = require("../models/NovedadSchema");
const EmpresaModel = require("../models/EmpresaSchema");
const { registrarAccion } = require("./auditoriaController");

const crearLiquidacion = async (req, res) => {
    try {
        const { empleadoId, periodo } = req.body;

        const empleado = await EmpleadoModel.findById(empleadoId).populate("empresaId");

        if (!empleado) {
            return res.status(404).send("Empleado no encontrado");
        }
        if (empleado.salario === undefined || empleado.salario === null) {
            return res.status(400).send("El empleado no tiene un salario base asignado.");
        }
     //Con las novedades sumamos o restamos la liquidacion
        const novedades = await NovedadModel.find({
            empleadoId,
            activo: true,
            estado: "procesada",
            impactaLiquidacion: true
        });

        
        let montoBase = empleado.salario;
        let montoFinal = montoBase;
        //Se aplica el convenio en caso de corresponder
        if (empleado.empresaId && empleado.empresaId.convenioAplicable) {
            const cct = empleado.empresaId.convenioAplicable;

            if (cct.nombre) {
                const descuentoSindical = montoBase * (cct.aporteSindical / 100);
                const premioPresentismo = montoBase * (cct.adicionalPresentismo / 100);

                montoFinal = montoFinal + premioPresentismo - descuentoSindical;
            }
        }

        novedades.forEach(novedad => {
            if (novedad.tipoImpacto === "suma") {
                montoFinal += novedad.valorImpacto;
            } else if (novedad.tipoImpacto === "resta") {
                montoFinal -= novedad.valorImpacto;
            }
        });

        const liquidacion = new LiquidacionModel({
            empleadoId,
            empresaId: empleado.empresaId._id,
            periodo,
            salarioBase: montoBase,
            montoLiquidado: montoFinal,
            novedadesAplicadas: novedades.map(n => n._id)
        });

        await liquidacion.save();

        await registrarAccion(
            "Liquidacion",
            "Alta",
            `Se generó la liquidación del período ${periodo} para el empleado ID ${empleadoId}.`
        );

        res.redirect("/liquidaciones");

    } catch (error) {
        console.error("Error al crear liquidación:", error);
        res.status(500).send("Error interno al calcular la liquidación");
    }
};

const listarLiquidaciones = async (req, res) => {
    try {
        const { periodo, dni, empresa } = req.query;
        let filtroLiquidacion = { activo: true };

        // Limpiamos los inputs de espacios en blanco
        const periodoStr = periodo ? periodo.trim() : null;
        const dniStr = dni ? dni.trim() : null;
        const empresaStr = empresa ? empresa.trim() : null;

        // Filtro por período
        if (periodoStr) {
            filtroLiquidacion.periodo = { $regex: periodoStr, $options: "i" };
        }

        // Filtro por DNI del empleado
        if (dniStr) {
            const empleadosEncontrados = await EmpleadoModel.find({
                dni: { $regex: dniStr, $options: "i" }
            }).select("_id");

            if (empleadosEncontrados.length === 0) {
                // Si no existe el empleado, forzamos un resultado vacío
                filtroLiquidacion._id = "000000000000000000000000";
            } else {
                const idsEmpleados = empleadosEncontrados.map(emp => emp._id);
                filtroLiquidacion.empleadoId = { $in: idsEmpleados };
            }
        }

        // Filtro por Nombre de Empresa
        if (empresaStr) {
            const empresasEncontradas = await EmpresaModel.find({
                nombre: { $regex: empresaStr, $options: "i" }
            }).select("_id");

            if (empresasEncontradas.length === 0) {
                // Si no existe la empresa, forzamos un resultado vacío
                filtroLiquidacion._id = "000000000000000000000000";
            } else {
                const idsEmpresas = empresasEncontradas.map(emp => emp._id);
                filtroLiquidacion.empresaId = { $in: idsEmpresas };
            }
        }

        const liquidacionesRaw = await LiquidacionModel
            .find(filtroLiquidacion)
            .populate("empleadoId")
            .populate("empresaId")
            .populate("novedadesAplicadas")
            .lean();

        // Se calcula para mostrar en el detalle
        const liquidaciones = liquidacionesRaw.map(liq => {
            let deduccionSindical = 0;
            let premioPresentismo = 0;
            const empresaData = liq.empresaId;

            if (empresaData && empresaData.convenioAplicable && empresaData.convenioAplicable.nombre) {
                const cct = empresaData.convenioAplicable;
                deduccionSindical = liq.salarioBase * (cct.aporteSindical / 100);
                premioPresentismo = liq.salarioBase * (cct.adicionalPresentismo / 100);
            }

            return {
                ...liq,
                desglose: { deduccionSindical, premioPresentismo }
            };
        });

        res.render("listado-liquidaciones", {
            liquidaciones,
            query: req.query,
            activePage: "liquidaciones"
        });
    } catch (error) {
        console.error("Error en listarLiquidaciones:", error);
        res.status(500).send("Error interno");
    }
};

const actualizarLiquidacion = async (req, res) => {

    const liquidacion =
        await LiquidacionModel.findById(req.params.id);

    liquidacion.montoLiquidado =
        req.body.montoLiquidado;

    await liquidacion.save();

    await registrarAccion(
        "Liquidacion",
        "Modificación",
        `Se modificó la liquidación del período ${liquidacion.periodo}.`
    );

    res.redirect("/liquidaciones");

};

//Baja lógica
const eliminarLiquidacion = async (req, res) => {

    const liquidacion =
        await LiquidacionModel.findById(req.params.id);

    liquidacion.activo = false;

    await liquidacion.save();

    await registrarAccion(
        "Liquidacion",
        "Baja",
        `Se eliminó la liquidación del período ${liquidacion.periodo}.`
    );

    res.redirect("/liquidaciones");

};

module.exports = {
    crearLiquidacion,
    listarLiquidaciones,
    actualizarLiquidacion,
    eliminarLiquidacion,
};