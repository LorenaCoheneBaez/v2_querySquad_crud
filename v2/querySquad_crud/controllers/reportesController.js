const ErrorLog = require('../models/ErrorLogSchema');

const reportesController = {
    obtenerDashboardErrores: async (req, res) => {
        try {
            // Obtener el total de errores
            const totalErrores = await ErrorLog.countDocuments();

            // Agrupar por tipo de error
            const erroresPorTipo = await ErrorLog.aggregate([
                { $group: { _id: "$tipo", total: { $sum: 1 } } },
                { $sort: { total: -1 } }
            ]);

            // Obtener los 10 errores más recientes
            const erroresRecientes = await ErrorLog.find()
                .sort({ createdAt: -1 })
                .limit(10);

            res.render('dashboard-errores', {
                totalErrores,
                erroresPorTipo,
                erroresRecientes,
                activePage: 'reportes',
                // Si la sesión tiene un usuario, pasarlo a la vista (por el navbar de tus compañeras)
                usuario: req.session && req.session.usuario ? req.session.usuario : null
            });

        } catch (error) {
            console.error("Error al generar el dashboard de reportes:", error);
            res.status(500).send("Ocurrió un error al cargar el panel de reportes.");
        }
    }
};

module.exports = reportesController;
