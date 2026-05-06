const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validateSchema = require('../middlewares/validateSchema');
const { registroSchema, loginSchema } = require('../schemas/auth.schema');

router.post('/auth/register', validateSchema(registroSchema), authController.registrar);

router.post('/auth/login', validateSchema(loginSchema), authController.login);

module.exports = router;