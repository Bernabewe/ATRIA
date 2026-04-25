/**
 * Middleware global para la gestión de errores.
 * Atrapa cualquier excepción no manejada en los controladores y devuelve
 * una respuesta estandarizada basada en el contrato OpenApi de Atria.
 * * @param {Error} err - El objeto de error capturado.
 * @param {import('express').Request} req - Objeto de petición Express.
 * @param {import('express').Response} res - Objeto de respuesta Express.
 * @param {import('express').NextFunction} next - Función next (requerida por Express).
 */

const errorHandler = (err, req, res, next) => {
    // Imprimir el error en consola para debugging (en producción usaríamos Winston o Morgan)
    console.error(`[Error Central] ${err.name}: ${err.message}`);

    const statusCode = err.statusCode || 500;

    const errorCode = err.errorCode || (statusCode === 500 ? 'INTERNAL_SERVER_ERROR' : 'BAD_REQUEST');

    const errorResponse = {
        codigo: errorCode,
        mensaje: statusCode === 500 && process.env.NODE_ENV === 'production'
            ? 'Ocurrió un error interno en el servidor. '
            : err.message,
        timestamp: new Date().toISOString(),
    };

    res.status(statusCode).json(errorResponse);
}

module.exports = errorHandler;