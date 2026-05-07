/**
 * @file Controlador para el flujo de agendamiento de citas (Reserva Médica).
 */

const prisma = require('../config/db');

/**
 * Paso 1: Obtiene la lista de especialidades médicas.
 * @param {import('express').Request} req Objeto de petición Express.
 * @param {import('express').Response} res Objeto de respuesta Express.
 * @param {import('express').NextFunction} next Función para pasar errores al middleware global.
 */
const obtenerEspecialidades = async (req, res, next) => {
    try {
        const especialidadesDb = await prisma.catalogo_especialidades.findMany({
            orderBy: { nombre: 'asc' } 
        });

        const especialidadesMapeadas = especialidadesDb.map(esp => {
            return {
                id_especialidad: esp.id,
                nombre_especialidad: esp.nombre,
                descripcion_corta: esp.descripcion_corta || "Especialidad médica general",
                icono_id: esp.icono_id || "medical-bag" 
            };
        });

        res.status(200).json({
            especialidades: especialidadesMapeadas
        });
    } catch (error) { 
        next(error); 
    }
};

/**
 * Paso 2: Obtiene la lista de sucursales/clínicas activas.
 * @param {import('express').Request} req Objeto de petición Express.
 * @param {import('express').Response} res Objeto de respuesta Express.
 * @param {import('express').NextFunction} next Función para pasar errores al middleware global.
 */

const obtenerSucursales = async (req, res, next) => {
    try {
        const sucursalesDb = await prisma.sucursales.findMany({
            where: { is_active: true }, 
            orderBy: { nombre: 'asc' }
        });

        const sucursalesMapeadas = sucursalesDb.map(sucursal => ({
            id_sucursal: sucursal.id,
            nombre_sucursal: sucursal.nombre,
            direccion_completa: sucursal.direccion_completa || "Dirección pendiente",
            coordenadas: { 
                latitud: sucursal.latitud ? Number(sucursal.latitud) : 24.8083, 
                longitud: sucursal.longitud ? Number(sucursal.longitud) : -107.3938 
            }
        }));

        res.status(200).json({
            sucursales: sucursalesMapeadas
        });
    } catch (error) { 
        next(error); 
    }
};

/**
 * Paso 3: Obtiene los doctores filtrados por especialidad (y sucursal opcional).
 * @param {import('express').Request} req Objeto de petición Express.
 * @param {import('express').Response} res Objeto de respuesta Express.
 * @param {import('express').NextFunction} next Función para pasar errores al middleware global.
 */
const obtenerDoctores = async (req, res, next) => {
    try {
        const { especialidad_id, sucursal_id } = req.query;

        const queryWhere = {};
        
        if (especialidad_id) {
            queryWhere.id_especialidad = especialidad_id;
        }

        if (sucursal_id) {
            queryWhere.usuarios = {
                horarios_doctor: {
                    some: { consultorios: { id_sucursal: sucursal_id } }
                }
            };
        }

        const doctoresDb = await prisma.perfiles_doctor.findMany({
            where: queryWhere,
            include: { catalogo_especialidades: true },
            orderBy: { nombre_completo: 'asc' }
        });

        const doctoresMapeados = doctoresDb.map(doctor => ({
            id_doctor: doctor.id_usuario, 
            nombre_doctor: doctor.nombre_completo,
            foto_url: doctor.foto_perfil_url || "https://atria.com/profiles/default.jpg",
            promedio_calificacion: doctor.promedio_calificacion ? parseFloat(doctor.promedio_calificacion) : 5.0,
            experiencia_anios: doctor.experiencia_anios || 5,
            especialidad_titulo: doctor.catalogo_especialidades?.nombre || "Médico Especialista"
        }));

        res.status(200).json({ especialistas: doctoresMapeados });
    } catch (error) { 
        next(error); 
    }
};

/**
 * Paso 4: Obtiene la disponibilidad (días y horas) de un doctor. 
 * @param {import('express').Request} req Objeto de petición Express.
 * @param {import('express').Response} res Objeto de respuesta Express.
 * @param {import('express').NextFunction} next Función para pasar errores al middleware global.
*/
const obtenerDisponibilidad = async (req, res, next) => {
    try {
        const { id_doctor } = req.query;

        const horariosDb = await prisma.horarios_doctor.findMany({
            where: { id_doctor: id_doctor },
            include: { 
                consultorios: { 
                    include: { sucursales: true } 
                } 
            }
        });

        if (horariosDb.length === 0) {
            return res.status(200).json({ 
                dias_disponibles: [], 
                horarios_por_dia: [] 
            });
        }
        const fechaInicio = new Date();
        fechaInicio.setHours(0, 0, 0, 0); 
        
        const fechaFin = new Date(fechaInicio);
        fechaFin.setDate(fechaFin.getDate() + 7); 

        const citasOcupadas = await prisma.citas.findMany({
            where: {
                id_doctor: id_doctor,
                fecha_hora_inicio: { gte: fechaInicio, lt: fechaFin },
                estatus: { 
                    in: ['Confirmada', 'Reservado_Temporal'] 
                } 
            }
        });

        const citasBloqueadasSet = new Set(
            citasOcupadas.map(cita => cita.fecha_hora_inicio.toISOString())
        );

        const dias_disponibles = [];
        const horarios_por_dia = [];

        for (let i = 0; i < 7; i++) {
            const fechaActual = new Date(fechaInicio);
            fechaActual.setDate(fechaActual.getDate() + i);
            
            let diaSemana = fechaActual.getDay(); 
            if (diaSemana === 0) diaSemana = 7; 

            const horariosDelDia = horariosDb.filter(h => h.dia_semana === diaSemana);

            if (horariosDelDia.length > 0) {
                const fechaString = fechaActual.toISOString().split('T')[0];
                dias_disponibles.push(fechaString); 

                horariosDelDia.forEach(horarioBase => {
                    const duracionMinutos = horarioBase.duracion_cita_minutos || 60;

                    let bloqueActual = new Date(fechaActual);
                    bloqueActual.setHours(
                        horarioBase.hora_inicio.getUTCHours(), 
                        horarioBase.hora_inicio.getUTCMinutes(), 
                        0, 0
                    );

                    const topeFin = new Date(fechaActual);
                    topeFin.setHours(
                        horarioBase.hora_fin.getUTCHours(), 
                        horarioBase.hora_fin.getUTCMinutes(), 
                        0, 0
                    );

                    while (bloqueActual < topeFin) {
                        const isoString = bloqueActual.toISOString();
                        
                        const estado = citasBloqueadasSet.has(isoString) ? "ocupado" : "disponible";

                        horarios_por_dia.push({
                            fecha: fechaString,
                            hora_formateada: bloqueActual.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            fecha_hora_iso: isoString, 
                            sucursal: horarioBase.consultorios?.sucursales?.nombre || "Clínica Atria",
                            duracion_estimada: `${duracionMinutos} min`,
                            estado: estado
                        });
                        
                        bloqueActual.setMinutes(bloqueActual.getMinutes() + duracionMinutos);
                    }
                });
            }
        }

        res.status(200).json({
            dias_disponibles,
            horarios_por_dia
        });
    } catch (error) { 
        next(error); 
    }
};

/**
 * Paso 5: Resumen final antes del pago.
 * @param {import('express').Request} req Objeto de petición Express.
 * @param {import('express').Response} res Objeto de respuesta Express.
 * @param {import('express').NextFunction} next Función para pasar errores al middleware global.
*/
const obtenerResumenReserva = async (req, res, next) => {
    try {
        const { id_doctor, id_sucursal, fecha_hora_inicio } = req.query;
        
        const id_usuario_paciente = req.user.id_paciente || req.user.id; 

        const [doctorDb, sucursalDb, pacienteDb] = await Promise.all([
            prisma.perfiles_doctor.findUnique({
                where: { id_usuario: id_doctor },
                include: { catalogo_especialidades: true }
            }),
            prisma.sucursales.findUnique({
                where: { id: id_sucursal }
            }),
            prisma.perfiles_paciente.findUnique({
                where: { id_usuario: id_usuario_paciente }
            })
        ]);

        if (!doctorDb || !sucursalDb) {
            return res.status(404).json({
                codigo: "NOT_FOUND",
                mensaje: "El doctor o la sucursal seleccionada no existen."
            });
        }

        const costoBase = doctorDb.costo_consulta_actual ? parseFloat(doctorDb.costo_consulta_actual) : 0.00;
        
        const tasaIva = 0.16;
        const montoIva = costoBase * tasaIva;
        const totalFinal = costoBase + montoIva;

        const fechaObj = new Date(fecha_hora_inicio);
        const fechaTexto = fechaObj.toLocaleDateString('es-MX', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
        });
        const horaTexto = fechaObj.toLocaleTimeString('es-MX', { 
            hour: '2-digit', minute: '2-digit' 
        });

        res.status(200).json({
            resumen: {
                paciente: {
                    nombre: pacienteDb?.nombre_completo || "Paciente Registrado",
                },
                doctor: {
                    id: id_doctor,
                    nombre: doctorDb.nombre_completo,
                    especialidad: doctorDb.catalogo_especialidades?.nombre || "Médico Especialista"
                },
                clinica: {
                    id: id_sucursal,
                    nombre: sucursalDb.nombre,
                    direccion: sucursalDb.direccion_completa
                },
                cita: {
                    fecha_iso: fecha_hora_inicio,
                    fecha_texto: fechaTexto.charAt(0).toUpperCase() + fechaTexto.slice(1),
                    hora_texto: horaTexto
                },
                pago: {
                    moneda: "MXN",
                    subtotal: costoBase,
                    iva: montoIva,
                    total: totalFinal,
                    mensaje_informativo: "Este monto representa el costo total de la consulta."
                }
            }
        });
    } catch (error) {
        next(error);
    }
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
        
        const id_paciente = req.user.id_paciente || req.user.id; 
        const fechaInicioDate = new Date(fecha_hora_inicio);

        const resultadoCita = await prisma.$transaction(async (tx) => {

            if (fechaInicioDate < new Date()) {
                throw new Error("FECHA_PASADA");
            }
            
            const citaExistente = await tx.citas.findFirst({
                where: {
                    id_doctor: id_doctor,
                    fecha_hora_inicio: fechaInicioDate,
                    estatus: { in: ['Confirmada', 'Reservado_Temporal'] }
                }
            });

            if (citaExistente) {
                throw new Error("HORARIO_OCUPADO");
            }

            const [horarioDoctor, perfilDoctor] = await Promise.all([
                tx.horarios_doctor.findFirst({
                    where: {
                        id_doctor: id_doctor,
                        consultorios: { id_sucursal: id_sucursal }
                    },
                    include: { consultorios: true }
                }),
                tx.perfiles_doctor.findUnique({
                    where: { id_usuario: id_doctor }
                })
            ]);

            if (!horarioDoctor || !perfilDoctor) {
                throw new Error("DATOS_INCONSISTENTES");
            }

            const duracion = horarioDoctor.duracion_cita_minutos || 60;
            const fechaFinDate = new Date(fechaInicioDate.getTime() + duracion * 60000);

            const costoBase = perfilDoctor.costo_consulta_actual ? parseFloat(perfilDoctor.costo_consulta_actual) : 0.00;
            const iva = costoBase * 0.16;
            const costoTotalFinal = costoBase + iva;

            const nuevaCita = await tx.citas.create({
                data: {
                    id_paciente: id_paciente,
                    id_doctor: id_doctor,
                    id_consultorio: horarioDoctor.id_consultorio,
                    fecha_hora_inicio: fechaInicioDate,
                    fecha_hora_fin: fechaFinDate,
                    estatus: 'Confirmada',
                    costo_total_fijado: costoTotalFinal
                }
            });

            return nuevaCita;
        });

        res.status(201).json({
            mensaje: "¡Reserva confirmada con éxito!",
            cita: resultadoCita
        });

    } catch (error) {
        if (error.message === "HORARIO_OCUPADO") {
            return res.status(409).json({
                codigo: "CONFLICT",
                mensaje: "Lo sentimos, este horario acaba de ser reservado por otro paciente. Por favor, elige otro."
            });
        }
        if (error.message === "DATOS_INCONSISTENTES") {
            return res.status(400).json({
                codigo: "BAD_REQUEST",
                mensaje: "El doctor seleccionado no atiende en esta sucursal."
            });
        }
        if(error.message == "FECHA_PASADA"){
            return res.status(400).json({
                codigo: "BAD_REQUEST",
                mensaje: "No puedes reservar una cita en una fecha y hora que ya pasó."
            });
        }
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
        
        const id_paciente = req.user.id_paciente || req.user.id;

        const cita = await prisma.citas.findUnique({
            where: { id: id_cita }
        });

        if (!cita) {
            return res.status(404).json({
                codigo: "NOT_FOUND",
                mensaje: "La cita indicada no existe."
            });
        }

        if (cita.id_paciente !== id_paciente) {
            return res.status(403).json({
                codigo: "FORBIDDEN",
                mensaje: "No tienes permiso para cancelar esta cita."
            });
        }

        if (cita.estatus === 'Cancelada' || cita.estatus === 'Finalizada') {
            return res.status(400).json({
                codigo: "BAD_REQUEST",
                mensaje: `La cita ya se encuentra en estado: ${cita.estatus}.`
            });
        }

        const ahora = new Date();
        if (cita.fecha_hora_inicio < ahora) {
            return res.status(400).json({
                codigo: "BAD_REQUEST",
                mensaje: "No puedes cancelar una cita que ya ocurrió en el pasado."
            });
        }

        const citaCancelada = await prisma.citas.update({
            where: { id: id_cita },
            data: { 
                estatus: 'Cancelada',
                motivo_cancelacion: motivo_cancelacion || "Motivo no especificado",
            }
        });

        res.status(200).json({
            mensaje: "La cita ha sido cancelada exitosamente.",
            cita: {
                id: citaCancelada.id,
                estatus: citaCancelada.estatus,
                fecha_hora: citaCancelada.fecha_hora_inicio
            }
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