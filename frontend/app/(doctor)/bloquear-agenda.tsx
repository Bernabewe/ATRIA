import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Platform, Modal } from 'react-native'; // Modal agregado
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { Typography } from '../../components/ui/Typography';
import { Boton } from '../../components/ui/Boton';
import { Icono } from '../../components/ui/Icono';
import { Card } from '../../components/ui/Card';
import { CampoTexto } from '../../components/ui/CampoTexto';

// Hook generado por Orval
import { useBloquearAgenda } from '../../api/doctor-acciones/doctor-acciones';

export default function BloquearAgendaScreen() {
    const router = useRouter();

    // 1. Estados para los datos de la API
    const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().split('T')[0]);
    const [fechaFin, setFechaFin] = useState(new Date().toISOString().split('T')[0]);
    const [horaInicio, setHoraInicio] = useState('08:00');
    const [horaFin, setHoraFin] = useState('16:00');

    // 2. Estados para el Calendario
    const [tempFechaInicio, setTempFechaInicio] = useState(new Date());
    const [tempFechaFin, setTempFechaFin] = useState(new Date());
    const [showPickerInicio, setShowPickerInicio] = useState(false);
    const [showPickerFin, setShowPickerFin] = useState(false);

    // 3. ESTADOS PARA EL MODAL DE AVISO
    const [modalVisible, setModalVisible] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        titulo: '',
        mensaje: '',
        esExito: false
    });

    const mostrarAviso = (titulo: string, mensaje: string, esExito: boolean = false) => {
        setModalConfig({ titulo, mensaje, esExito });
        setModalVisible(true);
    };

    const manejarCerrarModal = () => {
        setModalVisible(false);
        if (modalConfig.esExito) {
            router.back(); // Si fue éxito, regresamos al cerrar
        }
    };

    const formatearFechaParaAPI = (date: Date) => date.toISOString().split('T')[0];

    const formatearFechaParaUI = (dateString: string) => {
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const onChangeInicio = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (Platform.OS === 'android') setShowPickerInicio(false);
        if (selectedDate) {
            setTempFechaInicio(selectedDate);
            setFechaInicio(formatearFechaParaAPI(selectedDate));
        }
    };

    const onChangeFin = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (Platform.OS === 'android') setShowPickerFin(false);
        if (selectedDate) {
            setTempFechaFin(selectedDate);
            setFechaFin(formatearFechaParaAPI(selectedDate));
        }
    };

    // 4. Mutación con el Modal configurado
    const { mutate: ejecutarBloqueo, isPending } = useBloquearAgenda({
        mutation: {
            onSuccess: () => {
                mostrarAviso("🚨 Agenda Actualizada", "El horario ha sido bloqueado exitosamente.", true);
            },
            onError: () => {
                mostrarAviso("❌ Error", "No se pudo realizar el bloqueo. Verifica que no tengas citas agendadas en ese rango.");
            }
        }
    });

    const manejarConfirmacion = () => {
        if (new Date(fechaFin) < new Date(fechaInicio)) {
            mostrarAviso("Fecha inválida", "La fecha 'Hasta' no puede ser anterior a la fecha 'Desde'.");
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

                {/* --- CABECERA --- */}
                <View className="flex-row items-center mt-6 mb-10">
                    <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} className="bg-white p-2 rounded-full shadow-sm">
                        <Icono nombre="chevron-left" familia="Feather" color="oscuro" tamaño={24} />
                    </TouchableOpacity>
                    <Typography variant="h1" className="ml-5 text-3xl text-atria-oscuro">Bloquear Horario</Typography>
                </View>

                {/* --- SECCIÓN DÍAS --- */}
                <Card className="mb-6 p-6 shadow-lg bg-white">
                    <View className="flex-row items-center mb-5 border-b border-gray-100 pb-3">
                        <Icono nombre="calendar-outline" familia="Ionicons" color="cafe" tamaño={22} />
                        <Typography variant="subtitle" className="ml-3 text-lg font-bold">Rango de días</Typography>
                    </View>

                    <View className="flex-row justify-between">
                        <TouchableOpacity
                            className="w-[48%] border border-gray-200 rounded-2xl p-4 bg-gray-50"
                            onPress={() => setShowPickerInicio(!showPickerInicio)}
                        >
                            <Typography variant="caption" className="text-atria-gris mb-1">Desde</Typography>
                            <Typography variant="body" className="font-medium text-atria-oscuro">{formatearFechaParaUI(fechaInicio)}</Typography>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="w-[48%] border border-gray-200 rounded-2xl p-4 bg-gray-50"
                            onPress={() => setShowPickerFin(!showPickerFin)}
                        >
                            <Typography variant="caption" className="text-atria-gris mb-1">Hasta</Typography>
                            <Typography variant="body" className="font-medium text-atria-oscuro">{formatearFechaParaUI(fechaFin)}</Typography>
                        </TouchableOpacity>
                    </View>

                    {showPickerInicio && (
                        <View className="mt-4 border-t border-gray-100 pt-4 items-center">
                            <DateTimePicker
                                value={tempFechaInicio}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                                onChange={onChangeInicio}
                                locale="es-ES"
                                minimumDate={new Date()}
                                accentColor="#8B5E3C"
                            />
                            {Platform.OS === 'ios' && <Boton texto="Aceptar" variante="secundario" className="mt-2 w-full" onPress={() => setShowPickerInicio(false)} />}
                        </View>
                    )}

                    {showPickerFin && (
                        <View className="mt-4 border-t border-gray-100 pt-4 items-center">
                            <DateTimePicker
                                value={tempFechaFin}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                                onChange={onChangeFin}
                                locale="es-ES"
                                minimumDate={tempFechaInicio}
                                accentColor="#8B5E3C"
                            />
                            {Platform.OS === 'ios' && <Boton texto="Aceptar" variante="secundario" className="mt-2 w-full" onPress={() => setShowPickerFin(false)} />}
                        </View>
                    )}
                </Card>

                {/* --- SECCIÓN HORARIO --- */}
                <Card className="mb-10 p-6 shadow-lg bg-white">
                    <View className="flex-row items-center mb-5 border-b border-gray-100 pb-3">
                        <Icono nombre="time-outline" familia="Ionicons" color="cafe" tamaño={22} />
                        <Typography variant="subtitle" className="ml-3 text-lg font-bold">Rango de horario</Typography>
                    </View>

                    <View className="flex-row justify-between">
                        <View className="w-[48%]">
                            <Typography variant="caption" className="text-atria-gris mb-1">Desde</Typography>
                            <CampoTexto
                                placeholder="08:00"
                                icono="clock"
                                value={horaInicio}
                                onChangeText={setHoraInicio}
                                keyboardType="numbers-and-punctuation"
                            />
                        </View>
                        <View className="w-[48%]">
                            <Typography variant="caption" className="text-atria-gris mb-1">Hasta</Typography>
                            <CampoTexto
                                placeholder="16:00"
                                icono="clock"
                                value={horaFin}
                                onChangeText={setHoraFin}
                                keyboardType="numbers-and-punctuation"
                            />
                        </View>
                    </View>
                </Card>

                <View className="mb-10">
                    <Boton
                        texto={isPending ? "Procesando..." : "Confirmar Bloqueo"}
                        variante={isPending ? "inactivo" : "primario"}
                        onPress={manejarConfirmacion}
                    >
                        <Icono nombre="lock-closed-outline" familia="Ionicons" tamaño={20} />
                    </Boton>
                </View>

                <View className="h-10" />
            </ScrollView>

            {/* --- MODAL DE AVISO PERSONALIZADO --- */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/50 p-6">
                    <View className="bg-white w-full max-w-sm p-8 rounded-3xl items-center shadow-xl">
                        <Typography variant="h2" className="text-atria-cafe mb-4 text-center">
                            {modalConfig.titulo}
                        </Typography>

                        <Typography variant="body" className="text-center text-atria-gris mb-6">
                            {modalConfig.mensaje}
                        </Typography>

                        <TouchableOpacity
                            className="bg-atria-cafe py-2 px-8 rounded-full"
                            onPress={manejarCerrarModal}
                        >
                            <Typography variant="button" className="text-white">Entendido</Typography>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}