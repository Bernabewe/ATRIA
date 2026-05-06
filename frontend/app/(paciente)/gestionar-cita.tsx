import { useState } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useObtenerDetallesCitaPaciente } from '../../api/paciente-vistas/paciente-vistas';

import { Typography } from '../../components/ui/Typography';
import { Avatar } from '../../components/ui/Avatar';
import { Card } from '../../components/ui/Card';
import { Etiqueta } from '../../components/ui/Etiqueta';
import { Icono } from '../../components/ui/Icono';
import { Boton } from '../../components/ui/Boton';

export default function GestionarCitaScreen() {
  const router = useRouter();
  const { id_cita } = useLocalSearchParams();
  const [modalVisible, setModalVisible] = useState(false);

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
        <Boton 
          texto="Volver" 
          onPress={() => router.back()} 
          className="mt-6"
        />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-atria-crema">
      <ScrollView className="flex-1 bg-atria-crema px-6 pt-12" showsVerticalScrollIndicator={false}>
        
        {/* --- HEADER --- */}
        <View className="flex-row items-center mb-8">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <Icono nombre="arrow-left" familia="Feather" tamaño={24} color="oscuro" />
          </TouchableOpacity>
          <Typography variant="h3" className="text-atria-oscuro font-bold flex-1 text-center mr-6">
            Detalles Cita
          </Typography>
        </View>

        {/* --- PERFIL DOCTOR 👤 --- */}
        <View className="items-center mb-8">
          <View className="relative">
            <Avatar 
              url={data.doctor_foto_url || 'https://avatar.iran.liara.run/public/girl'} 
              tamaño={112} // Equivalente a w-28
            />
            <View className="absolute -bottom-3 self-center bg-atria-cafe px-4 py-1 rounded-full border-2 border-atria-crema shadow-sm">
              <Typography variant="caption" className="text-white font-bold text-[10px] uppercase tracking-wider">
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

        {/* --- TARJETA DE RESUMEN 📄 --- */}
        <Card className="p-6 mb-6 relative overflow-hidden">
          {/* Línea decorativa superior */}
          <View className="absolute top-0 left-0 right-0 h-[3px] bg-atria-cafe" />

          <View className="flex-row justify-between items-start mb-4 mt-2">
            <View className="flex-1">
              <Typography variant="caption" className="text-atria-gris mb-1 text-[10px]">
                REF: #{data.id_cita?.substring(0, 8).toUpperCase()}
              </Typography>
              <Typography variant="h2" className="leading-7">
                Resumen de la Consulta
              </Typography>
            </View>
            
            {/* Usamos nuestra Etiqueta personalizada */}
            <Etiqueta 
              texto={data.estado_badge || "Sin Estado"} 
              estado={data.estado_badge?.toLowerCase() === 'confirmada' ? 'confirmada' : 'pendiente'} 
            />
          </View>

          {/* Detalles de Fecha y Hora */}
          <View className="flex-row justify-between mb-4">
            <View className="flex-1 bg-atria-crema p-4 rounded-2xl mr-2">
              <Typography variant="caption" className="text-[10px] mb-2 font-bold text-atria-gris">FECHA</Typography>
              <View className="flex-row items-center">
                <Icono nombre="calendar-outline" familia="Ionicons" tamaño={16} color="oscuro" />
                <Typography variant="body" className="ml-2 font-bold text-sm">
                  {data.fecha_completa || data.fecha_frase}
                </Typography>
              </View>
            </View>
            <View className="flex-1 bg-atria-crema p-4 rounded-2xl ml-2">
              <Typography variant="caption" className="text-[10px] mb-2 font-bold text-atria-gris">HORARIO</Typography>
              <View className="flex-row items-center">
                <Icono nombre="time-outline" familia="Ionicons" tamaño={16} color="oscuro" />
                <Typography variant="body" className="ml-2 font-bold text-sm">
                  {data.hora_formateada}
                </Typography>
              </View>
            </View>
          </View>

          {/* Ubicación */}
          <View className="bg-atria-crema p-4 rounded-2xl mb-6">
            <Typography variant="caption" className="text-[10px] mb-2 font-bold text-atria-gris">UBICACIÓN</Typography>
            <View className="flex-row items-start">
              <Icono nombre="location-outline" familia="Ionicons" tamaño={16} color="oscuro" />
              <Typography variant="body" className="ml-2 font-bold text-sm flex-1">
                {data.ubicacion_completa || `Consultorio ${data.consultorio_numero}`}
              </Typography>
            </View>
          </View>

          <View className="h-[1px] bg-gray-100 mb-4" />

          <View className="flex-row justify-between items-center">
            <Typography variant="body" className="italic text-atria-gris font-medium">
              Anticipo de consulta
            </Typography>
            <Typography variant="h2" className="text-atria-oscuro">
              {data.anticipo_monto || '$500.00 MXN'}
            </Typography>
          </View>
        </Card>

        {/* --- BOTONES DE ACCIÓN ⚡ --- */}
        <View className="gap-y-4 mb-10">
            {data.permitir_cancelacion !== false && (
              <Boton 
                texto="Cancelar Cita" 
                variante="secundario" 
                // 3. Al presionar, mostramos el modal en lugar de la alerta fija
                onPress={() => setModalVisible(true)} 
              />
            )}
            <Boton texto="MANTENER MI CITA" variante="primario" onPress={() => router.back()} />
          </View>

      </ScrollView>

      {/* --- MODAL DE CONFIRMACIÓN DE CANCELACIÓN --- */}
      {/* Refactorizado: Centrado, flotante, card con borde superior e items centrados */}
      <Modal
        animationType="fade" // Más natural para un modal centrado
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        {/* Contenedor principal para centrar y agregar overlay */}
        <View className="flex-1 justify-center px-6 bg-black/50">
          
          {/* Usamos el componente Card con borde superior, flotante e items centrados */}
          <Card borde="arriba" className="p-8 gap-y-6">
            {/* Icono de advertencia, centrado por el Card */}
            <View className="items-center justify-center flex-row">
              <Icono nombre="alert-triangle" familia="Feather" tamaño={20} color="rojo" />
              <Typography variant="body" className="px-2 text-atria-rojo font-bold mb-1">
                {data.alerta_cancelacion?.titulo}
              </Typography>
            </View>

            {/* Textos centrados */}
            <View className="bg-atria-rojo_bg border-l-4 border-atria-rojo p-4 rounded-r-xl mb-6 flex-row">
            <View className="flex-1 ml-3">
              <Typography variant="caption" className="text-atria-rojo leading-5">
                {data.alerta_cancelacion?.mensaje}
              </Typography>
            </View>
          </View>

            {/* Botones refactorizados: primario café y texto solo */}
            <View className="w-full gap-y-3">
              <Boton 
                texto="SÍ, CANCELAR CITA" 
                variante="primario" // Primario café filled
                onPress={() => {
                  // Aquí iría tu lógica de API para cancelar
                  setModalVisible(false);
                }} 
              />
              
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                className="py-3"
              >
                <Typography variant="body" className="text-center text-atria-oscuro font-bold uppercase tracking-wider">
                  VOLVER ATRÁS
                </Typography>
              </TouchableOpacity>
            </View>
          </Card>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
