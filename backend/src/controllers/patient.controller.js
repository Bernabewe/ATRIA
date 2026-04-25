/**
 * @file Controlador para el módulo de vistas del paciente.
 * Orquesta la información requerida por las pantallas en la App Móvil (BFF).
 */

/**
 * Obtiene los datos agregados para la pantalla de inicio (Home) del paciente.
 * @param {import('express').Request} req - Objeto de petición Express (Contiene req.user).
 * @param {import('express').Response} res - Objeto de respuesta Express.
 * @param {import('express').NextFunction} next - Función para pasar errores al middleware global.
 */

const getHomeData = async (req, res, next) => {
    try {
        const pacienteId = req.user.id_paciente;

        const homeResponse = {
            nombre_pila: "Anna",
            foto_perfil_url: "https://atria.com/profiles/anna.jpg",
            estado_salud_resumen: "Tus métricas de salud lucen excelentes hoy.",
            next_cita: {
                id_cita: "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
                doctor_nombre: "Dra. Sarah Rose",
                especialidad_etiqueta: "Especialista en Cardiología",
                estado_badge: "CONFIRMADA",
                fecha_relativa: "Mañana",
                hora_formateada: "10:30 AM",
                ubicacion_resumen: "Sucursal Las Américas",
            },
            quick_actions: [
                {
                    action_id: "book_appointment",
                    label: "Agendar Cita",
                    icon_id: "calendar-plus",
                    route_name: "AppointmentFlow",
                    is_enabled: true
                },
                {
                    action_id: "medical_history",
                    label: "Historial",
                    icon_id: "clipboard-pulse",
                    route_name: "MedicalHistory",
                    is_enabled: true
                }
            ]
        };

        res.status(200).json(homeResponse);
    } catch (error) {
        next(error);
    }
}

/** 
 * Obtiene el listado decitas próximas y recientes del paciente.
 * @param {import('express').Request} req - Objeto de petición Express (Contiene req.user).
 * @param {import('express').Response} res - Objeto de respuesta Express.
 * @param {import('express').NextFunction} next - Función para pasar errores al middleware global.
*/

const getUpcomingAppointments = async (req, res, next) => {
    try {
        const response = {
            proxima_prioridad: {
                id_cita: "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
                doctor_nombre: "Dr. Aris Thorne",
                doctor_foto_url: "https://atria.com/profiles/aris.jpg",
                especialidad_etiqueta: "Especialista en Cardiología",
                estado_badge: "CONFIRMADA",
                fecha_hora_resumen: "Mañana, 10:30 AM"
            },
            visitas_proximas: [
                {
                    id_cita: "b2c3d4e5-1234-5678-abcd-ef0123456789",
                    doctor_nombre: "Dra. Elena Rosas",
                    motivo_consulta: "Limpieza Dental",
                    fecha_corta: "15 Nov",
                    icono_especialidad_id: "tooth-outline",
                    estado_texto: "Confirmada",
                    estado_icono: "check-circle"
                }
            ],
            completadas_recientemente: [
                {
                    id_cita: "c3d4e5f6-9876-5432-fedc-ba0987654321",
                    doctor_nombre: "Dr. Marcos Silva",
                    motivo_consulta: "Chequeo de Rutina",
                    fecha_corta: "02 Nov",
                    icono_especialidad_id: "heart-outline",
                    estado_texto: "Lista",
                    estado_icono: "check-circle"
                }
            ]
        };

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}

/**
 * Obtiene el historial completo de citas pasadas.
 * @param {import('express').Request} req - Objeto de petición Express (Contiene req.user).
 * @param {import('express').Response} res - Objeto de respuesta Express.
 * @param {import('express').NextFunction} next - Función para pasar errores al middleware global.
 */
const getPastAppointments = async (req, res, next) => {
    try {
        const response = {
            historial_citas: [
                {
                    id_cita: "d4e5f6a1-1111-2222-3333-444455556666",
                    doctor_nombre: "Dra. Sarah Rose",
                    motivo_consulta: "Consulta Dermatológica",
                    fecha_corta: "10 Oct",
                    icono_especialidad_id: "medical-bag",
                    estado_texto: "Lista",
                    estado_icono: "check-circle"
                },
                {
                    id_cita: "e5f6a1b2-7777-8888-9999-000011112222",
                    doctor_nombre: "Dr. Aris Thorne",
                    motivo_consulta: "Seguimiento Anual",
                    fecha_corta: "15 Ago",
                    icono_especialidad_id: "heart-outline",
                    estado_texto: "Cancelada",
                    estado_icono: "close-circle"
                }
            ]
        };

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}


/**
 * Obtiene los detalles del perfil personal y de contacto del paciente.
 * @param {import('express').Request} req Objeto de petición Express (Contiene req.user).
 * @param {import('express').Response} res Objeto de respuesta Express.
 * @param {import('express').NextFunction} next Función para pasar errores al middleware global.
 */
const getProfileDetails = async (req, res, next) => {
    try {
        const response = {
            foto_perfil_url: "https://atria.com/profiles/anna.jpg",
            nombre_completo: "Anna Smith",
            correo_electronico: "anna.smith@email.com",
            fecha_nacimiento: "15 Oct 1990",
            peso: 70,
            altura: 1.75,
            tipo_sangre: "O+",
            telefono: "+52 667 514 2646",
            direccion_completa: "Calle de la paz 123, Madrid"
        };
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

/**
 * Obtiene la línea de tiempo de diagnósticos y consultas médicas.
 * @param {import('express').Request} req Objeto de petición Express (Contiene req.user).
 * @param {import('express').Response} res Objeto de respuesta Express.
 * @param {import('express').NextFunction} next Función para pasar errores al middleware global.
 */
const getMedicalHistory = async (req, res, next) => {
    try {
        const response = {
            linea_tiempo_consultas: [
                {
                    id_historial: "h1i2j3k4-5678-90ab-cdef-1234567890ab",
                    fecha_formateada: "15 de Agosto, 2023",
                    diagnostico_titulo: "Seguimiento de Hipertensión",
                    resumen_notas: "Presión arterial estable en 125/82. Continuar con la dosis actual...",
                    tiene_resumen_medico: true
                }
            ]
        };
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

/**
 * Obtiene el control financiero y pagos pendientes del paciente.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const getPaymentHistory = async (req, res, next) => {
    try {
        // Mock basado en requerimientosAPIS.txt - Módulo Historial de Pagos
        const response = {
            saldo_pendiente: "$850.00",
            transacciones_recientes: [
                {
                    id_transaccion: "t1u2v3w4-x5y6-z789-0abc-def123456789",
                    titulo_concepto: "Consulta General",
                    fecha_formateada: "15 de Octubre, 2023",
                    monto_formateado: "$1,200.00",
                    estado_pago: "PAGADO",
                    icono_concepto: "stethoscopy"
                }
            ]
        };
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};


module.exports = {
    getHomeData,
    getUpcomingAppointments,
    getPastAppointments,
    getProfileDetails,
    getMedicalHistory,
    getPaymentHistory
};