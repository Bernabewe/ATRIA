import React, { useState } from 'react';
import { View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Typography } from '../../components/ui/Typography';
import { Card } from '../../components/ui/Card';
import { Icono } from '../../components/ui/Icono';
import { Tabs } from '../../components/ui/Tabs';
import { Boton } from '../../components/ui/Boton';

// Importamos el hook generado por Orval
import { useObtenerAgendaDoctor } from '../../api/doctor-vistas/doctor-vistas';

export default function AgendaDoctorScreen() {
    const router = useRouter();

    // 1. Estados para los filtros. Usamos la fecha de hoy automáticamente.
    const [fecha] = useState(new Date().toISOString().split('T')[0]);
    const [pestana, setPestana] = useState<'PROXIMAS' | 'PASADAS'>('PROXIMAS');

    // 2. Consumo de la API
    const { data, isLoading } = useObtenerAgendaDoctor({
        fecha: fecha,
        pestana: pestana
    });

    return (
        <SafeAreaView className="flex-1 bg-atria-crema">
            <View className="flex-1 bg-atria-crema p-6">
                <Typography variant="h1" className="mb-6 mt-10 text-3xl">Agenda</Typography>

                {/* --- PESTAÑAS (TABS) --- */}
                <Tabs
                    opciones={['PROXIMAS', 'PASADAS']}
                    seleccionado={pestana}
                    onChange={(val) => setPestana(val as 'PROXIMAS' | 'PASADAS')}
                />

                {isLoading ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color="#8B5E3C" />
                    </View>
                ) : (
                    <ScrollView showsVerticalScrollIndicator={false} className="flex-1">

                        {pestana === 'PROXIMAS' ? (
                            <View>
                                {/* --- SECCIÓN: SIGUIENTE CITA --- */}
                                <Typography variant="subtitle" className="mb-4">Siguiente Cita</Typography>

                                {data?.cita_destacada ? (
                                    <Card borde="izquierda" className="mb-8 p-6">
                                        <View className="mb-4">
                                            <Typography variant="h2" className="text-xl mb-1">
                                                {data.cita_destacada.nombre_paciente}
                                            </Typography>
                                            <Typography variant="h3" className="text-atria-cafe font-bold text-lg">
                                                {data.cita_destacada.hora}
                                            </Typography>
                                        </View>

                                        <View className="flex-row border-t border-gray-100 pt-4 mb-6">
                                            <View className="flex-row items-center flex-1 border-r border-gray-100 pr-2">
                                                <Icono nombre="calendar-outline" familia="Ionicons" tamaño={18} color="cafe" />
                                                <Typography variant="caption" className="ml-2 italic">
                                                    {data.cita_destacada.fecha_formateada}
                                                </Typography>
                                            </View>
                                            <View className="flex-row items-center flex-1 pl-2">
                                                <Icono nombre="location-outline" familia="Ionicons" tamaño={18} color="cafe" />
                                                <Typography variant="caption" className="ml-2 italic">
                                                    {data.cita_destacada.ubicacion}
                                                </Typography>
                                            </View>
                                        </View>

                                        <Boton
                                            texto="Ver Detalles ➔"
                                            onPress={() => router.push(`/gestionar-cita?id_cita=${data.cita_destacada?.id_cita}`)}
                                        />
                                    </Card>
                                ) : (
                                    <Card className="mb-8 items-center py-6">
                                        <Typography variant="body" className="text-atria-gris">No hay citas pendientes.</Typography>
                                    </Card>
                                )}

                                {/* --- SECCIÓN: RESTO DEL DÍA --- */}
                                <Typography variant="subtitle" className="mb-4">Resto del día</Typography>
                                {data?.citas_lista?.map((cita) => (
                                    <Card key={cita.id_cita} className="flex-row items-center justify-between p-4 mb-4">
                                        <View className="flex-1">
                                            <Typography variant="h3" className="text-base">{cita.nombre_paciente}</Typography>
                                            <Typography variant="caption" className="text-atria-cafe font-bold">{cita.hora}</Typography>
                                        </View>
                                        <TouchableOpacity
                                            className="bg-atria-crema p-2 rounded-full"
                                            onPress={() => router.push(`/gestionar-cita?id_cita=${cita.id_cita}`)}
                                        >
                                            <Icono nombre="chevron-right" familia="Feather" tamaño={20} color="cafe" />
                                        </TouchableOpacity>
                                    </Card>
                                ))}
                            </View>
                        ) : (
                            <View>
                                {/* --- SECCIÓN: HISTORIAL --- */}
                                <Typography variant="subtitle" className="mb-4">Historial de citas</Typography>
                                {data?.citas_lista?.map((cita) => (
                                    <Card key={cita.id_cita} className="p-4 mb-4" borde="izquierda">
                                        <Typography variant="h3">{cita.nombre_paciente}</Typography>
                                        <Typography variant="body" className="text-atria-gris">
                                            {cita.fecha_formateada} • {cita.hora}
                                        </Typography>
                                        <View className="mt-2 self-start bg-gray-100 px-3 py-1 rounded-full">
                                            <Typography variant="caption" className="font-medium">Finalizada</Typography>
                                        </View>
                                    </Card>
                                ))}
                            </View>
                        )}

                        <View className="h-10" />
                    </ScrollView>
                )}
            </View>
        </SafeAreaView>
    );
}