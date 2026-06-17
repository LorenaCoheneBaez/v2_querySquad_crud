const mongoose = require('mongoose');

//Separado para poder eliminarlo ya que es opcional
const convenioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del convenio es obligatorio'],
        trim: true
    },
    aporteSindical: {
        type: Number,
        required: [true, 'El aporte sindical es obligatorio'],
        min: [0, 'El porcentaje no puede ser negativo']
    },
    adicionalPresentismo: {
        type: Number,
        required: [true, 'El adicional por presentismo es obligatorio'],
        min: [0, 'El porcentaje no puede ser negativo']
    }
}, { _id: false });

const empresaSchema = new mongoose.Schema({
    id: { type: Number },
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true,
        minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
        maxlength: [100, 'El nombre no debe exceder 100 caracteres']
    },
    cuit: {
        type: String,
        required: [true, 'El CUIT es obligatorio'],
        unique: true,
        match: [/^\d{2}-\d{8}-\d{1}$/, 'El formato del CUIT debe ser XX-XXXXXXXX-X']
    },
    rubro: {
        type: String,
        required: [true, 'El rubro es obligatorio'],
        trim: true
    },
    emailContacto: {
        type: String,
        required: [true, 'El email es obligatorio'],
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'El email debe ser válido']
    },
    telefono: {
        type: String,
        required: [true, 'El teléfono es obligatorio'],
        match: [/^[0-9+\-\s]+$/, 'El teléfono solo puede contener números, espacios, guiones o "+"']
    },
    direccion: {
        type: String,
        required: [true, 'La dirección es obligatoria'],
        trim: true
    },
    personaContacto: {
        type: String,
        required: [true, 'La persona de contacto es obligatoria'],
        trim: true
    },
    //Datos para liquidacion
    convenioAplicable: {
        type: convenioSchema,
        default: null
    },
    fechaAlta: {
        type: Date,
        default: Date.now
    },
    activo: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Empresa = mongoose.models.Empresa || mongoose.model('Empresa', empresaSchema);
module.exports = Empresa;