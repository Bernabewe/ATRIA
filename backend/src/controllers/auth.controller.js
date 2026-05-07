const prisma = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 

/**
 * Endpoint para registrar un nuevo usuario (y crear su perfil de paciente).
 */
const registrar = async (req, res, next) => {
    try {
        const { nombre_completo, correo_electronico, password, fecha_nacimiento, telefono, sexo_biologico, tipo_sangre } = req.body;

        const usuarioExistente = await prisma.usuarios.findUnique({
            where: { correo_electronico }
        });

        if (usuarioExistente) {
            return res.status(409).json({ codigo: "USER_ALREADY_EXISTS", mensaje: "Este correo ya está registrado." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const nuevoUsuario = await prisma.$transaction(async (tx) => {
            const user = await tx.usuarios.create({
                data: {
                    correo_electronico,
                    password_hash: hashedPassword,
                    rol: 'PACIENTE' 
                }
            });

            await tx.perfiles_paciente.create({
                data: {
                    id_usuario: user.id,
                    nombre_completo: nombre_completo,
                    foto_perfil_url: "https://atria.com/profiles/default.jpg",
                    tipo_sangre: tipo_sangre || "No especificado",
                    peso: 0,
                    altura: 0,
                    fecha_nacimiento: new Date(fecha_nacimiento),
                    sexo_biologico: sexo_biologico,
                    telefono: telefono
                }
            });

            return user;
        });

        res.status(201).json({ mensaje: "Usuario creado exitosamente.", usuario_id: nuevoUsuario.id });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { correo_electronico, password } = req.body;

        const usuario = await prisma.usuarios.findUnique({
            where: { correo_electronico: correo_electronico }
        });

        if (!usuario) {
            return res.status(401).json({
                codigo: "UNAUTHORIZED",
                mensaje: "Credenciales incorrectas."
            });
        }

        const passwordValida = await bcrypt.compare(password, usuario.password_hash);

        if (!passwordValida) {
            return res.status(401).json({
                codigo: "UNAUTHORIZED",
                mensaje: "Credenciales incorrectas."
            });
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) throw new Error("Falta la variable de entorno JWT_SECRET");

        const payload = {
            id: usuario.id,
            id_paciente: usuario.id, 
            rol: usuario.rol || 'PACIENTE' 
        };

        const token = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });

        res.status(200).json({
            mensaje: "Inicio de sesión exitoso",
            token: token
        });

    } catch (error) {
        next(error);
    }
};

module.exports = { registrar, login };