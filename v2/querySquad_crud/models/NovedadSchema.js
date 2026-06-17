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
        // Para facilitar las liquidaciones y la carga de novedades se establecen tipos fijos
        enum: {
            values: ["Licencia", "Tardanza", "Ausencia", "Sanción", "Bono", "Observación", "Cambio de puesto"],
            message: "{VALUE} no es un tipo de novedad válido"
        },
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
    },
    //Se agregan para realizar la liquidacion
    impactaLiquidacion: {
        type: Boolean,
        default: false
    },

    tipoImpacto: {
        type: String,
        enum: ["suma", "resta", "sin_impacto"],
        default: "sin_impacto"
    },

    valorImpacto: {
        type: Number,
        default: 0
    }

}, { timestamps: true, collection: 'novedades' });

novedadSchema.pre("save", function (next) {
    // Definimos el diccionario de reglas de negocio para realizar las liquidaciones a partir de las novedades
    const reglasNegocio = {
        "Licencia": { impacta: true, impacto: "resta" },
        "Tardanza": { impacta: true, impacto: "resta" },
        "Ausencia": { impacta: true, impacto: "resta" },
        "Sanción": { impacta: true, impacto: "resta" },
        "Bono": { impacta: true, impacto: "suma" },
        "Observación": { impacta: false, impacto: "sin_impacto" },
        "Cambio de puesto": { impacta: false, impacto: "sin_impacto" }
    };

    const regla = reglasNegocio[this.tipo];

    if (regla) {
        this.impactaLiquidacion = regla.impacta;
        this.tipoImpacto = regla.impacto;

        // Si no tiene impacto monetario, forzamos el valor a 0
        if (!regla.impacta) {
            this.valorImpacto = 0;
        }
    }

    next();
});

module.exports =
    mongoose.models.Novedad ||
    mongoose.model("Novedad", novedadSchema);