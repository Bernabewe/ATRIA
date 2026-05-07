import { View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Typography } from '../../../components/ui/Typography';
import { Card } from '../../../components/ui/Card';
import { Avatar } from '../../../components/ui/Avatar';
import { Icono } from '../../../components/ui/Icono';
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

  if (isLoading) return (
    <SafeAreaView className="flex-1 bg-atria-crema justify-center items-center">
      <ActivityIndicator size="large" color="#A87B51" /> {/* atria-cafe */}
      <Typography variant="body" className="text-atria-gris mt-4">
        Buscando especialistas...
      </Typography>
    </SafeAreaView>
  );

  return (
    // 2. Protegemos la vista con SafeAreaView
    <SafeAreaView className="flex-1 bg-atria-crema">
      <View className="flex-1 px-6 pt-6">
        
        {/* --- HEADER (Títulos) --- */}
        <Typography variant="h1" className="text-atria-oscuro mb-1">
          Selecciona a tu
        </Typography>
        <Typography variant="h1" className="text-atria-cafe mb-8">
          especialista
        </Typography>

        {/* --- LISTA DE DOCTORES --- */}
        <FlatList
          data={data?.especialistas}
          keyExtractor={(item) => item.id_doctor ? item.id_doctor : Math.random().toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => manejarSeleccion(item.id_doctor ? item.id_doctor : '')}
              activeOpacity={0.7}
              className="mb-4"
            >
              {/* 3. Tarjeta estandarizada usando Card */}
              <Card className="p-4 flex-row justify-between items-center">
                
                <View className="flex-row items-center flex-1 pr-4">
                  {/* 4. Uso del Avatar (64 es equivalente a w-16 h-16) */}
                  <View className="mr-4">
                    <Avatar url={item.foto_url || ''} tamaño={64} />
                  </View>
                  
                  <View className="flex-1">
                    <Typography variant="h3" className="text-atria-oscuro" numberOfLines={2}>
                      {item.nombre_doctor}
                    </Typography>
                    <Typography variant="caption" className="text-atria-cafe font-bold mt-1 uppercase text-[10px] tracking-wider">
                      {item.experiencia_anios} años de exp.
                    </Typography>
                  </View>
                </View>

                {/* 5. Icono indicador de navegación */}
                <View>
                  <Icono nombre="chevron-right" familia="Feather" tamaño={24} color="gris" />
                </View>

              </Card>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Typography variant="body" className="text-center text-atria-gris mt-10">
              No se encontraron especialistas para esta área.
            </Typography>
          }
          ListFooterComponent={<View className="h-10" />} // Espaciado extra al final
        />
      </View>
    </SafeAreaView>
  );
}