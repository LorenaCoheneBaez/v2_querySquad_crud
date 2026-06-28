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
        if (res.statusCode >= 400 || (body && body.error === true)) {
            if (!req._errorLogged) {
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
                req._errorLogged = true;
            }
        }
        originalJson.call(this, body);
    };

    // Interceptar res.send (para controladores que usan res.send con errores de texto)
    const originalSend = res.send;
    res.send = function (body) {
        if (res.statusCode >= 400 && !req._errorLogged) {
            let tipoError = res.statusCode >= 500 ? 'Interno' : 'Validación';
            let mensajeError = typeof body === 'string' ? body : 'Error desconocido';
            
            // Ignoramos si el body es un JSON stringificado que no pudimos atrapar antes, o lo intentamos parsear
            if (typeof body === 'string' && body.includes('error')) {
                try {
                    const parsed = JSON.parse(body);
                    mensajeError = parsed.mensaje || parsed.error || body;
                } catch(e) {}
            }

            ErrorLog.create({
                tipo: tipoError,
                mensaje: mensajeError,
                ruta: req.originalUrl,
                metodo: req.method
            }).catch(err => console.log('Fallo al guardar log de error (send)', err.message));
            req._errorLogged = true;
        }
        originalSend.call(this, body);
    };

    next();
};
