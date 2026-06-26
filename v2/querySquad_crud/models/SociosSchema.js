const mongoose = require("mongoose");
const { Schema } = mongoose;

const socioSchema = new Schema(
    {
        nombre: {
            type: String,
            required: true,
            trim: true,
        },
        apellido: {
            type: String,
            required: true,
            trim: true,
        },
        dni: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        rol: {
            type: String,
            enum: ["admin", "socio", "usuario"],
            default: "socio",
        },
        permisos: {
            type: [String],
            default: [],
        },
        activo: {
            type: Boolean,
            default: true,
        },
        "participación": {
            type: Number,
            default: 0,
        },
        "email": {
            type: String,
            required: true, 
            unique: true,
            trim: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,          
    }  
} 
);

const SocioModel = mongoose.model("Socio", socioSchema);

module.exports = SocioModel;