// Middleware de manejo de errores
const manejarErrores = (err, req, res, next) => {
    console.error('Error:', err);

    // Errores de validación de Mongoose
    if (err.name === 'ValidationError') {
        const mensajes = Object.values(err.errors)
            .map(error => error.message)
            .join(', ');

        return res.status(400).json({
            error: true,
            mensaje: `Error de validación: ${mensajes}`
        });
    }

    // Error de CUIT/DNI duplicado
    if (err.code === 11000) {
        const campo = Object.keys(err.keyPattern)[0];
        return res.status(400).json({
            error: true,
            mensaje: `Error: El ${campo} ya existe en la base de datos`
        });
    }

    // Error de ID inválido
    if (err.name === 'CastError') {
        return res.status(400).json({
            error: true,
            mensaje: 'Error: ID inválido'
        });
    }

    // Error genérico
    res.status(err.status || 500).json({
        error: true,
        mensaje: err.mensaje || 'Error interno del servidor',
        detalles: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};

module.exports = manejarErrores;
