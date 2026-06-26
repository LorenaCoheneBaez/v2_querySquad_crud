const express = require("express");
const router = express.Router();
const { listarAuditoria, obtenerAuditoriaJSON } = require("../controllers/auditoriaController");
const { verificarPermiso, verificarLogin } = require("../middlewares/verificarPermiso");

router.get("/", verificarLogin, verificarPermiso("AUDITORIA"), listarAuditoria);

router.get("/api", verificarLogin, verificarPermiso("AUDITORIA"), obtenerAuditoriaJSON);

module.exports = router;