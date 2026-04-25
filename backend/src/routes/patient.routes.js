const express = require('express');
const router = express.Router();

const authenticateJWT = require('../middlewares/auth');
const patientController = require('../controllers/patient.controller');

/**
 * RUTAS DE VISTAS (BFF)
 */

// Home
router.get('/views/patient/home', authenticateJWT, patientController.getHomeData);

// Citas
router.get('/views/patient/citas_proximas', authenticateJWT, patientController.getUpcomingAppointments);
router.get('/views/patient/citas_pasadas', authenticateJWT, patientController.getPastAppointments);

// Perfil e Historiales
router.get('/views/patient/profile_details', authenticateJWT, patientController.getProfileDetails);
router.get('/views/patient/historial_medico', authenticateJWT, patientController.getMedicalHistory);
router.get('/views/patient/historial_pagos', authenticateJWT, patientController.getPaymentHistory);

module.exports = router;