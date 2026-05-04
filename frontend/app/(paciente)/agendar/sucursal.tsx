import { View, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '../../../components/ui/Typography';
import { useReserva } from '../../../context/ContextoReserva';
import { useObtenerSucursalesPorDoctor } from '../../../api/paciente-vistas/paciente-vistas';
import { Ionicons } from '@expo/vector-icons';

export default function PasoSucursal() {
  const router = useRouter();
  const { reserva, actualizarReserva } = useReserva();

  const { data, isLoading } = useObtenerSucursalesPorDoctor(
    { id_doctor: reserva.id_doctor as string },
    { query: { enabled: !!reserva.id_doctor } }
  );

  const manejarSeleccion = (id: string) => {
    actualizarReserva({ id_sucursal: id });
    router.push('/(paciente)/agendar/fecha-hora');
  };

  if (!reserva.id_doctor) {
    return (
      <View className="flex-1 bg-atria-crema p-6 justify-center items-center">
        <Typography variant="body">Por favor, selecciona un especialista primero.</Typography>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-atria-cafe p-3 rounded-xl">
          <Typography className="text-white">Volver</Typography>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading) return <View className="flex-1 bg-atria-crema p-6"><Typography>Cargando sucursales...</Typography></View>;

  return (
    <View className="flex-1 bg-atria-crema p-6">
      <Typography variant="h1" className="mb-2">¿En qué sucursal</Typography>
      <Typography variant="h1" className="text-atria-cafe mb-6">prefieres tu cita?</Typography>

      <FlatList
        data={data?.sucursales}
        keyExtractor={(item) => item.id_sucursal ? item.id_sucursal : ''}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => manejarSeleccion(item.id_sucursal ? item.id_sucursal : '')}
            className="bg-white p-5 rounded-2xl mb-4 shadow-sm border border-gray-100 active:opacity-70"
          >
            <View className="flex-row items-center mb-2">
              <Ionicons name="location-outline" size={20} color="#8B5E3C" className="mr-2" />
              <Typography variant="h3">{item.nombre_sucursal}</Typography>
            </View>
            <Typography variant="caption">{item.direccion_completa}</Typography>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Typography variant="body" className="text-center mt-10">Este especialista no tiene sucursales asignadas.</Typography>
        }
      />
    </View>
  );
}