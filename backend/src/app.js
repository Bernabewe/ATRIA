const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const jwt = require('jsonwebtoken');

const authenticateJWT = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');

const patientRoutes = require('./routes/patient.routes');
const reservationRoutes = require('./routes/reservation.routes');

const app = express();
app.use(express.json());

const swaggerDocument = YAML.load(path.join(__dirname, '../../openapi/index.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/v1', patientRoutes);
app.use('/api/v1', reservationRoutes);

// Prueba D: Generar un token válido (Temporal para pruebas)
app.get('/api/test-login', (req, res) => {
    const payload = {
        id_paciente: '123e4567-e89b-12d3-a456-426614174000',
        nombre: 'Anna Smith',
        rol: 'paciente'
    };

    const jwtSecret = process.env.JWT_SECRET || 'atria_secret_dev_key_123';

    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });

    res.json({
        mensaje: 'Token generado exitosamente',
        token: token
    });
});


app.use(errorHandler);

module.exports = app;