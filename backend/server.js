const app = require('./src/app');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor de Atria corriendo en http://localhost:${PORT}/api`);
    console.log(`Documentación OpenAPI en vivo: http://localhost:${PORT}/api-docs`);
});