const { z } = require('zod');

const loginSchema = z.object({
    body: z.object({
        correo: z.string().email("Correo inválido"),
        password: z.string().min(1, "Contraseña requerida")
    })
});

const registroSchema = z.object({
    body: z.object({
        nombre_completo: z.string().min(3, "El nombre es demasiado corto"),
        correo: z.string().email("Debe ser un correo válido"),
        password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
        fecha_nacimiento: z.string().datetime("Debe ser formato ISO 8601 (ej. 1995-10-25T00:00:00Z)"),
        telefono: z.string().min(10, "El teléfono debe tener al menos 10 dígitos"),
        sexo_biologico: z.enum(["M", "F", "O"], { errorMap: () => ({ message: "El sexo debe ser M, F u O" }) }),
        tipo_sangre: z.string().optional()
    })
});;

module.exports = { loginSchema, registroSchema };