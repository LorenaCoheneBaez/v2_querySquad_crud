const mongoose = require("mongoose");
const fs = require("fs").promises;
const path = require("path");

const EmpresaModel = require("./models/EmpresaSchema");
const EmpleadoModel = require("./models/EmpleadoSchema");
const NovedadModel = require("./models/NovedadSchema");

const MONGO_URI = "mongodb://127.0.0.1:27017/query_squad_db";

const migrarDatos = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Conectado a MongoDB");

        //empresas
        const rutaEmpresas = path.join(__dirname, "./data/empresas.json");
        const dataEmpresas = await fs.readFile(rutaEmpresas, "utf-8");
        const empresasJson = JSON.parse(dataEmpresas);

        await EmpresaModel.deleteMany({});
        console.log("Colección de empresas limpiada");

        const empresasInsertadas = await EmpresaModel.insertMany(empresasJson);
        console.log("Migración de empresas completada");

        const diccionarioEmpresas = {};
        empresasInsertadas.forEach(emp => {
            diccionarioEmpresas[emp.id] = emp._id;
        });//para poder convertir los ids

        //empleados
        const rutaEmpleados = path.join(__dirname, "./data/empleados.json");
        const dataEmpleados = await fs.readFile(rutaEmpleados, "utf-8");
        const empleadosJson = JSON.parse(dataEmpleados);

        await EmpleadoModel.deleteMany({});
        console.log("Colección de empleados limpiada");

        const empleadosBD = empleadosJson.map(emp => ({
            ...emp,
            empresaId: diccionarioEmpresas[emp.empresaId]
        }));
        
        await EmpleadoModel.insertMany(empleadosBD);
        console.log("Migración de empleados completada con éxito");

        //novedades
        const rutaNovedades = path.join(__dirname, "./data/novedades.json");
        const dataNovedades = await fs.readFile(rutaNovedades, "utf-8");
        const novedadesJson = JSON.parse(dataNovedades);

        await NovedadModel.deleteMany({});
        console.log("Colección de novedades limpiada");

        await NovedadModel.insertMany(novedadesJson);
        console.log("Migración de novedades completada con éxito");

        // Cerrar conexión
        mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error("Error durante la migración:", error);
        process.exit(1);
    }
};

migrarDatos();