const mongoose = require("mongoose");
const fs = require("fs").promises;
const path = require("path");
const bcrypt = require("bcryptjs");

const EmpresaModel = require("./models/EmpresaSchema");
const EmpleadoModel = require("./models/EmpleadoSchema");
const NovedadModel = require("./models/NovedadSchema");
const SocioModel = require("./models/SociosSchema");
const LiquidacionModel = require("./models/LiquidacionSchema");

const MONGO_URI = "mongodb://127.0.0.1:27017/query_squad_db";

const migrarDatos = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Conectado a MongoDB");

        // Empresas
        const rutaEmpresas = path.join(__dirname, "./data/empresas.json");
        const dataEmpresas = await fs.readFile(rutaEmpresas, "utf-8");
        const empresasJson = JSON.parse(dataEmpresas);

        await EmpresaModel.deleteMany({});
        console.log("Colección de empresas limpiada");

        const empresasInsertadas = await EmpresaModel.insertMany(empresasJson);
        const diccionarioEmpresas = {};

        // Se asume que empresasJson sí respeta el mismo orden que lo insertado
        empresasInsertadas.forEach((emp, index) => {
            const originalId = empresasJson[index].id;
            diccionarioEmpresas[originalId] = emp._id;
        });
        console.log("Migración de empresas completada");

        // Empleados
        const rutaEmpleados = path.join(__dirname, "./data/empleados.json");
        const dataEmpleados = await fs.readFile(rutaEmpleados, "utf-8");
        const empleadosJson = JSON.parse(dataEmpleados);

        await EmpleadoModel.deleteMany({});
        console.log("Colección de empleados limpiada");

        const empleadosBD = empleadosJson.map(emp => ({
            ...emp,
            empresaId: diccionarioEmpresas[emp.empresaId]
        }));

        const empleadosInsertados = await EmpleadoModel.insertMany(empleadosBD);
        console.log("Migración de empleados completada con éxito");

        const diccionarioEmpleados = {};
        const mapaEmpleadosBD = {};

        // Extraemos el 'id' del JSON original para asegurar consistencia
        empleadosInsertados.forEach((emp, index) => {
            const originalId = empleadosJson[index].id;
            diccionarioEmpleados[originalId] = emp._id;
            mapaEmpleadosBD[emp._id.toString()] = emp;
        });

        // Novedades
        const rutaNovedades = path.join(__dirname, "./data/novedades.json");
        const dataNovedades = await fs.readFile(rutaNovedades, "utf-8");
        const novedadesJson = JSON.parse(dataNovedades);

        await NovedadModel.deleteMany({});
        console.log("Colección de novedades limpiada");
        await NovedadModel.insertMany(novedadesJson);
        console.log("Migración de novedades completada");

        // Socios
        const rutaSocios = path.join(__dirname, "./data/socios.json");
        const dataSocios = await fs.readFile(rutaSocios, "utf-8");
        const sociosJson = JSON.parse(dataSocios);

        await SocioModel.deleteMany({});
        console.log("Colección de socios limpiada");

        const sociosConHash = await Promise.all(
            sociosJson.map(async (socio) => {
                // Forzamos a que el password sea String porque bcrypt falla con números puros
                const passwordTexto = String(socio.password);
                const hashedPassword = await bcrypt.hash(passwordTexto, 10);

                return {
                    ...socio,
                    password: hashedPassword
                };
            })
        );

        await SocioModel.insertMany(sociosConHash);

        console.log("Migración de socios completada (con contraseñas encriptadas)");

        // Liquidaciones
        const rutaLiquidaciones = path.join(__dirname, "./data/liquidaciones.json");
        const dataLiquidaciones = await fs.readFile(rutaLiquidaciones, "utf-8");
        const liquidacionesJson = JSON.parse(dataLiquidaciones);

        await LiquidacionModel.deleteMany({});
        console.log("Colección de liquidaciones limpiada");

        const liquidacionesBD = liquidacionesJson.map(liq => {
            const mongoEmpleadoId = diccionarioEmpleados[liq.empleadoId];

            if (!mongoEmpleadoId) {
                throw new Error(`No se encontró empleado con ID ficticio: ${liq.empleadoId}`);
            }

            const empleadoReal = mapaEmpleadosBD[mongoEmpleadoId.toString()];
            const mongoEmpresaId = empleadoReal ? empleadoReal.empresaId : null;

            const salarioDelEmpleado = empleadoReal ? empleadoReal.salario : 0;

            return {
                ...liq,
                empleadoId: mongoEmpleadoId,
                empresaId: mongoEmpresaId,
                salarioBase: salarioDelEmpleado
            };
        });

        await LiquidacionModel.insertMany(liquidacionesBD);
        console.log("Migración de liquidaciones completada con éxito");

        mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error("Error durante la migración:", error);
        process.exit(1);
    }
};

migrarDatos();