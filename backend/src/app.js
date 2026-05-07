const express = require("express");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");
const jwt = require("jsonwebtoken");

const authenticateJWT = require("./middlewares/auth");
const errorHandler = require("./middlewares/errorHandler");

const patientRoutes = require("./routes/patient.routes");
const reservationRoutes = require("./routes/reservation.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();
app.use(express.json());

const swaggerDocument = YAML.load(
  path.join(__dirname, "../../openapi/index.yaml"),
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/v1", patientRoutes);
app.use("/api/v1", reservationRoutes);
app.use("/api/v1", authRoutes);

// app.get("/api/v1/crash-test", (req, res, next) => {
//   const errorCritico = new Error(
//     "Prisma Client no pudo conectarse al puerto 5432. TimeOut.",
//   );
//   next(errorCritico);
// });

app.use(errorHandler);

module.exports = app;
