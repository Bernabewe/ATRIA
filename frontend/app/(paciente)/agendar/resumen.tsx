import { View, ScrollView, ActivityIndicator, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Typography } from '../../../components/ui/Typography';
import { Card } from '../../../components/ui/Card';
import { Icono } from '../../../components/ui/Icono';
import { Boton } from '../../../components/ui/Boton';
import { useReserva } from '../../../context/ContextoReserva';
import { useObtenerResumenReserva } from '../../../api/paciente-vistas/paciente-vistas';
import { useCrearCita } from '../../../api/paciente-acciones/paciente-acciones';

export default function PasoResumen() {
  const router = useRouter();
  const { reserva, reiniciarReserva } = useReserva();
  const { mutate: confirmarCita, isPending: confirmando } = useCrearCita();

  const [modalConfig, setModalConfig] = useState<{
    visible: boolean;
    titulo: string;
    mensaje: string;
    tipo: 'exito' | 'error';
  }>({
    visible: false,
    titulo: '',
    mensaje: '',
    tipo: 'exito'
  });

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
        setModalConfig({
          visible: true,
          titulo: "¡Cita Confirmada!",
          mensaje: "Te esperamos en la clínica. Revisa tu sección de 'Mis Citas' para más detalles.",
          tipo: 'exito'
        });
        reiniciarReserva();
        router.push('/(paciente)/home');
      },
      onError: () => {
        setModalConfig({
          visible: true,
          titulo: "Ups",
          mensaje: "Hubo un problema al agendar. Intenta de nuevo.",
          tipo: 'error'
        });      
      }
    });
  };

  const cerrarModal = () => {
    setModalConfig(prev => ({ ...prev, visible: false }));
    
    // Si fue un éxito, al cerrar el modal navegamos al home
    if (modalConfig.tipo === 'exito') {
      reiniciarReserva();
      router.push('/(paciente)/home');
    }
  };

  if (!reserva.id_doctor || !reserva.fecha) {
    return (
      <SafeAreaView className="flex-1 bg-atria-crema justify-center items-center px-6">
        <Icono familia="Ionicons" nombre="alert-circle-outline" tamaño={48} color="cafe" />
        <Typography variant="body" className="text-atria-oscuro text-center mt-4 mb-8">
          Faltan datos para generar el resumen de tu cita.
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
        Generando resumen...
      </Typography>
    </SafeAreaView>
  );

  return (
    // 3. Vista Principal con SafeAreaView
    <SafeAreaView className="flex-1 bg-atria-crema">
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalConfig.visible}
        onRequestClose={cerrarModal}
      >
        <View className="flex-1 justify-center items-center bg-black/50 p-6">
          <View className="bg-white w-full max-w-sm p-8 rounded-3xl items-center shadow-xl">
            
            <Icono 
              familia="Ionicons" 
              nombre={modalConfig.tipo === 'exito' ? "checkmark-circle" : "close-circle"} 
              tamaño={64} 
              color={modalConfig.tipo === 'exito' ? "cafe" : "gris"} 
            />
            
            <Typography variant="h2" className={`mt-4 mb-2 text-center ${modalConfig.tipo === 'error' ? 'text-atria-rojo' : 'text-atria-cafe'}`}>
              {modalConfig.titulo}
            </Typography>
            
            <Typography variant="body" className="text-center text-atria-gris mb-6">
              {modalConfig.mensaje}
            </Typography>

            <Boton 
              texto="Entendido"
              variante="primario"
              onPress={cerrarModal}
              className="w-full"
            />

          </View>
        </View>
      </Modal>
      
      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        
        {/* --- HEADER --- */}
        <Typography variant="h1" className="text-atria-oscuro text-center mb-8">
          Confirma tu reservación
        </Typography>

        {/* --- TARJETA DE RESUMEN --- */}
        <Card className="p-6 mb-10" borde="arriba">
          
          {/* Encabezado: Icono + Doctor */}
          <View className="items-center mb-6">
            <View className="bg-atria-crema border border-gray-100 p-4 rounded-full mb-4">
              <Icono nombre="checkmark-circle-outline" familia="Ionicons" tamaño={40} color="cafe" />
            </View>
            <Typography variant="h2" className="text-atria-oscuro text-center">
              {data?.doctor_nombre}
            </Typography>
            <Typography variant="body" className="text-atria-gris mt-1 text-center">
              {data?.especialidad_titulo}
            </Typography>
          </View>

          {/* Detalles de la Cita */}
          <View className="border-t border-gray-100 pt-6 gap-y-5">
            
            <View className="flex-row justify-between items-center">
              <Typography variant="body" className="text-atria-gris">Fecha y Hora</Typography>
              <Typography variant="body" className="text-atria-oscuro font-bold">
                {data?.fecha_hora_formateada}
              </Typography>
            </View>
            
            <View className="flex-row justify-between items-center">
              <Typography variant="body" className="text-atria-gris">Sucursal</Typography>
              <Typography variant="body" className="text-atria-oscuro font-bold text-right flex-1 ml-4" numberOfLines={2}>
                {data?.sucursal_nombre}
              </Typography>
            </View>

            {/* Total / Costo */}
            <View className="mt-2 pt-5 border-t border-gray-100">
              <Typography variant="caption" className="text-atria-gris text-center uppercase tracking-widest mb-1">
                Costo Estimado
              </Typography>
              <Typography variant="h2" className="text-atria-cafe text-center">
                {data?.costo_total}
              </Typography>
            </View>

          </View>
        </Card>

        {/* --- BOTÓN DE CONFIRMACIÓN --- */}
        {/* Pasamos el estado disabled al botón. Asumimos que tu componente Boton acepta 'disabled' nativamente. */}
        <Boton
          texto={confirmando ? "Procesando..." : "Confirmar Reservación"}
          variante="primario"
          onPress={finalizarReserva}
          disabled={confirmando} 
          className="mb-8"
        />

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}