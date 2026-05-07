import { View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Typography } from '../../../components/ui/Typography';
import { Card } from '../../../components/ui/Card';
import { Icono } from '../../../components/ui/Icono';
import { useReserva } from '../../../context/ContextoReserva';
import { useObtenerEspecialidades } from '../../../api/paciente-vistas/paciente-vistas';

export default function PasoEspecialidad() {
  const router = useRouter();
  const { actualizarReserva } = useReserva();
  const { data, isLoading } = useObtenerEspecialidades();

  const manejarSeleccion = (id: string) => {
    actualizarReserva({ id_especialidad: id });
    router.push('/(paciente)/agendar/doctor');
  };

  if (isLoading) return (
    <SafeAreaView className="flex-1 bg-atria-crema justify-center items-center">
      <ActivityIndicator size="large" color="#A87B51" />
      <Typography variant="body" className="text-atria-gris mt-4">
        Buscando especialidades...
      </Typography>
    </SafeAreaView>
  );

  return (
    // 2. Protegemos la vista con SafeAreaView
    <SafeAreaView className="flex-1 bg-atria-crema">
      <View className="flex-1 px-6 pt-6">
        
        {/* --- HEADER (Títulos) --- */}
        <Typography variant="h1" className="text-atria-oscuro mb-1">
          ¿Qué especialidad
        </Typography>
        <Typography variant="h1" className="text-atria-cafe mb-8">
          necesitas?
        </Typography>

        {/* --- LISTA DE ESPECIALIDADES --- */}
        <FlatList
          data={data?.especialidades}
          keyExtractor={(item) => item.id_especialidad ? item.id_especialidad : Math.random().toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => manejarSeleccion(item.id_especialidad ? item.id_especialidad : '')}
              activeOpacity={0.7} // Feedback visual al tocar
              className="mb-4"
            >
              {/* 3. Envolvemos el contenido en nuestra Card para mantener la consistencia de sombras y bordes */}
              <Card className="p-5 flex-row justify-between items-center">
                <View className="flex-row items-center flex-1 pr-4">
                  
                  {/* Contenedor del icono con un toque de color Atria */}
                  <View className="bg-atria-crema border border-gray-100 p-3 rounded-2xl mr-4">
                    <Icono nombre="medical-outline" familia="Ionicons" tamaño={22} color="cafe" />
                  </View>
                  
                  {/* Nombre de la especialidad usando h2 */}
                  <Typography variant="h2" className="text-atria-oscuro flex-1" numberOfLines={2}>
                    {item.nombre_especialidad}
                  </Typography>
                </View>
                
                {/* 4. Icono de flecha estandarizado a Feather */}
               <View>
                <Icono nombre="chevron-right" familia="Feather" tamaño={24} color="gris" />
               </View>
              </Card>
            </TouchableOpacity>
          )}
          ListFooterComponent={<View className="h-10" />} // Espaciado extra al llegar al final
        />
      </View>
    </SafeAreaView>
  );
}