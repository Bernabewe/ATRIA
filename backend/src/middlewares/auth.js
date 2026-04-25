const jwt = require('jsonwebtoken');

/**
 * Middleware de autenticación con JWT
 * Intercepta las peticiones, verifica el token Bearer en las cabeceras
 * y extrae el payload (ej. id_paciente) para inyectarlo en req.user.
 * 
 * * @param {import ('express').Request} req - Objeto de petición Express.
 * @param {import ('express').Response} res - Objeto de respuesta Express.
 * @param {import ('express').NextFunction} next - Función siguiente en el middleware.
 * @returns {void} Pasa el control a la ruta o devuelve un error 401 si falla.
 */

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            codigo: 'UNAUTHORIZED',
            mensaje: 'Acceso denegado. Se requiere un token Bearer válido',
            timestamp: new Date().toISOString()
        });
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET || 'atria_secret_dev_key_123';

    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                codigo: 'UNAUTHORIZED',
                mensaje: 'El token proporcionado ha expirado o es inválido',
                timestamp: new Date().toISOString()
            });
        }
        req.user = decoded;
        next();
    })
}


module.exports = authenticateJWT;
