import { View, FlatList, TouchableOpacity, ActivityIndicator} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Typography } from '../../../components/ui/Typography';
import { Card } from '../../../components/ui/Card';
import { Icono } from '../../../components/ui/Icono';
import { Boton } from '../../../components/ui/Boton';
import { useReserva } from '../../../context/ContextoReserva';
import { useObtenerSucursalesPorDoctor } from '../../../api/paciente-vistas/paciente-vistas';

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
      <SafeAreaView className="flex-1 bg-atria-crema justify-center items-center px-6">
        <Icono familia="Ionicons" nombre="alert-circle-outline" tamaño={48} color="cafe" />
        <Typography variant="body" className="text-atria-oscuro text-center mt-4 mb-8">
          Por favor, selecciona un especialista primero.
        </Typography>
        <Boton 
          texto="Volver a Especialistas" 
          variante="primario"
          onPress={() => router.back()} 
          className="w-full"
        />
      </SafeAreaView>
    );
  }

  if (isLoading) return (
    <SafeAreaView className="flex-1 bg-atria-crema justify-center items-center">
      <ActivityIndicator size="large" color="#A87B51" />
      <Typography variant="body" className="text-atria-gris mt-4">
        Cargando sucursales...
      </Typography>
    </SafeAreaView>
  );

  return (
    // 3. Vista Principal Protegida
    <SafeAreaView className="flex-1 bg-atria-crema">
      <View className="flex-1 px-6 pt-6">
        
        {/* --- HEADER (Títulos) --- */}
        <Typography variant="h1" className="text-atria-oscuro mb-1">
          ¿En qué sucursal
        </Typography>
        <Typography variant="h1" className="text-atria-cafe mb-8">
          prefieres tu cita?
        </Typography>

        {/* --- LISTA DE SUCURSALES --- */}
        <FlatList
          data={data?.sucursales}
          keyExtractor={(item) => item.id_sucursal ? item.id_sucursal : Math.random().toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => manejarSeleccion(item.id_sucursal ? item.id_sucursal : '')}
              activeOpacity={0.7}
              className="mb-4"
            >
              {/* 4. Tarjeta Atria con Iconos y Jerarquía de Textos */}
              <Card className="p-5 flex-row justify-between items-center">
                
                <View className="flex-1 pr-4">
                  <View className="flex-row items-center mb-1">
                    <Icono nombre="location-outline" familia="Ionicons" tamaño={20} color="cafe" />
                    <Typography variant="h3" className="text-atria-oscuro ml-2 flex-1" numberOfLines={1}>
                      {item.nombre_sucursal}
                    </Typography>
                  </View>
                  
                  {/* Agregamos un poco de leading y margen superior a la dirección para separarla bien */}
                  <Typography variant="caption" className="text-atria-gris leading-5 mt-1" numberOfLines={2}>
                    {item.direccion_completa}
                  </Typography>
                </View>

                {/* 5. Flecha de navegación a la derecha */}
                <View>
                  <Icono nombre="chevron-right" familia="Feather" tamaño={24} color="gris" />
                </View>

              </Card>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Typography variant="body" className="text-center text-atria-gris mt-10">
              Este especialista no tiene sucursales asignadas.
            </Typography>
          }
          ListFooterComponent={<View className="h-10" />} // Espaciado extra al final
        />
      </View>
    </SafeAreaView>
  );
}