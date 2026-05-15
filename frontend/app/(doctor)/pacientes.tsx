import React, { useState } from 'react';
import { View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Typography } from '../../components/ui/Typography';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Boton } from '../../components/ui/Boton';
import { BarraBusqueda } from '../../components/ui/BarraBusqueda';

// Hook generado por Orval
import { useObtenerPacientes } from '../../api/doctor-vistas/doctor-vistas';

export default function MisPacientesScreen() {
    const router = useRouter();
    const [busqueda, setBusqueda] = useState('');

    // 1. Hook de Orval con filtro de búsqueda
    const { data, isLoading, isFetching } = useObtenerPacientes({
        q: busqueda,
        limit: 10
    });

    const pacientes = data?.pacientes ?? [];

    return (
        <SafeAreaView className="flex-1 bg-atria-crema">
            <View className="flex-1 px-6">

                {/* --- CABECERA --- */}
                <View className="items-center mt-6 mb-8">
                    <Typography variant="h1" className="text-3xl text-atria-oscuro">Mis Pacientes</Typography>
                    <Typography variant="caption" className="tracking-[2px] text-atria-gris-oscuro uppercase mt-1">
                        Gestión de Archivos Médicos
                    </Typography>
                </View>

                {/* --- BARRA DE BÚSQUEDA --- */}
                <BarraBusqueda
                    valor={busqueda}
                    onChange={setBusqueda}
                    placeholder="Buscar por nombre o ID..."
                />

                {/* --- LISTA DE PACIENTES --- */}
                <FlatList
                    data={pacientes}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={isFetching ? <ActivityIndicator color="#8B5E3C" className="my-4" /> : <View className="h-10" />}
                    ListEmptyComponent={!isLoading ? (
                        <Typography variant="body" className="text-center mt-10 text-atria-gris">
                            No se encontraron pacientes.
                        </Typography>
                    ) : null}
                    renderItem={({ item }) => (
                        <Card className="p-5 mb-4 bg-white shadow-md rounded-3xl">
                            <View className="flex-row items-center mb-4">
                                {/* Avatar con borde sutil */}
                                <Avatar url={item.avatar_url || ''} tamaño={65} />

                                <View className="ml-4 flex-1">
                                    <Typography variant="h3" className="text-xl text-atria-oscuro">
                                        {item.nombre}
                                    </Typography>
                                    <Typography variant="body" className="text-atria-gris mt-1">
                                        Última consulta: <Typography variant="body" className="font-bold">{item.ultima_consulta}</Typography>
                                    </Typography>
                                </View>
                            </View>

                            {/* Botón de acción directo al expediente */}
                            <Boton
                                texto="VER EXPEDIENTE"
                                variante="secundario"
                                className="py-3"
                                onPress={() => router.push(`/(doctor)/expediente/${item.id}`)}
                            />
                        </Card>
                    )}
                />
            </View>
        </SafeAreaView>
    );
}