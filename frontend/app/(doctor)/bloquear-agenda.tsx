import React, { useState, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, Modal, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';

import { Typography } from '../../components/ui/Typography';
import { Boton } from '../../components/ui/Boton';
import { Icono } from '../../components/ui/Icono';
import { Card } from '../../components/ui/Card';

// Hook generado por Orval
import { useBloquearAgenda } from '../../api/doctor-acciones/doctor-acciones';
import { CampoTexto } from '../../components/ui/CampoTexto';

// Configuración del calendario en español
LocaleConfig.locales['es'] = {
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthNamesShort: ['Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.', 'Jul.', 'Ago.', 'Sep.', 'Oct.', 'Nov.', 'Dic.'],
    dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    dayNamesShort: ['DO', 'LU', 'MA', 'MI', 'JU', 'VI', 'SA'],
    today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

export default function BloquearAgendaScreen() {
    const router = useRouter();

    // 1. Estados para el Rango de Fechas
    const [fechaInicio, setFechaInicio] = useState<string | null>(null);
    const [fechaFin, setFechaFin] = useState<string | null>(null);

    // 2. Estados para Horario
    const [horaInicio, setHoraInicio] = useState('08:00');
    const [horaFin, setHoraFin] = useState('20:00');

    // 3. Estados para el Modal de Aviso (Atria Standard)
    const [modalVisible, setModalVisible] = useState(false);
    const [modalConfig, setModalConfig] = useState({ titulo: '', mensaje: '', esExito: false });

    // Estados para manejar los objetos Date internos del picker
    const [tempHoraInicio, setTempHoraInicio] = useState(new Date(new Date().setHours(8, 0, 0, 0)));
    const [tempHoraFin, setTempHoraFin] = useState(new Date(new Date().setHours(20, 0, 0, 0)));

    // Estados para mostrar/ocultar los pickers
    const [showPickerHoraInicio, setShowPickerHoraInicio] = useState(false);
    const [showPickerHoraFin, setShowPickerHoraFin] = useState(false);

    // Función para formatear la hora de Date a String HH:mm para la UI y API
    const formatearHora = (date: Date) => {
        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    const { mutate: ejecutarBloqueo, isPending } = useBloquearAgenda({
        mutation: {
            onSuccess: () => mostrarAviso("🚨 Agenda Actualizada", "El horario ha sido bloqueado exitosamente.", true),
            onError: () => mostrarAviso("❌ Error", "Conflicto detectado: Verifica que no existan citas en este horario.")
        }
    });

    const mostrarAviso = (titulo: string, mensaje: string, esExito: boolean = false) => {
        setModalConfig({ titulo, mensaje, esExito });
        setModalVisible(true);
    };

    // 4. Lógica para marcar el rango en el calendario
    const onDayPress = (day: any) => {
        if (!fechaInicio || (fechaInicio && fechaFin)) {
            setFechaInicio(day.dateString);
            setFechaFin(null);
        } else if (day.dateString >= fechaInicio) {
            setFechaFin(day.dateString);
        } else {
            setFechaInicio(day.dateString);
            setFechaFin(null);
        }
    };

    const markedDates = useMemo(() => {
        if (!fechaInicio) return {};
        let marked: any = {
            [fechaInicio]: { startingDay: true, color: '#8B5E3C', textColor: 'white' }
        };

        if (fechaFin) {
            marked[fechaFin] = { endingDay: true, color: '#8B5E3C', textColor: 'white' };

            // Lógica para rellenar los días intermedios con color crema
            let start = new Date(fechaInicio);
            let end = new Date(fechaFin);
            for (let d = new Date(start.setDate(start.getDate() + 1)); d < end; d.setDate(d.getDate() + 1)) {
                const dateString = d.toISOString().split('T')[0];
                marked[dateString] = { color: '#F4EFEA', textColor: '#8B5E3C' };
            }
        }
        return marked;
    }, [fechaInicio, fechaFin]);

    const manejarConfirmacion = () => {
        if (!fechaInicio || !fechaFin) {
            mostrarAviso("Datos incompletos", "Por favor selecciona un rango de fechas en el calendario.");
            return;
        }
        ejecutarBloqueo({
            data: {
                fecha_inicio: fechaInicio,
                fecha_fin: fechaFin,
                hora_inicio: horaInicio,
                hora_fin: horaFin
            }
        });
    };

    return (
        <SafeAreaView className="flex-1 bg-atria-crema">
            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>

                {/* CABECERA */}
                <View className="flex-row items-center mt-6 mb-8">
                    <TouchableOpacity onPress={() => router.back()} className="bg-white p-2 rounded-full shadow-sm">
                        <Icono nombre="chevron-left" familia="Feather" color="oscuro" tamaño={24} />
                    </TouchableOpacity>
                    <Typography variant="h1" className="ml-5 text-2xl">Bloquear Horario</Typography>
                </View>

                {/* CALENDARIO DE RANGO */}
                <View className="mb-6">
                    <Typography variant="subtitle" className="mb-4">Rango de Fechas</Typography>
                    <Card className="p-0 overflow-hidden" borde="arriba">
                        <Calendar
                            markingType={'period'}
                            markedDates={markedDates}
                            onDayPress={onDayPress}
                            minDate={new Date().toISOString().split('T')[0]}
                            theme={{
                                calendarBackground: '#ffffff',
                                textSectionTitleColor: '#8B9491',
                                selectedDayBackgroundColor: '#8B5E3C',
                                selectedDayTextColor: '#ffffff',
                                todayTextColor: '#8B5E3C',
                                dayTextColor: '#222B27',
                                textDisabledColor: '#E5E7EB',
                                monthTextColor: '#222B27',
                                textMonthFontWeight: 'bold',
                                arrowColor: '#8B5E3C',
                            }}
                        />
                    </Card>
                </View>

                {/* --- SECCIÓN: RANGO DE HORARIO --- */}
                <View className="mb-10">
                    <Typography variant="subtitle" className="mb-4">Rango de Horario</Typography>

                    <Card className="p-5 flex-row justify-between bg-white shadow-lg">

                        {/* Selector HORA INICIO */}
                        <TouchableOpacity
                            onPress={() => setShowPickerHoraInicio(true)}
                            activeOpacity={0.7}
                            className="flex-1 mr-2 items-center p-4 rounded-2xl bg-atria-crema/50 border border-atria-gris-claro"
                        >
                            <Typography variant="subtitle" className="text-[10px] mb-2">Inicio</Typography>
                            <View className="flex-row items-center">
                                <Icono nombre="time-outline" familia="Ionicons" tamaño={20} color="cafe" />
                                <Typography variant="h2" className="ml-2 text-atria-cafe">
                                    {formatearHora(tempHoraInicio)}
                                </Typography>
                            </View>
                        </TouchableOpacity>

                        {/* Selector HORA FIN */}
                        <TouchableOpacity
                            onPress={() => setShowPickerHoraFin(true)}
                            activeOpacity={0.7}
                            className="flex-1 ml-2 items-center p-4 rounded-2xl bg-atria-crema/50 border border-atria-gris-claro"
                        >
                            <Typography variant="subtitle" className="text-[10px] mb-2">Fin</Typography>
                            <View className="flex-row items-center">
                                <Icono nombre="time-outline" familia="Ionicons" tamaño={20} color="cafe" />
                                <Typography variant="h2" className="ml-2 text-atria-cafe">
                                    {formatearHora(tempHoraFin)}
                                </Typography>
                            </View>
                        </TouchableOpacity>

                    </Card>

                    {/* PICKERS NATIVOS (Se activan al tocar las tarjetas) */}
                    {showPickerHoraInicio && (
                        <DateTimePicker
                            value={tempHoraInicio}
                            mode="time"
                            is24Hour={true}
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={(event, date) => {
                                if (Platform.OS === 'android') setShowPickerHoraInicio(false);
                                if (date) {
                                    setTempHoraInicio(date);
                                    setHoraInicio(formatearHora(date)); // Actualiza el string para la API
                                }
                            }}
                        />
                    )}

                    {showPickerHoraFin && (
                        <DateTimePicker
                            value={tempHoraFin}
                            mode="time"
                            is24Hour={true}
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={(event, date) => {
                                if (Platform.OS === 'android') setShowPickerHoraFin(false);
                                if (date) {
                                    setTempHoraFin(date);
                                    setHoraFin(formatearHora(date)); // Actualiza el string para la API
                                }
                            }}
                        />
                    )}
                </View>

                <Boton
                    texto={isPending ? "Procesando..." : "Confirmar Bloqueo"}
                    variante={isPending ? "inactivo" : "primario"}
                    onPress={manejarConfirmacion}
                >
                    <Icono nombre="lock-closed-outline" familia="Ionicons" tamaño={20} />
                </Boton>

                <View className="h-10" />
            </ScrollView>

            {/* MODAL DE AVISO */}
            <Modal animationType="fade" transparent={true} visible={modalVisible}>
                <View className="flex-1 justify-center items-center bg-black/50 p-6">
                    <View className="bg-white w-full max-w-sm p-8 rounded-3xl items-center shadow-xl">
                        <Typography variant="h2" className="text-atria-cafe mb-4 text-center">{modalConfig.titulo}</Typography>
                        <Typography variant="body" className="text-center text-atria-gris mb-6">{modalConfig.mensaje}</Typography>
                        <TouchableOpacity className="bg-atria-cafe py-2 px-8 rounded-full" onPress={() => { setModalVisible(false); if (modalConfig.esExito) router.back(); }}>
                            <Typography variant="button" className="text-white">Entendido</Typography>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}