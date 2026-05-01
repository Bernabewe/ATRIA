import { View, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '../../../components/ui/Typography';
import { useReserva } from '../../../context/ContextoReserva';
import { useObtenerDisponibilidadDoctor } from '../../../api/paciente-vistas/paciente-vistas';

export default function PasoFechaHora() {
  const router = useRouter();
  const { reserva, actualizarReserva } = useReserva();
  
  const { data, isLoading } = useObtenerDisponibilidadDoctor({
    idDoctor: reserva.doctorId,
    idSucursal: reserva.sucursalId,
    mes: "2026-04" // Ejemplo estático, podrías calcular el mes actual
  });

  const seleccionarHorario = (fecha: string, hora: string) => {
    actualizarReserva({ fecha, hora });
    router.push('/(paciente)/agendar/resumen');
  };

  if (isLoading) return <View className="flex-1 bg-atria-crema p-6"><Typography>Consultando agenda...</Typography></View>;

  return (
    <ScrollView className="flex-1 bg-atria-crema p-6">
      <Typography variant="h1" className="mb-6">Horarios disponibles</Typography>

      {data?.horarios_por_dia?.map((dia) => (
        <View key={dia.fecha} className="mb-6">
          <Typography variant="subtitle" className="mb-3 text-atria-cafe font-bold">
            {dia.dia_nombre} {dia.fecha}
          </Typography>
          <View className="flex-row flex-wrap justify-between">
            {dia.horas?.map((hora) => (
              <TouchableOpacity 
                key={hora}
                onPress={() => seleccionarHorario(dia.fecha, hora)}
                className="bg-white px-4 py-3 rounded-xl mb-2 w-[31%] items-center border border-gray-100 shadow-sm"
              >
                <Typography variant="body" className="font-semibold">{hora}</Typography>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}