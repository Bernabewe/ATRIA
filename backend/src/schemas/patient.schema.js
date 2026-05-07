const { z } = require('zod');

const actualizarPerfilSchema = z.object({
    body: z.object({
        peso: z.number({ invalid_type_error: "El peso debe ser un número" })
            .positive("El peso debe ser un valor positivo")
            .optional(),
        altura: z.number({ invalid_type_error: "La altura debe ser un número" })
            .positive("La altura debe ser un valor positivo")
            .optional(),
        telefono: z.string()
            .min(10, "El teléfono debe tener al menos 10 caracteres")
            .optional(),
        direccion_completa: z.string()
            .min(5, "La dirección es muy corta")
            .optional()
    })
});

const pagarTransaccionSchema = z.object({
    params: z.object({
        id_transaccion: z.string().uuid("El ID de la transacción debe ser un UUID válido")
    }),
    body: z.object({
        metodo_pago_id: z.string({ required_error: "El método de pago es obligatorio" })
            .min(1, "Debes especificar un método de pago")
    })
});

module.exports = {
    actualizarPerfilSchema,
    pagarTransaccionSchema
};