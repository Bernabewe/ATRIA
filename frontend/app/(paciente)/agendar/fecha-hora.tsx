import { View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Typography } from '../../../components/ui/Typography';
import { Icono } from '../../../components/ui/Icono';
import { Boton } from '../../../components/ui/Boton';
import { useReserva } from '../../../context/ContextoReserva';
import { useState, useEffect } from 'react';
import { useObtenerDisponibilidadDoctor } from '../../../api/paciente-vistas/paciente-vistas';

export default function PasoFechaHora() {
  const router = useRouter();
  const { reserva, actualizarReserva } = useReserva();

  const [fechaSeleccionada, setFechaSeleccionada] = useState<string | null>(null);

  const { data, isLoading } = useObtenerDisponibilidadDoctor(
    {
      id_doctor: reserva.id_doctor as string,
      id_sucursal: reserva.id_sucursal as string
    },
    {
      query: {
        enabled: !!reserva.id_doctor && !!reserva.id_sucursal
      }
    }
  );

  useEffect(() => {
    if (data?.dias_disponibles && data.dias_disponibles.length > 0) {
      setFechaSeleccionada(data.dias_disponibles[0]);
    }
  }, [data]);

  const seleccionarHorario = (hora: string) => {
    if (!fechaSeleccionada) return;

    actualizarReserva({
      fecha: fechaSeleccionada,
      hora: hora
    });

    router.push('/(paciente)/agendar/resumen');
  };

  if (!reserva.id_doctor || !reserva.id_sucursal) {
    return (
      <SafeAreaView className="flex-1 bg-atria-crema justify-center items-center px-6">
        <Icono familia="Ionicons" nombre="alert-circle-outline" tamaño={48} color="cafe" />
        <Typography variant="body" className="text-atria-oscuro text-center mt-4 mb-8">
          Faltan datos para mostrar la disponibilidad.
        </Typography>
        <Boton 
          texto="Volver atrás" 
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
        Consultando agenda...
      </Typography>
    </SafeAreaView>
  );
  
  const horariosLibres = data?.horarios_por_dia?.filter(h => h.estado === 'disponible') || [];
  
  return (
    // 3. Vista Principal con SafeAreaView
    <SafeAreaView className="flex-1 bg-atria-crema">
      <ScrollView className="flex-1 pt-6" showsVerticalScrollIndicator={false}>
        
        {/* --- HEADER (Títulos) --- */}
        <View className="px-6">
          <Typography variant="h1" className="text-atria-oscuro mb-1">
            Elige el mejor
          </Typography>
          <Typography variant="h1" className="text-atria-cafe mb-8">
            horario para ti
          </Typography>
        </View>

        {/* --- SELECTOR DE DÍAS (Horizontal Scroll) --- */}
        <View className="mb-8">
          <Typography variant="h2" className="text-atria-oscuro px-6 mb-4">
            Días Disponibles
          </Typography>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            // paddingHorizontal: 24 (px-6) asegura que el primer elemento esté alineado, 
            // pero que al hacer scroll el contenido fluya hasta el borde de la pantalla.
            contentContainerStyle={{ paddingHorizontal: 24 }} 
          >
            {data?.dias_disponibles?.map((dia) => {
              const activo = fechaSeleccionada === dia;
              
              return (
                <TouchableOpacity
                  key={dia}
                  onPress={() => setFechaSeleccionada(dia)}
                  activeOpacity={0.7}
                  className={`px-6 py-3 rounded-2xl mr-3 flex-row items-center justify-center ${
                    activo 
                      ? 'bg-atria-cafe shadow-md' 
                      : 'bg-white border border-gray-100 shadow-sm'
                  }`}
                >
                  <Typography 
                    variant="body" 
                    className={`font-bold ${activo ? 'text-white' : 'text-atria-oscuro'}`}
                  >
                    {dia}
                  </Typography>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* --- CUADRÍCULA DE HORARIOS --- */}
        {fechaSeleccionada && (
          <View className="px-6 mb-12">
            <Typography variant="h2" className="text-atria-oscuro mb-4">
              Horarios para el {fechaSeleccionada}
            </Typography>
            
            {horariosLibres.length > 0 ? (
              <View className="flex-row flex-wrap justify-between gap-y-4">
                {horariosLibres.map((horario, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => seleccionarHorario(horario.hora_formateada || '')}
                    activeOpacity={0.7}
                    className="bg-white py-4 rounded-xl w-[31%] items-center border border-gray-100 shadow-sm"
                  >
                    <Typography variant="body" className="font-bold text-atria-cafe">
                      {horario.hora_formateada}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              // Empty State Elegante: Si no hay horas disponibles ese día
              <View className="bg-white p-6 rounded-2xl border border-gray-100 items-center justify-center shadow-sm">
                <Icono nombre="time-outline" familia="Ionicons" tamaño={32} color="gris" />
                <Typography variant="body" className="text-atria-gris mt-3 text-center">
                  No hay horarios disponibles para este día. Por favor selecciona otro.
                </Typography>
              </View>
            )}
          </View>
        )}
        
      </ScrollView>
    </SafeAreaView>
  );
}