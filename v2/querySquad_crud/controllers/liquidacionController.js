const LiquidacionModel = require("../models/LiquidacionSchema");
const EmpleadoModel = require("../models/EmpleadoSchema");
const NovedadModel = require("../models/NovedadSchema");
const { registrarAccion } = require("./auditoriaController");

const crearLiquidacion = async (req, res) => {
    const { empleadoId, periodo } = req.body;

    const empleado = await EmpleadoModel.findById(empleadoId);

    const novedades = await NovedadModel.find({
        empleadoId,
        activo: true,
        estado: "procesada"
    });

    let monto = empleado.salario;

    const liquidacion = new LiquidacionModel({
        empleadoId,
        empresaId: empleado.empresaId,
        periodo,
        salarioBase: empleado.salario,
        montoLiquidado: monto,
        novedadesAplicadas: novedades.map(n => n._id)
    });

    await liquidacion.save();

    await registrarAccion(
        "Liquidacion",
        "Alta",
        `Se generó la liquidación del período ${periodo}.`
    );

    res.redirect("/liquidaciones");
};

const listarLiquidaciones = async (req, res) => {
    const liquidaciones = await LiquidacionModel
        .find({ activo: true })
        .populate("empleadoId")
        .populate("empresaId")
        .lean();
    res.render("listado-liquidaciones", {
        liquidaciones,
        query: req.query,
        activePage: "liquidaciones"
    });
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