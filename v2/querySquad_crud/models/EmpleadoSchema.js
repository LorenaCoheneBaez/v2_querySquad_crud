const mongoose = require('mongoose');

const empleadoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true,
        minlength: [3, 'El nombre debe tener al menos 3 caracteres']
    },
    apellido: {
        type: String,
        required: [true, 'El apellido es obligatorio'],
        trim: true,
        minlength: [3, 'El apellido debe tener al menos 3 caracteres']
    },
    dni: {
        type: String,
        required: [true, 'El DNI es obligatorio'],
        unique: true,
        match: [/^\d{7,8}$/, 'El DNI debe ser válido (7-8 dígitos)']
    },
    empresaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Empresa', //referencia al esquema Empresa
        required: [true, 'La empresa es obligatoria']
    },
    salario: {
        type: Number,
        required: false,
        min: [0, 'El salario no puede ser negativo']
    },
    activo: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Empleado', empleadoSchema);