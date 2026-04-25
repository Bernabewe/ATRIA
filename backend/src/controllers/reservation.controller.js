/**
 * @file Controlador para el flujo de agendamiento de citas (Reserva Médica).
 */

/**
 * Paso 1: Obtiene la lista de especialidades médicas.
 * @param {import('express').Request} req Objeto de petición Express.
 * @param {import('express').Response} res Objeto de respuesta Express.
 * @param {import('express').NextFunction} next Función para pasar errores al middleware global.
 */
const obtenerEspecialidades = async (req, res, next) => {
    try {
        const response = {
            especialidades: [
                {
                    id_especialidad: "esp-001",
                    nombre_especialidad: "Cardiología",
                    descripcion_corta: "Cuidado experto del corazón y sistema circulatorio.",
                    icono_id: "heart-outline"
                },
                {
                    id_especialidad: "esp-002",
                    nombre_especialidad: "Dermatología",
                    descripcion_corta: "Especialistas en el cuidado y salud de la piel.",
                    icono_id: "water-outline"
                }
            ]
        };
        res.status(200).json(response);
    } catch (error) { next(error); }
};

/**
 * Paso 2: Obtiene la lista de sucursales/clínicas.
 * @param {import('express').Request} req Objeto de petición Express.
 * @param {import('express').Response} res Objeto de respuesta Express.
 * @param {import('express').NextFunction} next Función para pasar errores al middleware global.
 */
const obtenerSucursales = async (req, res, next) => {
    try {
        const response = {
            sucursales: [
                {
                    id_sucursal: "suc-001",
                    nombre_sucursal: "Sucursal Las Américas",
                    direccion_completa: "Boulevard de las Américas, Culiacán.",
                    coordenadas: { latitud: 24.8083, longitud: -107.3938 }
                }
            ]
        };
        res.status(200).json(response);
    } catch (error) { next(error); }
};

/**
 * Paso 3: Obtiene los doctores filtrados por especialidad y sucursal.
 * @param {import('express').Request} req Objeto de petición Express.
 * @param {import('express').Response} res Objeto de respuesta Express.
 * @param {import('express').NextFunction} next Función para pasar errores al middleware global.
 */
const obtenerDoctores = async (req, res, next) => {
    try {
        const response = {
            especialistas: [
                {
                    id_doctor: "doc-001",
                    nombre_doctor: "Dra. Sarah Rose",
                    foto_url: "https://atria.com/profiles/sarah.jpg",
                    calificacion_promedio: 4.9,
                    experiencia_anios: 12,
                    especialidad_titulo: "Cardióloga"
                }
            ]
        };
        res.status(200).json(response);
    } catch (error) { next(error); }
};

/**
 * Paso 4: Obtiene la disponibilidad (días y horas) de un doctor. 
 * @param {import('express').Request} req Objeto de petición Express.
 * @param {import('express').Response} res Objeto de respuesta Express.
 * @param {import('express').NextFunction} next Función para pasar errores al middleware global.
*/
const obtenerDisponibilidad = async (req, res, next) => {
    try {
        const response = {
            dias_disponibles: ["2026-03-06", "2026-03-07", "2026-03-08"],
            horarios_por_dia: [
                { hora_formateada: "10:30 AM", estado: "disponible" },
                { hora_formateada: "11:00 AM", estado: "ocupado" },
                { hora_formateada: "11:30 AM", estado: "disponible" }
            ]
        };
        res.status(200).json(response);
    } catch (error) { next(error); }
};

/**
 * Paso 5: Resumen final antes del pago.
 * @param {import('express').Request} req Objeto de petición Express.
 * @param {import('express').Response} res Objeto de respuesta Express.
 * @param {import('express').NextFunction} next Función para pasar errores al middleware global.
*/
const obtenerResumenReserva = async (req, res, next) => {
    try {
        const response = {
            doctor_nombre: "Dra. Sarah Rose",
            doctor_foto_url: "https://atria.com/profiles/sarah.jpg",
            especialidad_titulo: "Dermatología Clínica",
            sucursal_nombre: "Sucursal Las Américas",
            sucursal_direccion: "Boulevard de las Américas, Culiacán",
            fecha_hora_formateada: "2 de Marzo, 10:30 AM",
            duracion_estimada: "45 min",
            costo_total: "$1,000.00",
            anticipo_requerido: "$500.00"
        };
        res.status(200).json(response);
    } catch (error) { next(error); }
};

/**
 * Finaliza el embudo de agendamiento procesando el pago y creando la cita.
 * @param {import('express').Request} req - Petición. Body: id_doctor, id_sucursal, fecha_hora_inicio, metodo_pago_id.
 * @param {import('express').Response} res - Respuesta.
 * @param {import('express').NextFunction} next - Middleware de errores.
 */
const confirmarReserva = async (req, res, next) => {
    try {
        const { id_doctor, id_sucursal, fecha_hora_inicio, metodo_pago_id } = req.body;

        res.status(201).json({
            id_cita: "c1d2e3f4-5678-90ab-cdef-1234567890ab", 
            estado_pago: "APROBADO"
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Cancela una cita programada y evalúa políticas de reembolso.
 * @param {import('express').Request} req - Petición. params: id_cita, body: motivo_cancelacion.
 * @param {import('express').Response} res - Respuesta.
 * @param {import('express').NextFunction} next - Middleware de errores.
 */
const cancelarCita = async (req, res, next) => {
    try {
        const { id_cita } = req.params;
        const { motivo_cancelacion } = req.body;

        res.status(200).json({
            nuevo_estado: "CANCELADA",
            reembolso_aplicado: false
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    obtenerEspecialidades,
    obtenerSucursales,
    obtenerDoctores,
    obtenerDisponibilidad,
    obtenerResumenReserva,
    confirmarReserva, 
    cancelarCita      
};