import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Redirect, useRouter } from 'expo-router';

import { ActionTile } from '../../components/ui/ActionTile';
import { Typography } from '../../components/ui/Typography';
import { Avatar } from '../../components/ui/Avatar';
import { Boton } from '../../components/ui/Boton';

// 1. Importacion del hook generado por Orval para obtener los datos del backend
import { useObtenerInicioPaciente } from '../../api/paciente-vistas/paciente-vistas';
import { useAuth } from '../../context/AuthContext';
import { Icono } from '@/components/ui/Icono';
import { Card } from '@/components/ui/Card';

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
    <ScrollView className="flex-1 bg-atria-crema px-6 pt-12" showsVerticalScrollIndicator={false}>

      {/* --- HEADER --- */}
      <View className="flex-row justify-between items-center mb-8">
        <View className="flex-row items-center gap-x-3">
          <Avatar 
            url="https://avatar.iran.liara.run/public/girl" 
            tamaño={48} 
          />
          <View className='pl-2'>
            <Typography variant="caption" className="text-atria-gris uppercase font-bold tracking-widest text-xs">
              Portal de Bienestar
            </Typography>
            <Typography variant="h2" className="text-atria-oscuro">Inicio</Typography>
          </View>
        </View>
        <TouchableOpacity className="bg-white p-3 rounded-full shadow-sm">
          {/* Asumiendo que tu componente Icono funciona con estas propiedades */}
          <Icono nombre="notifications-outline" familia="Ionicons" tamaño={22} color="cafe" /> 
        </TouchableOpacity>
      </View>

      {/* --- BIENVENIDA --- */}
      <View className="mb-8">
        <Typography variant="h1" className="text-atria-oscuro">Bienvenida de nuevo,</Typography>
        <Typography variant="h1" className="text-atria-cafe">
          {data?.nombre_pila || 'Paciente'}
        </Typography>
        <Typography variant="body" className="text-atria-gris mt-2">
          Tus métricas de salud lucen excelentes hoy.
        </Typography>
      </View>

      {/* --- CARD DE PRÓXIMA CITA --- */}
      {/* Implementamos tu componente Card */}
      <Card className="mb-10 p-5" borde="arriba"> 
        
        {/* Cabecera de la tarjeta */}
        <View className="flex-row justify-between items-start mb-4">
          <View>
            <Typography variant="caption" className="text-atria-gris uppercase font-bold tracking-widest text-xs mb-1">
              Próxima Cita
            </Typography>
            <Typography variant="h2" className="text-atria-oscuro">
              {data?.next_cita?.doctor_nombre || 'No hay citas programadas'}
            </Typography>
            <Typography variant="body" className="text-atria-gris">
              {data?.next_cita?.especialidad_etiqueta || 'Agenda libre'}
            </Typography>
          </View>
          
          {/* Icono de calendario con fondo crema */}
          {data?.next_cita && (
             <View className="bg-atria-crema p-3 rounded-2xl border border-gray-50">
               <Icono nombre="calendar-outline" familia="Ionicons" tamaño={24} color="cafe" />
             </View>
          )}
        </View>

        {/* Detalles de hora y lugar */}
        {data?.next_cita && (
          <View className="flex-row justify-between mb-6 bg-atria-crema p-4 rounded-2xl">
            <View className="flex-row items-center flex-1">
              <Icono nombre="time-outline" familia="Ionicons" tamaño={18} color="cafe" />
              <Typography variant="body" className="ml-2 text-atria-oscuro font-medium text-sm">
                {`${data.next_cita.fecha_frase || ''}, ${data.next_cita.hora_formateada || ''}`}
              </Typography>
            </View>
            <View className="flex-row items-center flex-1 pl-2">
              <Icono nombre="location-outline" familia="Ionicons" tamaño={18} color="cafe" />
              <Typography variant="body" className="ml-2 text-atria-oscuro font-medium text-sm">
                Cons. {data.next_cita.consultorio_numero}
              </Typography>
            </View>
          </View>
        )}

        {/* Botón estandarizado */}
        {data?.next_cita && (
          <Boton 
            texto="Ver Detalles de la Cita ➔" 
            variante="primario"
            onPress={() => router.push(`/gestionar-cita?id_cita=${data?.next_cita?.id_cita}`)} 
          />
        )}
      </Card>

      {/* --- ACCIONES RÁPIDAS --- */}
      <Typography variant="caption" className="text-atria-gris uppercase font-bold tracking-widest text-xs mb-4">
        Acciones Rápidas
      </Typography>
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