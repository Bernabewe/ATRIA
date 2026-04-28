const { z } = require('zod');

const obtenerDoctoresSchema = z.object({
    query: z.object({
        especialidad_id: z.string().uuid("El parámetro especialidad_id debe ser un UUID válido").optional(),
        sucursal_id: z.string().uuid("El parámetro sucursal_id debe ser un UUID válido").optional()
    })
});

const confirmarReservaSchema = z.object({
    body: z.object({
        id_doctor: z.string({ required_error: "El id_doctor es obligatorio" }).uuid("Debe ser un UUID válido"),
        id_sucursal: z.string({ required_error: "El id_sucursal es obligatorio" }).uuid("Debe ser un UUID válido"),
        fecha_hora_inicio: z.string({ required_error: "La fecha es obligatoria" })
            .datetime("La fecha debe estar en formato ISO 8601 (ej. 2026-04-26T10:30:00Z)"),
        metodo_pago_id: z.string().min(1, "El método de pago no puede estar vacío")
    })
});

const cancelarCitaSchema = z.object({
    params: z.object({
        id_cita: z.string().uuid("El id_cita de la URL debe ser un UUID válido")
    }),
    body: z.object({
        motivo_cancelacion: z.string().min(10, "El motivo debe tener al menos 10 caracteres")
    })
});

const obtenerDisponibilidadSchema = z.object({
    query: z.object({
        id_doctor: z.string({ required_error: "El id_doctor es obligatorio" }).uuid("Debe ser un UUID válido")
    })
});

const obtenerResumenSchema = z.object({
    query: z.object({
        id_doctor: z.string({ required_error: "id_doctor requerido" }).uuid("Debe ser UUID"),
        id_sucursal: z.string({ required_error: "id_sucursal requerido" }).uuid("Debe ser UUID"),
        fecha_hora_inicio: z.string({ required_error: "fecha_hora_inicio requerida" }).datetime("Debe ser ISO 8601")
    })
});

module.exports = {
    obtenerDoctoresSchema,
    obtenerDisponibilidadSchema,
    confirmarReservaSchema,
    cancelarCitaSchema,
    obtenerResumenSchema
};
