const AuditoriaModel = require("../models/AuditoriaSchema");

const registrarAccion = async (entidad, operacion, detalle) => {
    try {
        const nuevoLog = new AuditoriaModel({ entidad, operacion, detalle });
        await nuevoLog.save();
        console.log(`[AUDITORÍA] Registro guardado con éxito: ${operacion} en ${entidad}`);
    } catch (error) {
        console.error("Error crítico al registrar log de auditoría:", error.message);
    }
};

// GET
const listarAuditoria = async (req, res) => {
    try {
        // Traemos los registros ordenados desde el más reciente al más antiguo
        const historial = await AuditoriaModel.find().sort({ createdAt: -1 }).lean();
        
        res.render("listado-auditoria", { 
            historial,
            activePage: 'auditoria'
        });
    } catch (error) {
        console.error("Error al listar historial de auditoría:", error);
        res.status(500).send("Error interno al cargar el módulo de auditoría.");
    }
};

const obtenerAuditoriaJSON = async (req, res) => {
    const historial = await AuditoriaModel.find().sort({ createdAt: -1 }).lean();
    res.json({ auditoria: historial });
};

module.exports = {
    registrarAccion,
    listarAuditoria, 
    obtenerAuditoriaJSON
};