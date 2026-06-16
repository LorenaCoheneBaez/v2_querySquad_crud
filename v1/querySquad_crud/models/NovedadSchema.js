const mongoose = require("mongoose");

const novedadSchema = new mongoose.Schema({

    empleadoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Empleado",
        required: true
    },

    tipo: {
        type: String,
        required: [true, "El tipo es obligatorio"],
        trim: true
    },

    descripcion: {
        type: String,
        required: [true, "La descripción es obligatoria"],
        trim: true
    },

    fecha: {
        type: Date,
        required: [true, "La fecha es obligatoria"]
    },

    estado: {
        type: String,
        enum: ["pendiente", "procesada", "rechazada"],
        default: "pendiente"
    },

    activo: {
        type: Boolean,
        default: true
    }

}, { timestamps: true, collection: 'novedades' });

module.exports =
    mongoose.models.Novedad ||
    mongoose.model("Novedad", novedadSchema);