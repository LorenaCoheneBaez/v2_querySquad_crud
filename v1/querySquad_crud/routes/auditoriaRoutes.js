const express = require("express");
const router = express.Router();
const { listarAuditoria, obtenerAuditoriaJSON } = require("../controllers/auditoriaController");

router.get("/", listarAuditoria);

router.get("/api", obtenerAuditoriaJSON);

module.exports = router;