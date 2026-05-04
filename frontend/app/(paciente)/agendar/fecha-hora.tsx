import { View, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '../../../components/ui/Typography';
import { useReserva } from '../../../context/ContextoReserva';
import { useState, useEffect } from 'react';
import { useObtenerDisponibilidadDoctor } from '../../../api/paciente-vistas/paciente-vistas';

export default function PasoFechaHora() {
  const router = useRouter();
  const { reserva, actualizarReserva } = useReserva();

  // Estado local para saber qué día seleccionó el usuario para ver las horas
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

  // Seleccionar automáticamente el primer día disponible cuando cargue la data
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
      <View className="flex-1 bg-atria-crema p-6 justify-center items-center">
        <Typography variant="body">Faltan datos para mostrar la disponibilidad.</Typography>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-atria-cafe p-3 rounded-xl">
          <Typography className="text-white">Volver</Typography>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading) return <View className="flex-1 bg-atria-crema p-6"><Typography>Consultando agenda...</Typography></View>;

  return (
    <ScrollView className="flex-1 bg-atria-crema p-6">
      <Typography variant="h1" className="mb-2">Elige el mejor</Typography>
      <Typography variant="h1" className="text-atria-cafe mb-6">horario para ti</Typography>

      {/* Selector Horizontal de Días */}
      <View className="mb-6">
        <Typography variant="subtitle" className="mb-3">Días Disponibles</Typography>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {data?.dias_disponibles?.map((dia) => (
            <TouchableOpacity
              key={dia}
              onPress={() => setFechaSeleccionada(dia)}
              className={`px-4 py-3 rounded-xl mr-3 border ${fechaSeleccionada === dia
                  ? 'bg-atria-cafe border-atria-cafe'
                  : 'bg-white border-gray-200'
                }`}
            >
              <Typography variant="body" className={`font-bold ${fechaSeleccionada === dia ? 'text-white' : 'text-atria-cafe'}`}>
                {dia}
              </Typography>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Cuadrícula de Horas para el día seleccionado */}
      {fechaSeleccionada && (
        <View className="mb-8">
          <Typography variant="subtitle" className="mb-3">
            Horarios para el {fechaSeleccionada}
          </Typography>
          <View className="flex-row flex-wrap justify-between gap-y-3">
            {data?.horarios_por_dia
              ?.filter(h => h.estado === 'disponible') // Solo mostramos los libres
              .map((horario, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => seleccionarHorario(horario.hora_formateada || '')}
                  className="bg-white px-4 py-3 rounded-xl w-[31%] items-center border border-gray-100 shadow-sm active:opacity-70"
                >
                  <Typography variant="body" className="font-semibold text-atria-cafe">
                    {horario.hora_formateada}
                  </Typography>
                </TouchableOpacity>
              ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}