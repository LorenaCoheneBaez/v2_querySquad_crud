const SocioModel = require("../models/SociosSchema");
const { registrarAccion } = require("./auditoriaController");
const bcrypt = require("bcryptjs");

const mostrarFormularioNuevoSocio = (req, res) => {
    res.render("nuevo-socio");
};

const crearSocio = async (req, res) => {
    try {


        if (req.body.permisos) {
            req.body.permisos = Array.isArray(req.body.permisos)
                ? req.body.permisos
                : [req.body.permisos];
        } else {
            req.body.permisos = [];
        }

        const passwordHash = await bcrypt.hash(
            req.body.password,
            10
        );

        const participacion = req.body.participacion !== undefined
            ? Number(req.body.participacion)
            : 0;

        const socio = new SocioModel({
            ...req.body,
            password: passwordHash,
            participacion
        });

        await socio.save();

        await registrarAccion(
            "Socio",
            "Alta",
            `Se registró al socio ${socio.nombre} ${socio.apellido}.`
        );

        res.redirect("/socios?msg=created");

    } catch (error) {
        console.error("Error al crear socio:", error);
        res.status(500).send("Error interno al crear el socio");
    }

};

const listarSocios = async (req, res) => {
    try {
        const { dni } = req.query;
        let filtro = {};


        if (dni) {
            filtro.dni = { $regex: dni.trim(), $options: "i" };
        }

        const socios = await SocioModel.find(filtro).lean();

        res.render("listado-socios", {
            socios,
            query: req.query
        });

    } catch (error) {
        console.error("Error al listar socios:", error);
        res.status(500).send("Error interno");
    }

};

const mostrarFormularioEditarSocio = async (req, res) => {
    try {

        const socio = await SocioModel.findById(req.params.id).lean();

        if (!socio) {
            return res.status(404).send("Socio no encontrado");
        }

        res.render("editar-socio", { socio });

    } catch (error) {
        console.error("Error al cargar edición:", error);
        res.status(500).send("Error interno");
    }

};

const actualizarSocio = async (req, res) => {
    try {

        const socio = await SocioModel.findById(req.params.id);

        if (!socio) {
            return res.status(404).send("Socio no encontrado");
        }

        if (req.body.activo !== undefined) {
            req.body.activo = req.body.activo === "true";
        }

        if (req.body.permisos) {
            req.body.permisos = Array.isArray(req.body.permisos)
                ? req.body.permisos
                : [req.body.permisos];
        } else {
            req.body.permisos = [];
        }

        if (req.body.password && req.body.password.trim() !== "") {

            req.body.password = await bcrypt.hash(
                req.body.password,
                10
            );

        } else {

            delete req.body.password;

        }

        if (req.body.participacion !== undefined && req.body.participacion !== "") {
            req.body.participacion = Number(req.body.participacion);
        }

        Object.assign(socio, req.body);

        await socio.save();

        await registrarAccion(
            "Socio",
            "Modificación",
            `Se modificó el socio ${socio.nombre} ${socio.apellido}. Nuevo estado: ${socio.activo ? 'Activo' : 'Inactivo'}.`
        );

        res.redirect("/socios?msg=updated");

    } catch (error) {
        console.error("Error al actualizar socio:", error);
        res.status(500).send("Error interno al actualizar");
    }

};

const eliminarSocio = async (req, res) => {
    try {

        const socio = await SocioModel.findById(req.params.id);

        if (!socio) {
            return res.status(404).send("Socio no encontrado");
        }

        socio.activo = false;

        await socio.save();

        await registrarAccion(
            "Socio",
            "Alta",
            "Se registró al socio " + socio.nombre + " " + socio.apellido + "."
        );

        res.redirect("/socios?msg=deleted");

    } catch (error) {
        console.error("Error al dar de baja socio:", error);
        res.status(500).send("Error interno al eliminar");
    }

};

module.exports = {
    crearSocio,
    listarSocios,
    mostrarFormularioNuevoSocio,
    mostrarFormularioEditarSocio,
    actualizarSocio,
    eliminarSocio
};
