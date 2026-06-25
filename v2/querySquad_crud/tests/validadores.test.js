
const {
    validarEmpresaFields,
    validarEmpleadoFields,
    validarActualizacionEmpleado,
    validarNovedadFields,
    validarActualizacionNovedad
} = require('../middlewares/validadores');

// ==========================================
// EMPRESAS
// ==========================================
describe('Testing Empresas: validarEmpresaFields', () => {

    test('Debe llamar a next() si todos los campos requeridos están presentes', () => {
        const req = {
            body: {
                nombre: 'Talento Evolutivo',
                cuit: '30-12345678-9',
                rubro: 'RRHH',
                emailContacto: 'contacto@talento.com',
                telefono: '12345678',
                direccion: 'Calle Falsa 123',
                personaContacto: 'Juan Perez'
            }
        };
        const res = {};
        const next = jest.fn(); 

        validarEmpresaFields(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
    });

    // Falta cuil, test correcto si devuelve 400 ya que captura el faltante 
    test('Debe devolver status 400 y un error si falta el CUIT', () => {
        const req = {
            body: {
                nombre: 'Talento Evolutivo',
                rubro: 'RRHH',
                emailContacto: 'contacto@talento.com',
                telefono: '12345678',
                direccion: 'Calle Falsa 123',
                personaContacto: 'Juan Perez'
            }
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        validarEmpresaFields(req, res, next);

        expect(next).not.toHaveBeenCalled(); 
        expect(res.status).toHaveBeenCalledWith(400); 
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: true }));
    });
});

// ==========================================
// EMPLEADOS
// ==========================================
describe('Testing Empleados: validarEmpleadoFields', () => {

    test('Debe permitir la creación si el empleado tiene todos sus datos', () => {
        const req = {
            body: {
                nombre: 'Ana',
                apellido: 'Gálvez',
                dni: '35123456',
                empresaId: '60d5ec49f1b2c8b1f8e4b5a1' // ID simulado de Mongo
            }
        };
        const res = {};
        const next = jest.fn(); 

        validarEmpleadoFields(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
    });

    //Falta DNI, test ok si retorna 400
    test('Debe bloquear la creación y devolver 400 si falta el DNI', () => {
        const req = {
            body: {
                nombre: 'Ana',
                apellido: 'Gálvez',
                empresaId: '60d5ec49f1b2c8b1f8e4b5a1'
            }
        };
        
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        validarEmpleadoFields(req, res, next);
        expect(next).not.toHaveBeenCalled(); 
        expect(res.status).toHaveBeenCalledWith(400); 
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ 
            error: true,
            mensaje: expect.stringContaining("Por favor complete todos los campos requeridos")
        }));
    });
});

// ==========================================
// ACTUALIZACION EMPLEADO
// ==========================================
describe('Testing: validarActualizacionEmpleado', () => {
    test('Debe pasar si se envía al menos un campo para actualizar', () => {
        const req = { 
            body: { 
                salario: 150000, 
                nombre: 'Ana María' 
            } 
        };
        const res = {};
        const next = jest.fn();
        validarActualizacionEmpleado(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
    });

    // sin datos
    test('Debe devolver 400 si el body no trae campos válidos', () => {
        const req = { 
            body: {} 
        }; 
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();
        validarActualizacionEmpleado(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
    });
});

// ==========================================
// NOVEDADES
// ==========================================
describe('Testing: validarNovedadFields', () => {
    test('Debe permitir la creación si tiene todos los datos', () => {
        const req = { 
            body: { 
                empleadoId: '123', 
                tipo: 'Licencia', 
                descripcion: 'Enfermedad', 
                fecha: '2026-10-15' 
            } 
        };
        const res = {};
        const next = jest.fn();
        validarNovedadFields(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
    });

    test('Debe bloquear y devolver 400 si falta la descripción', () => {
        const req = { 
            body: { 
                empleadoId: '123', 
                tipo: 'Licencia', 
                fecha: '2026-10-15'
            } 
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();
        validarNovedadFields(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
    });
});

// ==========================================
// ACT. NOVEDADES
// ==========================================
describe('Testing: validarActualizacionNovedad', () => {
    test('Debe permitir pasar si se envía solo el estado', () => {
        const req = { 
            body: { 
                estado: 'procesada' 
            } 
        };
        const res = {};
        const next = jest.fn();
        validarActualizacionNovedad(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
    });
    // sin datos para actualizar
    test('Debe bloquear y devolver 400 si el body está vacío', () => {
        const req = { 
            body: {} 
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();
        validarActualizacionNovedad(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
    });
});