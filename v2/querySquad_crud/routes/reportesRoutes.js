const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportesController');

// Ruta para ver el dashboard de errores
router.get('/errores', reportesController.obtenerDashboardErrores);

module.exports = router;
