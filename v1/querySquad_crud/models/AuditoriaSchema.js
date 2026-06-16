const mongoose = require('mongoose');

const auditoriaSchema = new mongoose.Schema({
    entidad: { 
        type: String, 
        required: true,
        enum: ['Empresa', 'Empleado', 'Novedad'] //vr cuando agreguemos liquidaciones y socios
    },
    operacion: { 
        type: String, 
        required: true,
        enum: ['Alta', 'Modificación', 'Baja', 'Cambio de Estado'] 
    },
    detalle: { 
        type: String, 
        required: true 
    },
    usuario: { 
        type: String, 
        default: 'usuario'}
}, 
{ timestamps: true }); 

module.exports = mongoose.model('Auditoria', auditoriaSchema);