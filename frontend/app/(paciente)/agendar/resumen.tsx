import { View, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '../../../components/ui/Typography';
import { useReserva, ProveedorReserva } from '../../../context/ContextoReserva';
import { useObtenerResumenReserva } from '../../../api/paciente-vistas/paciente-vistas';
import { useCrearCita } from '../../../api/paciente-acciones/paciente-acciones';
import { Ionicons } from '@expo/vector-icons';

export default function PasoResumen() {
  const router = useRouter();
  const { reserva, reiniciarReserva } = useReserva();
  const { mutate: confirmarCita, isLoading: confirmando } = useCrearCita();

  const { data, isLoading } = useObtenerResumenReserva({
    idEspecialidad: reserva.especialidadId,
    idSucursal: reserva.sucursalId,
    idDoctor: reserva.doctorId,
    fecha: reserva.fecha,
    hora: reserva.hora
  });

  const finalizarReserva = () => {
    confirmarCita({
      data: {
        id_doctor: reserva.doctorId!,
        id_sucursal: reserva.sucursalId!,
        fecha: reserva.fecha!,
        hora: reserva.hora!
      }
    }, {
      onSuccess: () => {
        Alert.alert("¡Éxito!", "Tu cita ha sido agendada.");
        reiniciarReserva();
        router.dismissAll(); // Volver al inicio
      }
    });
  };

  if (isLoading) return <View className="flex-1 bg-atria-crema p-6"><Typography>Generando resumen...</Typography></View>;

  return (
    <View className="flex-1 bg-atria-crema p-6">
      <Typography variant="h1" className="mb-6 text-center">Confirma los datos</Typography>

      <View className="bg-white p-8 rounded-[40px] shadow-lg border border-gray-50 mb-10">
        <View className="items-center mb-6">
          <View className="bg-orange-50 p-4 rounded-full mb-4">
            <Ionicons name="checkmark-circle" size={40} color="#8B5E3C" />
          </View>
          <Typography variant="h2">{data?.doctor}</Typography>
          <Typography variant="body" className="text-atria-gris">{data?.especialidad}</Typography>
        </View>

        <View className="border-t border-gray-100 pt-6 space-y-4">
          <View className="flex-row justify-between">
            <Typography variant="body" className="text-atria-gris">Fecha:</Typography>
            <Typography variant="body" className="font-bold">{data?.fecha}</Typography>
          </View>
          <View className="flex-row justify-between">
            <Typography variant="body" className="text-atria-gris">Hora:</Typography>
            <Typography variant="body" className="font-bold">{data?.hora}</Typography>
          </View>
          <View className="flex-row justify-between">
            <Typography variant="body" className="text-atria-gris">Sucursal:</Typography>
            <Typography variant="body" className="font-bold">{data?.sucursal}</Typography>
          </View>
        </View>
      </View>

      <TouchableOpacity 
        disabled={confirmando}
        onPress={finalizarReserva}
        className="bg-atria-cafe p-5 rounded-2xl items-center shadow-md active:opacity-90"
      >
        <Typography variant="h3" className="text-white">Confirmar Reservación</Typography>
      </TouchableOpacity>
    </View>
  );
}