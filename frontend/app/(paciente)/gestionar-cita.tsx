import { View, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../components/ui/Typography';
import { useObtenerDetallesCitaPaciente } from '../../api/paciente-vistas/paciente-vistas';

export default function GestionarCitaScreen() {
  const router = useRouter();
  const { id_cita } = useLocalSearchParams();

  // Consumimos el hook, pasando el parámetro id_cita. Si no hay id_cita (por error), pasamos un string vacío.
  const { data, isLoading, isError } = useObtenerDetallesCitaPaciente(
    { id_cita: (id_cita as string) || 'default-id' },
    { query: { enabled: !!id_cita } }
  );

  if (isLoading) {
    return (
      <View className="flex-1 bg-atria-crema justify-center items-center">
        <ActivityIndicator size="large" color="#8B5E3C" />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View className="flex-1 bg-atria-crema justify-center items-center px-6">
        <Typography variant="body" className="text-center text-atria-gris">
          No se pudo cargar la información de la cita.
        </Typography>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 p-3 bg-atria-cafe rounded-xl">
          <Typography variant="body" className="text-white font-bold">Volver</Typography>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-atria-crema px-6 pt-12 pb-10">
      
      {/* --- HEADER --- */}
      <View className="flex-row items-center justify-between mb-8">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <Ionicons name="arrow-back" size={24} color="#1A1A1B" />
        </TouchableOpacity>
        <Typography variant="h3" className="text-atria-oscuro font-bold flex-1 text-center mr-6">
          Detalles Cita
        </Typography>
      </View>

      {/* --- PERFIL DOCTOR --- */}
      <View className="items-center mb-8">
        <View className="relative">
          <Image 
            source={{ uri: data.doctor_foto_url || 'https://avatar.iran.liara.run/public/girl' }} 
            className="w-28 h-28 rounded-[30px]"
            style={{ backgroundColor: '#F0EBE1' }}
          />
          <View className="absolute -bottom-3 self-center bg-atria-cafe px-4 py-1 rounded-full border-2 border-atria-crema shadow-sm">
            <Typography variant="caption" className="text-white font-bold text-[10px] uppercase tracking-wider not-italic">
              Premium
            </Typography>
          </View>
        </View>
        
        <Typography variant="h1" className="mt-6 text-atria-oscuro">
          {data.doctor_nombre}
        </Typography>
        <Typography variant="subtitle" className="mt-1 text-atria-cafe">
          {data.especialidad_etiqueta}
        </Typography>
      </View>

      {/* --- TARJETA DE RESUMEN --- */}
      <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6 relative">
        <View className="absolute top-0 left-6 right-6 h-[2px] bg-atria-cafe" />

        <View className="flex-row justify-between items-start mb-4 mt-2">
          <View className="flex-1">
            <Typography variant="subtitle" className="text-atria-gris mb-2 text-[10px]">
              REF: #{data.id_cita?.substring(0, 8).toUpperCase() || 'CAR-1024-SR'}
            </Typography>
            <Typography variant="h2" className="leading-7">
              Resumen de la Consulta
            </Typography>
          </View>
          <View className="bg-[#EAEAEA] px-3 py-1.5 rounded-md ml-4">
            <Typography variant="caption" className="text-atria-oscuro font-bold not-italic text-[10px] uppercase">
              {data.estado_badge}
            </Typography>
          </View>
        </View>

        <View className="flex-row justify-between mb-4">
          <View className="flex-1 bg-atria-crema p-4 rounded-2xl mr-2">
            <Typography variant="subtitle" className="text-[10px] mb-2">Fecha</Typography>
            <View className="flex-row items-center">
              <Ionicons name="calendar-outline" size={16} color="#1A1A1B" />
              <Typography variant="body" className="ml-2 font-bold text-sm">
                {data.fecha_completa || data.fecha_frase}
              </Typography>
            </View>
          </View>
          <View className="flex-1 bg-atria-crema p-4 rounded-2xl ml-2">
            <Typography variant="subtitle" className="text-[10px] mb-2">Horario</Typography>
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={16} color="#1A1A1B" />
              <Typography variant="body" className="ml-2 font-bold text-sm">
                {data.hora_formateada}
              </Typography>
            </View>
          </View>
        </View>

        <View className="bg-atria-crema p-4 rounded-2xl mb-6">
          <Typography variant="subtitle" className="text-[10px] mb-2">Ubicación</Typography>
          <View className="flex-row items-start">
            <Ionicons name="location-outline" size={16} color="#1A1A1B" className="mt-0.5" />
            <Typography variant="body" className="ml-2 font-bold text-sm flex-1 flex-wrap">
              {data.ubicacion_completa || `Consultorio ${data.consultorio_numero}`}
            </Typography>
          </View>
        </View>

        <View className="h-[1px] bg-gray-100 mb-4" />

        <View className="flex-row justify-between items-center">
          <Typography variant="body" className="italic text-atria-gris font-medium">
            Anticipo de consulta
          </Typography>
          <Typography variant="body" className="font-extrabold text-lg">
            {data.anticipo_monto || '$500.00 MXN'}
          </Typography>
        </View>
      </View>

      {/* --- ALERTA DE CANCELACIÓN --- */}
      {data.alerta_cancelacion && (
        <View className="bg-atria-rojo-bg border-l-4 border-atria-rojo p-4 rounded-r-xl mb-6 flex-row">
          <Ionicons name="warning-outline" size={24} color="#B43232" className="mr-3" />
          <View className="flex-1 ml-2">
            <Typography variant="body" className="text-atria-rojo font-bold mb-1">
              {data.alerta_cancelacion.titulo || '¿Seguro que quieres cancelar?'}
            </Typography>
            <Typography variant="body" className="text-atria-rojo text-sm leading-5">
              {data.alerta_cancelacion.mensaje || 'Si cancelas con menos de 24 horas de antelación, perderás el anticipo.'}
            </Typography>
          </View>
        </View>
      )}

      {/* --- BOTONES DE ACCIÓN --- */}
      {data.permitir_cancelacion !== false && (
        <TouchableOpacity className="bg-[#B38061] p-4 rounded-2xl flex-row justify-center items-center mb-4 active:opacity-90">
          <Ionicons name="close-circle-outline" size={20} color="white" />
          <Typography variant="body" className="text-white font-bold ml-2">
            Cancelar Cita
          </Typography>
        </TouchableOpacity>
      )}

      <TouchableOpacity 
        onPress={() => router.back()} 
        className="border border-atria-cafe p-4 rounded-2xl flex-row justify-center items-center mb-10 active:opacity-60 bg-white"
      >
        <Typography variant="body" className="text-atria-cafe font-bold uppercase tracking-wider text-sm">
          Mantener mi Cita
        </Typography>
      </TouchableOpacity>

    </ScrollView>
  );
}
