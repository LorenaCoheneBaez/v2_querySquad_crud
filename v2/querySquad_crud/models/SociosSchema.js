const mongoose = require("mongoose");

const socioSchema = new mongoose.Schema({

    nombre: {
        type: String,
        required: true,
        trim: true
    },

    apellido: {
        type: String,
        required: true,
        trim: true
    },

    dni: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true
    },

    usuario: {
    type: String,
    required: true,
    unique: true,
    },

    password: {
    type: String,
    required: true
    },

    participacion: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },

    permisos: [{
        type: String,
        enum: [
            "EMPRESAS",
            "EMPLEADOS",
            "NOVEDADES",
            "LIQUIDACIONES",
            "SOCIOS",
            "AUDITORIA"
        ]
    }],

    activo: {
        type: Boolean,
        default: true
    }

}, { timestamps: true });

module.exports =
    mongoose.models.Socio ||
    mongoose.model("Socio", socioSchema);