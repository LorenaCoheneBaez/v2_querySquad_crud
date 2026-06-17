const SocioModel = require("../models/SociosSchema");
const { registrarAccion } = require("./auditoriaController");

const mostrarFormularioNuevoSocio = (req, res) => {
    res.render("nuevo-socio");
};


const crearSocio = async (req, res) => {

    const socio = new SocioModel(req.body);

    await socio.save();

    await registrarAccion(
        "Socio",
        "Alta",
        `Se registró al socio ${socio.nombre} ${socio.apellido}.`
    );

    res.redirect("/socios");

};

const listarSocios = async (req, res) => {
//Los datos coinciden con lo especificado en ing de software
    const socios =
        await SocioModel.find().lean();

    res.render("listado-socios", {
        socios
    });

};

const actualizarSocio = async (req, res) => {

    const socio =
        await SocioModel.findById(req.params.id);

    Object.assign(socio, req.body);

    await socio.save();

    await registrarAccion(
        "Socio",
        "Modificación",
        `Se modificó el socio ${socio.nombre} ${socio.apellido}.`
    );

    res.redirect("/socios");

};

//Baja lógica
const eliminarSocio = async (req, res) => {

    const socio =
        await SocioModel.findById(req.params.id);

    socio.activo = false;

    await socio.save();

    await registrarAccion(
        "Socio",
        "Baja",
        `Se realizó la baja lógica del socio ${socio.nombre} ${socio.apellido}.`
    );

    res.redirect("/socios");

};

module.exports = {
    crearSocio,
    listarSocios,
    mostrarFormularioNuevoSocio,
    //mostrarFormularioEditarSocio,
    actualizarSocio,
    eliminarSocio
};