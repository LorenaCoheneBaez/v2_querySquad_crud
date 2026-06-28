const mongoose = require('mongoose');

const errorLogSchema = new mongoose.Schema({
    tipo: {
        type: String,
        required: true,
        enum: ['Validación', 'Conflicto de Negocio', 'Interno', 'Otro'],
        default: 'Otro'
    },
    mensaje: {
        type: String,
        required: true
    },
    ruta: {
        type: String,
        default: 'Desconocida'
    },
    metodo: {
        type: String,
        default: 'Desconocido'
    }
}, { timestamps: true });

module.exports = mongoose.models.ErrorLog || mongoose.model('ErrorLog', errorLogSchema);
