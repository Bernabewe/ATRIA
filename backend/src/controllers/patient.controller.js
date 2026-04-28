/**
 * @file Controlador para el módulo de vistas del paciente.
 * Orquesta la información requerida por las pantallas en la App Móvil (BFF).
 */

const prisma = require('../config/db');

/**
 * Obtiene los datos agregados para la pantalla de inicio (Home) del paciente.
 * @param {import('express').Request} req - Objeto de petición Express (Contiene req.user).
 * @param {import('express').Response} res - Objeto de respuesta Express.
 * @param {import('express').NextFunction} next - Función para pasar errores al middleware global.
 */

const obtenerInicio = async (req, res, next) => {
    try {
        const pacienteId = req.user.id_paciente;

        const [perfil, proximaCita] = await Promise.all([
            prisma.perfiles_paciente.findUnique({
                where: { id_usuario: pacienteId }
            }),
            prisma.citas.findFirst({
                where: { 
                    id_paciente: pacienteId,
                    estatus: 'Confirmada',
                    fecha_hora_inicio: { gte: new Date() }
                },
                include: {
                    usuarios_citas_id_doctorTousuarios: { 
                        include: {
                            perfiles_doctor: {
                                include: {
                                    catalogo_especialidades: true
                                }
                            }
                        }
                    },
                    consultorios: {
                        include: {
                            sucursales: true
                        }
                    }
                },
                orderBy: { fecha_hora_inicio: 'asc' }
            })
        ]);

        if (!perfil) {
            return res.status(404).json({ mensaje: "Paciente no encontrado" });
        }

        let next_cita_mapped = null;
        if (proximaCita) {
            const doctorUsuario = proximaCita.usuarios_citas_id_doctorTousuarios;
            const perfilDoctor = doctorUsuario?.perfiles_doctor;
            const especialidad = perfilDoctor?.catalogo_especialidades;
            const sucursal = proximaCita.consultorios?.sucursales;

            next_cita_mapped = {
                id_cita: proximaCita.id,
                doctor_nombre: perfilDoctor?.nombre_completo || "Doctor asignado",
                especialidad_etiqueta: especialidad?.nombre || "Especialidad General",
                estado_badge: proximaCita.estatus.toUpperCase(),
                fecha_relativa: "Próximamente",
                hora_formateada: proximaCita.fecha_hora_inicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                ubicacion_resumen: sucursal?.nombre || "Ubicación pendiente",
            };
        }

        const homeResponse = {
            nombre_pila: perfil.nombre_completo.split(' ')[0], 
            foto_perfil_url: perfil.foto_perfil_url || "https://atria.com/profiles/default.jpg",
            estado_salud_resumen: "Tus métricas de salud lucen excelentes hoy.",
            next_cita: next_cita_mapped,
            quick_actions: [
                { action_id: "book_appointment", label: "Agendar Cita", icon_id: "calendar-plus", route_name: "AppointmentFlow", is_enabled: true },
                { action_id: "medical_history", label: "Historial", icon_id: "clipboard-pulse", route_name: "MedicalHistory", is_enabled: true }
            ]
        };

        res.status(200).json(homeResponse);
    } catch (error) {
        next(error);
    }
}

/** 
 * Obtiene el listado de citas próximas y recientes del paciente.
 */
const obtenerCitasProximas = async (req, res, next) => {
    try {
        const pacienteId = req.user.id_paciente || req.user.id;
        const ahora = new Date();

        const citasFuturas = await prisma.citas.findMany({
            where: {
                id_paciente: pacienteId,
                fecha_hora_inicio: { gte: ahora },
                estatus: { in: ['Confirmada', 'Reservado_Temporal'] }
            },
            include: {
                usuarios_citas_id_doctorTousuarios: {
                    include: {
                        perfiles_doctor: {
                            include: { catalogo_especialidades: true }
                        }
                    }
                },
                consultorios: { include: { sucursales: true } }
            },
            orderBy: { fecha_hora_inicio: 'asc' } 
        });

        const citasRecientes = await prisma.citas.findMany({
            where: {
                id_paciente: pacienteId,
                fecha_hora_inicio: { lt: ahora },
                estatus: { notIn: ['Cancelada'] } 
            },
            include: {
                usuarios_citas_id_doctorTousuarios: {
                    include: { perfiles_doctor: { include: { catalogo_especialidades: true } } }
                }
            },
            orderBy: { fecha_hora_inicio: 'desc' },
            take: 2 
        });

        let proxima_prioridad = null;
        let visitas_proximas = [];

        if (citasFuturas.length > 0) {
            const primera = citasFuturas[0];
            const perfilDoc = primera.usuarios_citas_id_doctorTousuarios?.perfiles_doctor;
            
            proxima_prioridad = {
                id_cita: primera.id,
                doctor_nombre: perfilDoc?.nombre_completo || "Doctor asignado",
                doctor_foto_url: perfilDoc?.foto_perfil_url || "https://atria.com/profiles/default.jpg",
                especialidad_etiqueta: perfilDoc?.catalogo_especialidades?.nombre || "Especialista",
                estado_badge: primera.estatus.toUpperCase(),
                fecha_hora_resumen: primera.fecha_hora_inicio.toLocaleString('es-MX', { 
                    weekday: 'long', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
                })
            };

            visitas_proximas = citasFuturas.slice(1).map(cita => {
                const doc = cita.usuarios_citas_id_doctorTousuarios?.perfiles_doctor;
                return {
                    id_cita: cita.id,
                    doctor_nombre: doc?.nombre_completo || "Doctor asignado",
                    motivo_consulta: "Consulta Programada",
                    fecha_corta: cita.fecha_hora_inicio.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }),
                    icono_especialidad_id: doc?.catalogo_especialidades?.icono_id || "medical-bag",
                    estado_texto: cita.estatus,
                    estado_icono: "calendar-clock"
                };
            });
        }

        const completadas_recientemente = citasRecientes.map(cita => {
            const doc = cita.usuarios_citas_id_doctorTousuarios?.perfiles_doctor;
            return {
                id_cita: cita.id,
                doctor_nombre: doc?.nombre_completo || "Doctor asignado",
                motivo_consulta: "Consulta General",
                fecha_corta: cita.fecha_hora_inicio.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }),
                icono_especialidad_id: "check-circle",
                estado_texto: cita.estatus,
                estado_icono: "check-all"
            };
        });

        res.status(200).json({
            proxima_prioridad,
            visitas_proximas,
            completadas_recientemente
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Obtiene el historial completo de citas pasadas.
 */
const obtenerCitasPasadas = async (req, res, next) => {
    try {
        const pacienteId = req.user.id_paciente || req.user.id;
        const ahora = new Date();

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const whereClause = {
            id_paciente: pacienteId,
            OR: [
                { fecha_hora_inicio: { lt: ahora } },
                { estatus: 'Cancelada' }
            ]
        };

        const [totalCitas, historialDb] = await prisma.$transaction([
            prisma.citas.count({ where: whereClause }), 
            prisma.citas.findMany({
                where: whereClause,
                include: {
                    usuarios_citas_id_doctorTousuarios: {
                        include: {
                            perfiles_doctor: { include: { catalogo_especialidades: true } }
                        }
                    }
                },
                orderBy: { fecha_hora_inicio: 'desc' },
                skip: skip, 
                take: limit 
            })
        ]);

        const historialMapeado = historialDb.map(cita => {
            const perfilDoc = cita.usuarios_citas_id_doctorTousuarios?.perfiles_doctor;
            const esCancelada = cita.estatus === 'Cancelada';

            return {
                id_cita: cita.id,
                doctor_nombre: perfilDoc?.nombre_completo || "Doctor",
                motivo_consulta: esCancelada ? cita.motivo_cancelacion || "Cancelada por el usuario" : "Consulta General",
                fecha_corta: cita.fecha_hora_inicio.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
                icono_especialidad_id: perfilDoc?.catalogo_especialidades?.icono_id || "medical-bag",
                estado_texto: cita.estatus,
                estado_icono: esCancelada ? "close-circle" : "check-circle"
            };
        });

        res.status(200).json({
            metadatos: {
                total_registros: totalCitas,
                pagina_actual: page,
                limite_por_pagina: limit,
                total_paginas: Math.ceil(totalCitas / limit),
                tiene_mas_paginas: (page * limit) < totalCitas
            },
            historial_citas: historialMapeado
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Obtiene los detalles del perfil personal y de contacto del paciente.
 */
const obtenerDetallesPerfil = async (req, res, next) => {
    try {
        const pacienteId = req.user.id_paciente || req.user.id;

        const perfil = await prisma.perfiles_paciente.findUnique({
            where: { id_usuario: pacienteId },
            include: { usuarios: true } 
        });

        if (!perfil) {
            return res.status(404).json({ codigo: 'PERFIL_NO_ENCONTRADO', mensaje: 'No se encontraron los datos.' });
        }

        const response = {
            foto_perfil_url: perfil.foto_perfil_url || "https://atria.com/profiles/default.jpg",
            nombre_completo: perfil.nombre_completo,
            correo_electronico: perfil.usuarios?.correo_electronico || "Sin correo vinculado", 
            fecha_nacimiento: perfil.fecha_nacimiento,
            peso: perfil.peso,
            altura: perfil.altura,
            tipo_sangre: perfil.tipo_sangre,
            telefono: perfil.telefono,
            direccion_completa: perfil.direccion_completa
        };

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

/**
 * Obtiene la línea de tiempo de diagnósticos y consultas médicas.
 */
const obtenerHistorialMedico = async (req, res, next) => {
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
 */
const obtenerHistorialPagos = async (req, res, next) => {
    try {
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

/**
 * Actualiza la información personal y de contacto del paciente.
 * @param {import('express').Request} req - Petición. El body debe contener peso, altura, telefono y direccion.
 * @param {import('express').Response} res - Respuesta.
 * @param {import('express').NextFunction} next - Middleware de errores.
 */
const actualizarPerfil = async (req, res, next) => {
    try {
        const pacienteId = req.user.id_paciente || req.user.id;
        
        const { peso, altura, telefono, direccion_completa } = req.body;

        const datosAActualizar = {};
        if (peso !== undefined) datosAActualizar.peso = peso;
        if (altura !== undefined) datosAActualizar.altura = altura;
        if (telefono !== undefined) datosAActualizar.telefono = telefono;
        if (direccion_completa !== undefined) datosAActualizar.direccion_completa = direccion_completa;

        const perfilActualizado = await prisma.perfiles_paciente.update({
            where: { id_usuario: pacienteId },
            data: datosAActualizar
        });

        res.status(200).json({
            mensaje: "Perfil actualizado con éxito.",
            perfil: {
                peso: perfilActualizado.peso,
                altura: perfilActualizado.altura,
                telefono: perfilActualizado.telefono,
                direccion_completa: perfilActualizado.direccion_completa
            }
        });

    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({
                codigo: "NOT_FOUND",
                mensaje: "No se encontró el perfil del paciente para actualizar."
            });
        }
        next(error);
    }
};

/**
 * Procesa el pago de una transacción pendiente en el historial.
 * @param {import('express').Request} req - Petición. params: id_transaccion, body: metodo_pago_id.
 * @param {import('express').Response} res - Respuesta.
 * @param {import('express').NextFunction} next - Middleware de errores.
 */
const pagarTransaccionPendiente = async (req, res, next) => {
    try {
        const { id_transaccion } = req.params;
        const { metodo_pago_id } = req.body;

        res.status(200).json({
            nuevo_estado: "PAGADO"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    obtenerInicio,
    obtenerCitasProximas,
    obtenerCitasPasadas,
    obtenerDetallesPerfil,
    obtenerHistorialMedico,
    obtenerHistorialPagos,
    actualizarPerfil, 
    pagarTransaccionPendiente 
};