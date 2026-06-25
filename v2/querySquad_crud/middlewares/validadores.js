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

//---- validaciones socio -------
const validarSocioFields = (req, res, next) => {
    const { nombre, apellido, dni, email, participacion } = req.body;

    if (!nombre || !apellido || !dni || !email || participacion === undefined) {
        return res.status(400).json({
            error: true,
            mensaje: "Error de validación: Faltan datos obligatorios del socio."
        });
    }
    next();
};

const validarActualizacionSocio = (req, res, next) => {
    const { nombre, apellido, dni, email, participacion, permisos, activo } = req.body;

    // Al menos un dato válido para actualizar
    if (!nombre && !apellido && !dni && !email && participacion === undefined && permisos === undefined && activo === undefined) {
        return res.status(400).json({
            error: true,
            mensaje: "Debe enviar al menos un campo válido para actualizar el socio."
        });
    }
    next();
};

//---- validaciones liquidacion -------
const validarLiquidacionFields = (req, res, next) => {
    const { empleadoId, periodo } = req.body;

    if (!empleadoId || !periodo) {
        return res.status(400).json({
            error: true,
            mensaje: "Error de validación: El empleado y el período son obligatorios."
        });
    }
    next();
};

const validarActualizacionLiquidacion = (req, res, next) => {
    const { montoLiquidado, activo, observaciones } = req.body;

    // Verifica que venga al menos un dato de los que permite el formulario de edición
    if (montoLiquidado === undefined && activo === undefined && observaciones === undefined) {
        return res.status(400).json({
            error: true,
            mensaje: "Debe enviar al menos un campo válido para actualizar la liquidación."
        });
    }
    next();
};
//----------------------------------------------

module.exports = {
    validarEmpresaFields,
    validarEmpleadoFields,
    validarActualizacionEmpleado,
    validarNovedadFields,
    validarActualizacionNovedad,
    validarSocioFields,
    validarActualizacionSocio,
    validarLiquidacionFields,
    validarActualizacionLiquidacion
};
