/**
 * Middleware para validar peticiones usando Zod.
 * @param {import('zod').AnyZodObject} schema Esquema de validación de Zod
 */
const validateSchema = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });

        return next();
    } catch (error) {
        if (error.name === 'ZodError') {
            const listaErrores = error.issues || error.errors || [];
            
            const erroresFormateados = listaErrores.map(err => ({
                campo: err.path ? err.path.join('.') : 'campo_desconocido', 
                mensaje: err.message
            }));

            return res.status(400).json({
                codigo: "VALIDATION_ERROR",
                mensaje: "Los datos enviados no son válidos.",
                detalles: erroresFormateados
            });
        }

        return next(error);
    }
};

module.exports = validateSchema;