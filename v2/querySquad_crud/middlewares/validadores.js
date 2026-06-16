// Middleware para validar empresa
const validarEmpresaFields = (req, res, next) => {
    console.log("[DEBUG] Cuerpo recibido en middleware:", req.body);
    const { nombre, cuit, rubro, emailContacto, telefono, direccion, personaContacto } = req.body;

    if (!nombre || !cuit || !rubro || !emailContacto || !telefono || !direccion || !personaContacto) {
        console.log("[DEBUG] Validación fallida. Campos presentes:", { nombre: !!nombre, cuit: !!cuit, rubro: !!rubro, email: !!emailContacto, tel: !!telefono, dir: !!direccion, cont: !!personaContacto });
        
        return res.status(400).json({
            error: true,
            mensaje: "Error de validación: Por favor complete todos los campos requeridos."
        });
    }
    console.log("[DEBUG] Validación superada, pasando al controlador.");
    next();
};

// Middleware para validar empleado
const validarEmpleadoFields = (req, res, next) => {
    const { nombre, apellido, dni, empresaId } = req.body;

    if (!nombre || !apellido || !dni || !empresaId) {
        return res.status(400).json({
            error: true,
            mensaje: "Error de validación: Por favor complete todos los campos requeridos (nombre, apellido, dni, empresaId)."
        });
    }

    next();
};

// Middleware para validar actualización de empleado
const validarActualizacionEmpleado = (req, res, next) => {
    const { nombre, apellido, dni, empresaId } = req.body;

    // Validar que al menos un campo esté presente
    if (!nombre && !apellido && !dni && !empresaId) {
        return res.status(400).json({
            error: true,
            mensaje: "Debe enviar al menos un campo para actualizar"
        });
    }

    next();
};
// Middleware para validar novedad
const validarNovedadFields = (req, res, next) => {
    const { empleadoId, tipo, descripcion, fecha } = req.body;

    if (!empleadoId || !tipo || !descripcion || !fecha) {
        return res.status(400).json({
            error: true,
            mensaje: "Error de validación: Por favor complete todos los campos requeridos (empleado, tipo, descripción, fecha)."
        });
    }

    next();
};

// Middleware para validar actualización de novedad
const validarActualizacionNovedad = (req, res, next) => {
    const { tipo, descripcion, fecha, estado } = req.body;

    // Validar que al menos un campo esté presente
    if (!tipo && !descripcion && !fecha && !estado) {
        return res.status(400).json({
            error: true,
            mensaje: "Debe enviar al menos un campo para actualizar la novedad."
        });
    }

    next();
};

module.exports = {
    validarEmpresaFields,
    validarEmpleadoFields,
    validarActualizacionEmpleado,
    validarNovedadFields,
    validarActualizacionNovedad
};
