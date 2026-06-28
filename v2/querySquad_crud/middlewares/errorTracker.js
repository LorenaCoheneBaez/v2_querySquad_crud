const ErrorLog = require('../models/ErrorLogSchema');

/**
 * Middleware para rastrear errores de manera silenciosa sin modificar los controladores.
 * Intercepta respuestas HTTP para detectar cuándo se enviaron errores o se renderizaron vistas de conflicto.
 */
module.exports = function errorTrackerMiddleware(req, res, next) {
    // Interceptar res.render
    const originalRender = res.render;
    res.render = function (view, options, fn) {
        // Las vistas de tus compañeras que denotan un error suelen llamarse 'error-...' o 'conflicto-...'
        if (view.includes('error-') || view.includes('conflicto-')) {
            ErrorLog.create({
                tipo: 'Conflicto de Negocio',
                mensaje: `Conflicto detectado en la vista: ${view}`,
                ruta: req.originalUrl,
                metodo: req.method
            }).catch(err => console.log('Fallo al guardar log de error (render)', err.message));
        }
        // Llamar a la función original de Express
        originalRender.call(this, view, options, fn);
    };

    // Interceptar res.json (para errores de API, middlewares de validación, etc.)
    const originalJson = res.json;
    res.json = function (body) {
        // Si el código de estado es 400 o superior, o si el body contiene una bandera de error
        if (res.statusCode >= 400 || (body && body.error === true)) {
            let tipoError = res.statusCode >= 500 ? 'Interno' : 'Validación';
            let mensajeError = body.mensaje || body.error || 'Error desconocido';
            
            if (typeof mensajeError !== 'string') {
                mensajeError = JSON.stringify(mensajeError);
            }

            ErrorLog.create({
                tipo: tipoError,
                mensaje: mensajeError,
                ruta: req.originalUrl,
                metodo: req.method
            }).catch(err => console.log('Fallo al guardar log de error (json)', err.message));
        }
        // Llamar a la función original de Express
        originalJson.call(this, body);
    };

    next();
};
