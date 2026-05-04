import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { ActionTile } from '../../components/ui/ActionTile';
import { Typography } from '../../components/ui/Typography';
// 1. Importacion del hook generado por Orval para obtener los datos del backend
import { useObtenerInicioPaciente } from '../../api/paciente-vistas/paciente-vistas';
import { useAuth } from '../../context/AuthContext';

export default function PatientHome() {
  const router = useRouter();
  const { usuario, isReady } = useAuth();

  // 2. Consumo del Hook: 'data' contiene la respuesta y 'isLoading' el estado de la peticion
  const { data, isLoading, error } = useObtenerInicioPaciente({
    query: {
      // SOLO se dispara si el contexto termino de cargar Y hay un usuario logueado
      enabled: isReady && !!usuario
    }
  });

  // 3. Mientras el contexto carga la sesion, mostramos una pantalla de espera
  if (!isReady) {
    return (
      <View className="flex-1 justify-center items-center bg-atria-crema">
        <Typography variant="body">Verificando sesión...</Typography>
      </View>
    );
  }

  // 4. Si ya cargo y no hay usuario, mandamos al login (Protección de ruta)
  if (!usuario) {
    return <Redirect href="/login" />;
  }

  console.log("error: ", error);
  // 3. Estado de Carga: Mientras la API responde, mostramos una pantalla de espera
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-atria-crema">
        <Typography variant="body">Cargando Atria...</Typography>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-atria-crema px-6 pt-12">

      {/* --- HEADER: Información de perfil y notificaciones --- */}
      <View className="flex-row justify-between items-center mb-8">
        <View className="flex-row items-center">
          <Image
            source={{ uri: 'https://avatar.iran.liara.run/public/girl' }}
            className="w-12 h-12 rounded-full mr-3"
          />
          <View>
            <Typography variant="subtitle">Portal de Bienestar</Typography>
            <Typography variant="h2">Inicio</Typography>
          </View>
        </View>
        <TouchableOpacity className="bg-white p-2 rounded-full shadow-sm active:opacity-70">
          <Ionicons name="notifications-outline" size={24} color="#8B5E3C" />
        </TouchableOpacity>
      </View>

      {/* --- BIENVENIDA: Muestra el nombre dinamico del paciente desde la API --- */}
      <View className="mb-8">
        <Typography variant="h1">Bienvenida de nuevo,</Typography>
        <Typography variant="h1" className="text-atria-cafe">
          {data?.nombre_pila || 'Paciente'}
        </Typography>
        <Typography variant="caption" className="mt-1">
          Tus métricas de salud lucen excelentes hoy.
        </Typography>
      </View>

      {/* --- CARD DE PROXIMA CITA: Logica condicional para mostrar la cita o un estado vacio --- */}
      <View className="bg-white p-6 rounded-[30px] shadow-md border border-gray-50 mb-10">
        <Typography variant="subtitle" className="text-atria-cafe mb-3">
          Próxima Cita
        </Typography>
        <Typography variant="h2">{data?.next_cita?.doctor_nombre || 'No hay citas programadas'}</Typography>
        <Typography variant="body" className="text-atria-gris mb-4">
          {data?.next_cita?.especialidad_etiqueta || 'Agenda libre'}
        </Typography>
        {/* Solo mostramos fecha y consultorio si existe una cita programada */}
        {data?.next_cita && (
          <View className="flex-row justify-between mb-6">
            <View className="flex-row items-center flex-1 mr-2">
              <Ionicons name="time-outline" size={18} color="#8B5E3C" />
              <Typography variant="body" className="ml-2 font-semibold flex-1 flex-wrap">
                {`${data.next_cita.fecha_frase || ''} ${data.next_cita.hora_formateada || ''}`}
              </Typography>
            </View>
            <View className="flex-row items-center flex-1 pl-2">
              <Ionicons name="location-outline" size={18} color="#8B5E3C" />
              <Typography variant="body" className="ml-2 font-semibold flex-1 flex-wrap">
                Consultorio {data.next_cita.consultorio_numero}
              </Typography>
            </View>
          </View>
        )}
        {/* Boton de accion: Navega a la gestion de la cita especifica */}
        <TouchableOpacity className="bg-atria-cafe p-4 rounded-2xl items-center flex-row justify-center active:opacity-90" onPress={() => router.push(`/gestionar-cita?id_cita=${data?.next_cita?.id_cita}`)}>
          <Typography variant="body" className="text-white font-bold mr-2">
            Ver Detalles de la Cita
          </Typography>
          <Ionicons name="arrow-forward" size={18} color="white" />
        </TouchableOpacity>
      </View>

      {/* --- ACCIONES RAPIDAS: Mapeo dinamico de botones basado en la respuesta de la API --- */}
      <Typography variant="subtitle" className="mb-4">Acciones Rápidas</Typography>
      <View className="flex-row flex-wrap justify-between pb-10">
        {data?.quick_actions?.map((action) => (
          <ActionTile
            key={action.action_id || Math.random().toString()}
            title={action.label || ''}
            icon={(action.icon_id || 'apps-outline') as any}
            onPress={() => {
              if (action.route_name) {
                router.push(action.route_name as any);
              }
            }}
          />
        ))}
      </View>

    </ScrollView>
  );
}