/**
 * @file Enrutador para las vistas del portal del paciente.
 * Define los endpoints de lectura y los vincula con el controlador de pacientes.
 */

const express = require('express');
const router = express.Router();

const authenticateJWT = require('../middlewares/auth');
const validateSchema = require('../middlewares/validateSchema'); 
const patientController = require('../controllers/patient.controller');

const { actualizarPerfilSchema, pagarTransaccionSchema } = require('../schemas/patient.schema');

/**
 * RUTAS DE VISTAS (BFF) - PORTAL PACIENTE
 */

router.get('/views/patient/home', authenticateJWT, patientController.obtenerInicio);

// Módulo de Citas
router.get('/views/patient/citas_proximas', authenticateJWT, patientController.obtenerCitasProximas);
router.get('/views/patient/citas_pasadas', authenticateJWT, patientController.obtenerCitasPasadas);

// Perfil e Historiales
router.get('/views/patient/profile_details', authenticateJWT, patientController.obtenerDetallesPerfil);
router.get('/views/patient/historial_medico', authenticateJWT, patientController.obtenerHistorialMedico);
router.get('/views/patient/historial_pagos', authenticateJWT, patientController.obtenerHistorialPagos);


// Editar Perfil (PUT)
router.put('/patient/profile', 
    authenticateJWT, 
    validateSchema(actualizarPerfilSchema),
    patientController.actualizarPerfil
);

// Pagar Adeudo (POST)
router.post('/patient/historial_pagos/:id_transaccion/pay', 
    authenticateJWT, 
    validateSchema(pagarTransaccionSchema), 
    patientController.pagarTransaccionPendiente
);

module.exports = router;