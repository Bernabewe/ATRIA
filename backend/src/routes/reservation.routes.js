const express = require('express');
const router = express.Router();

const reservationController = require('../controllers/reservation.controller');
const validateSchema = require('../middlewares/validateSchema');
const authenticateJWT = require('../middlewares/auth');
const { 
    obtenerDoctoresSchema, 
    obtenerDisponibilidadSchema,
    confirmarReservaSchema, 
    cancelarCitaSchema,
    obtenerResumenSchema
} = require('../schemas/reservation.schema');

/**
 * RUTAS DE RESERVA MÉDICA (Agendamiento)
 */

// Paso 1: Especialidad
router.get('/views/patient/reservas/especialidad', authenticateJWT, reservationController.obtenerEspecialidades);

// Paso 2: Sucursal
router.get('/views/patient/reservas/sucursal', authenticateJWT, reservationController.obtenerSucursales);

// Paso 3: Doctores 
router.get('/views/patient/reservas/doctores', 
    authenticateJWT, 
    validateSchema(obtenerDoctoresSchema), 
    reservationController.obtenerDoctores
);

// Paso 4: Disponibilidad (Calendario)
router.get('/views/patient/reservas/disponibilidad', 
    authenticateJWT, 
    validateSchema(obtenerDisponibilidadSchema), 
    reservationController.obtenerDisponibilidad
);

// Paso 5: Resumen Final
router.get('/views/patient/reservas/resumen', 
    authenticateJWT, 
    validateSchema(obtenerResumenSchema), 
    reservationController.obtenerResumenReserva
);

// Confirmar Reserva y Pagar (Paso Final)
router.post('/reservas/appointments', 
    authenticateJWT, 
    validateSchema(confirmarReservaSchema), 
    reservationController.confirmarReserva
);

// Cancelar Cita (PATCH para modificaciones parciales de estado)
router.patch('/appointments/:id_cita/cancel', 
    authenticateJWT, 
    validateSchema(cancelarCitaSchema), 
    reservationController.cancelarCita
);

module.exports = router;