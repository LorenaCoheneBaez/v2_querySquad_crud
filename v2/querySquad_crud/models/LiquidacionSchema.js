const mongoose = require('mongoose');

const liquidacionSchema = new mongoose.Schema({
    empleadoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Empleado",
        required: true
    },

    empresaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Empresa",
        required: true
    },

    periodo: {
        type: String,
        required: true
    },

    salarioBase: {
        type: Number,
        required: true
    },

    montoLiquidado: {
        type: Number,
        required: true
    },

    novedadesAplicadas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Novedad"
    }],

    // Cargas sociales
    jubilacion: {
        type: Number,
        default: 0
    },
    obraSocial: {
        type: Number,
        default: 0
    },

    observaciones: String,

    activo: {
        type: Boolean,
        default: true
    }

}, { timestamps: true });

const Liquidacion = mongoose.models.Liquidacion || mongoose.model('Liquidacion', liquidacionSchema);
module.exports = Liquidacion;