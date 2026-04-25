const express = require('express');
const router = express.Router();

const authenticateJWT = require('../middlewares/auth');
const reservationController = require('../controllers/reservation.controller');

/**
 * RUTAS DE RESERVA MÉDICA (Agendamiento)
 * 
 */

// Paso 1: Especialidad
router.get('/views/patient/reservas/especialidad', authenticateJWT, reservationController.getSpecialties);
// Paso 2: Sucursal
router.get('/views/patient/reservas/sucursal', authenticateJWT, reservationController.getBranches);
// Paso 3: Doctores
router.get('/views/patient/reservas/doctores', authenticateJWT, reservationController.getDoctors);
// Paso 4: Disponibilidad (Calendario)
router.get('/views/patient/reservas/disponibilidad', authenticateJWT, reservationController.getAvailability);
// Paso 5: Resumen Final
router.get('/views/patient/reservas/resumen', authenticateJWT, reservationController.getCheckoutSummary);

module.exports = router;