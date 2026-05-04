import { View, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '../../../components/ui/Typography';
import { useReserva } from '../../../context/ContextoReserva';
import { useObtenerDoctoresPorEspecialidad } from '../../../api/paciente-vistas/paciente-vistas';

export default function PasoDoctor() {
  const router = useRouter();
  const { reserva, actualizarReserva } = useReserva();

  const { data, isLoading } = useObtenerDoctoresPorEspecialidad(
    { id_especialidad: reserva.id_especialidad as string },
    { query: { enabled: !!reserva.id_especialidad } }
  );

  const manejarSeleccion = (id: string) => {
    actualizarReserva({ id_doctor: id });
    router.push('/(paciente)/agendar/sucursal');
  };

  if (isLoading) return <View className="flex-1 bg-atria-crema p-6"><Typography>Buscando especialistas...</Typography></View>;

  return (
    <View className="flex-1 bg-atria-crema p-6">
      <Typography variant="h1" className="mb-2">Selecciona a tu</Typography>
      <Typography variant="h1" className="text-atria-cafe mb-6">especialista</Typography>

      <FlatList
        data={data?.especialistas}
        keyExtractor={(item) => item.id_doctor ? item.id_doctor : ''}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => manejarSeleccion(item.id_doctor ? item.id_doctor : '')}
            className="bg-white p-4 rounded-2xl mb-4 flex-row items-center shadow-sm border border-gray-100 active:opacity-70"
          >
            <Image source={{ uri: item.foto_url }} className="w-16 h-16 rounded-full mr-4" />
            <View className="flex-1">
              <Typography variant="h3">{item.nombre_doctor}</Typography>
              <Typography variant="caption" className="text-atria-cafe font-semibold">
                {item.experiencia_anios} años de experiencia
              </Typography>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Typography variant="body" className="text-center mt-10">No se encontraron especialistas para esta área.</Typography>
        }
      />
    </View>
  );
}