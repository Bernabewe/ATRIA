import { View, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '../../../components/ui/Typography';
import { useReserva } from '../../../context/ContextoReserva';
import { useObtenerEspecialidades } from '../../../api/paciente-vistas/paciente-vistas';
import { Ionicons } from '@expo/vector-icons';

export default function PasoEspecialidad() {
  const router = useRouter();
  const { actualizarReserva } = useReserva();
  const { data, isLoading } = useObtenerEspecialidades();

  const manejarSeleccion = (id: string) => {
    actualizarReserva({ especialidadId: id });
    router.push('/(paciente)/agendar/sucursal');
  };

  if (isLoading) return (
    <View className="flex-1 bg-atria-crema p-6 justify-center items-center">
      <Typography variant="body">Buscando especialidades...</Typography>
    </View>
  );

  return (
    <View className="flex-1 bg-atria-crema p-6">
      <Typography variant="h1" className="mb-2">¿Qué especialidad</Typography>
      <Typography variant="h1" className="text-atria-cafe mb-6">necesitas?</Typography>

      <FlatList
        data={data?.especialidades}
        keyExtractor={(item) => item.id_especialidad ? item.id_especialidad : ''}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => manejarSeleccion(item.id_especialidad ? item.id_especialidad : '')}
            className="bg-white p-5 rounded-2xl mb-4 flex-row justify-between items-center shadow-sm border border-gray-100 active:opacity-70"
          >
            <View className="flex-row items-center">
              <View className="bg-orange-50 p-2 rounded-full mr-4">
                <Ionicons name="medical-outline" size={20} color="#8B5E3C" />
              </View>
              <Typography variant="h3">{item.nombre_especialidad}</Typography>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9BA1A6" />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}