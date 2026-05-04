import { View, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '../../../components/ui/Typography';
import { useReserva } from '../../../context/ContextoReserva';
import { useObtenerResumenReserva } from '../../../api/paciente-vistas/paciente-vistas';
import { useCrearCita } from '../../../api/paciente-acciones/paciente-acciones';
import { Ionicons } from '@expo/vector-icons';

export default function PasoResumen() {
  const router = useRouter();
  const { reserva, reiniciarReserva } = useReserva();
  const { mutate: confirmarCita, isPending: confirmando } = useCrearCita();

  const { data, isLoading } = useObtenerResumenReserva(
    {
      id_doctor: reserva.id_doctor as string,
      id_sucursal: reserva.id_sucursal as string,
      fecha: reserva.fecha as string,
      hora: reserva.hora as string
    },
    {
      query: {
        enabled: !!reserva.id_doctor && !!reserva.id_sucursal && !!reserva.fecha && !!reserva.hora
      }
    }
  );

  const finalizarReserva = () => {
    confirmarCita({
      data: {
        id_doctor: reserva.id_doctor!,
        id_sucursal: reserva.id_sucursal!,
        fecha: reserva.fecha!,
        hora: reserva.hora!,
        id_metodo_pago: "transferencia_simulada"
      }
    }, {
      onSuccess: () => {
        Alert.alert(
          "¡Cita Confirmada!",
          "Te esperamos en la clínica. Revisa tu sección de 'Mis Citas' para más detalles."
        );
        reiniciarReserva();
        router.push('/(paciente)/home');
      },
      onError: () => {
        Alert.alert("Ups", "Hubo un problema al agendar. Intenta de nuevo.");
      }
    });
  };

  if (!reserva.id_doctor || !reserva.fecha) {
    return (
      <View className="flex-1 bg-atria-crema p-6 justify-center items-center">
        <Typography variant="body">Datos incompletos para el resumen.</Typography>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-atria-cafe p-3 rounded-xl">
          <Typography className="text-white">Volver</Typography>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading) return <View className="flex-1 bg-atria-crema p-6"><Typography>Generando resumen...</Typography></View>;

  return (
    <ScrollView className="flex-1 bg-atria-crema" contentContainerStyle={{ padding: 24 }}>
      <Typography variant="h1" className="mb-6 text-center">Confirma tu cita</Typography>

      <View className="bg-white p-8 rounded-[40px] shadow-lg border border-gray-50 mb-10">
        <View className="items-center mb-6">
          <View className="bg-orange-50 p-4 rounded-full mb-4">
            <Ionicons name="checkmark-circle" size={40} color="#8B5E3C" />
          </View>
          <Typography variant="h2" className="text-center">{data?.doctor_nombre}</Typography>
          <Typography variant="body" className="text-atria-gris">{data?.especialidad_titulo}</Typography>
        </View>

        <View className="border-t border-gray-100 pt-6 gap-y-4">
          <View className="flex-row justify-between">
            <Typography variant="body" className="text-atria-gris">Fecha y Hora:</Typography>
            <Typography variant="body" className="font-bold">{data?.fecha_hora_formateada}</Typography>
          </View>
          <View className="flex-row justify-between">
            <Typography variant="body" className="text-atria-gris">Sucursal:</Typography>
            <Typography variant="body" className="font-bold text-right w-1/2">{data?.sucursal_nombre}</Typography>
          </View>
          <View className="mt-4 pt-4 border-t border-gray-100">
            <Typography variant="h3" className="text-atria-cafe text-center">{data?.costo_total}</Typography>
          </View>
        </View>
      </View>

      <TouchableOpacity
        disabled={confirmando}
        onPress={finalizarReserva}
        className={`p-5 rounded-2xl items-center shadow-md ${confirmando ? 'bg-gray-400' : 'bg-atria-cafe'}`}
      >
        <Typography variant="h3" className="text-white">
          {confirmando ? "Procesando..." : "Confirmar Reservación"}
        </Typography>
      </TouchableOpacity>
    </ScrollView>
  );
}