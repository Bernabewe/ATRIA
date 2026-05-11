import { View, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

import { ActionTile } from '../../components/ui/ActionTile';
import { Typography } from '../../components/ui/Typography';
import { Avatar } from '../../components/ui/Avatar';
import { Boton } from '../../components/ui/Boton';
import { Icono } from '@/components/ui/Icono';
import { Card } from '@/components/ui/Card';

// 1. Hook generado para el doctor
import { useObtenerInicioDoctor } from '../../api/doctor-vistas/doctor-vistas';
import { useAuth } from '../../context/AuthContext';

export default function DoctorHome() {
    const router = useRouter();
    const { usuario, isReady } = useAuth();

    // 2. Consumo del hook del doctor
    const { data, isLoading } = useObtenerInicioDoctor({
        query: {
            enabled: isReady && !!usuario
        }
    });

    if (!isReady || isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-atria-crema">
                <ActivityIndicator size="large" color="#8B5E3C" />
                <Typography variant="body" className="mt-2">Cargando tu consultorio...</Typography>
            </View>
        );
    }

    return (
        <ScrollView
            className="flex-1 bg-atria-crema px-6"
            showsVerticalScrollIndicator={false}
        >
            {/* --- CABECERA --- */}
            <View className="flex-row justify-between items-center mt-14 mb-8">
                <View>
                    <Typography variant="caption" className="text-atria-gris uppercase font-bold tracking-widest">
                        ¡Hola de nuevo!
                    </Typography>
                    <Typography variant="h1" className="text-3xl">
                        Dr. {data?.doctor_nombre_pila}
                    </Typography>
                </View>
                <Avatar url="https://i.pravatar.cc/150?u=doctor" tamaño={56} />
            </View>

            {/* --- TARJETA SIGUIENTE CITA --- */}
            <Typography variant="caption" className="text-atria-gris uppercase font-bold tracking-widest text-xs mb-4">
                Siguiente Cita
            </Typography>

            <Card borde="izquierda" className="mb-8">
                {data?.proxima_cita ? (
                    <>
                        <View className="mb-4">
                            <Typography variant="h2" className="text-xl mb-1">
                                {data.proxima_cita.nombre_paciente}
                            </Typography>
                            <Typography variant="h3" className="text-atria-cafe font-bold text-lg">
                                {data.proxima_cita.hora}
                            </Typography>
                        </View>

                        <View className="flex-row border-t border-gray-100 pt-4 mb-6">
                            <View className="flex-row items-center flex-1 border-r border-gray-100 pr-2">
                                <Icono nombre="calendar-outline" familia="Ionicons" tamaño={18} color="cafe" />
                                <Typography variant="body" className="ml-2 text-atria-oscuro font-medium text-sm">
                                    {data.proxima_cita.fecha_formateada}
                                </Typography>
                            </View>
                            <View className="flex-row items-center flex-1 pl-2">
                                <Icono nombre="location-outline" familia="Ionicons" tamaño={18} color="cafe" />
                                <Typography variant="body" className="ml-2 text-atria-oscuro font-medium text-sm">
                                    {data.proxima_cita.ubicacion}
                                </Typography>
                            </View>
                        </View>

                        <Boton
                            texto="Ver Detalles de la Cita ➔"
                            variante="primario"
                            onPress={() => router.push(`/gestionar-cita?id_cita=${data.proxima_cita?.id_cita}`)}
                        />
                    </>
                ) : (
                    <View className="py-4 items-center">
                        <Typography variant="body" className="text-atria-gris">No tienes citas próximas.</Typography>
                    </View>
                )}
            </Card>

            {/* --- ACCIONES RÁPIDAS --- */}
            <Typography variant="caption" className="text-atria-gris uppercase font-bold tracking-widest text-xs mb-4">
                Acciones Rápidas
            </Typography>

            <View className="flex-row flex-wrap justify-between pb-10">
                {data?.acciones_rapidas?.map((accion) => (
                    <ActionTile
                        key={accion.action_id}
                        title={accion.label || ''}
                        icon={accion.icon_id as any}
                        onPress={() => router.push(accion.route_name as any)}
                    />
                ))}
            </View>
        </ScrollView>
    );
}