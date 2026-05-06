import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useObtenerCitasProximasPaciente, useObtenerCitasPasadasPaciente } from '../../api/paciente-vistas/paciente-vistas';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Typography } from '../../components/ui/Typography';
import { Card } from '../../components/ui/Card';
import { Boton } from '../../components/ui/Boton';
import { Icono } from '../../components/ui/Icono';
import { Etiqueta } from '@/components/ui/Etiqueta';

export default function MisCitasScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'proximas' | 'pasadas'>('proximas');

  const { data: citasProximas, isLoading: loadingProximas } = useObtenerCitasProximasPaciente();
  const { data: citasPasadas, isLoading: loadingPasadas } = useObtenerCitasPasadasPaciente();

  if (loadingProximas || loadingPasadas) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Cargando citas...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-atria-crema">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        
        <Typography variant="h1" className="text-atria-oscuro text-center mt-4 mb-8">
          Mis Citas
        </Typography>
        
        <View className="flex-row bg-gray-200 p-1 rounded-full mb-8">
          <TouchableOpacity 
            className={`flex-1 py-3 items-center rounded-full ${
              activeTab === 'proximas' ? 'bg-atria-cafe' : ''
            }`}
            onPress={() => setActiveTab('proximas')}
          >
            <Typography 
              variant="subtitle" 
              className={activeTab === 'proximas' ? 'text-white' : 'text-atria-oscuro'}
            >
              Próximas
            </Typography>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className={`flex-1 py-3 items-center rounded-full ${
              activeTab === 'pasadas' ? 'bg-atria-cafe' : ''
            }`}
            onPress={() => setActiveTab('pasadas')}
          >
            <Typography 
              variant="subtitle" 
              className={activeTab === 'pasadas' ? 'text-white' : 'text-atria-oscuro'}
            >
              Pasadas
            </Typography>
          </TouchableOpacity>
        </View>

        {activeTab === 'proximas' ? (
          <View className="gap-y-8">
            <View>
              <Typography variant="caption" className="text-atria-gris uppercase font-bold tracking-widest mb-3">
                PRÓXIMA PRIORIDAD
              </Typography>
              {citasProximas?.proxima_prioridad ? (
                <Card className="p-5">
                  <View className="flex-row justify-between items-start mb-4">
                    <View>
                      <Typography variant="h2" className="text-atria-oscuro">
                        {citasProximas.proxima_prioridad.doctor_nombre}
                      </Typography>
                      <Typography variant="body" className="text-atria-gris">
                        {citasProximas.proxima_prioridad.especialidad_etiqueta}
                      </Typography>
                    </View>
                    <Etiqueta 
                      texto={citasProximas.proxima_prioridad.estado_badge || 'pendiente'}
                      estado={citasProximas.proxima_prioridad.estado_badge?.toLowerCase() === 'confirmada' ? 'confirmada' : 'pendiente'} //[cite: 7, 5]
                    />
                  </View>
                  <View className="bg-atria-crema p-4 rounded-2xl mb-4 flex-row items-center">
                    <Icono nombre="time-outline" familia="Ionicons" tamaño={18} color="cafe" />
                    <Typography variant="body" className="ml-2 text-atria-oscuro font-medium">
                      {citasProximas.proxima_prioridad.fecha_frase} • {citasProximas.proxima_prioridad.hora_formateada}
                    </Typography>
                  </View>
                  <Boton 
                    texto="Gestionar Cita"
                    onPress={() => router.push(`/gestionar-cita?id_cita=${citasProximas.proxima_prioridad?.id_cita}`)}
                  />
                </Card>
              ) : (
                <Typography variant="body" className="text-atria-gris italic">No hay citas prioritarias</Typography>
              )}
            </View>

            <View>
              <Typography variant="caption" className="text-atria-gris uppercase font-bold tracking-widest mb-3">
                OTRAS VISITAS
              </Typography>
              {citasProximas?.visitas_proximas?.map((cita: any) => (
                <Card key={cita.id_cita} className="p-4 mb-4">
                  <View className="flex-row justify-between items-center">
                    <View>
                      <Typography variant="h3" className="text-atria-oscuro">{cita.doctor_nombre}</Typography>
                      <Typography variant="body" className="text-atria-gris">
                        {cita.motivo_consulta || cita.especialidad_etiqueta} • {cita.fecha_corta}
                      </Typography>
                    </View>
                    <TouchableOpacity 
                      className="bg-atria-crema p-2 rounded-full"
                      onPress={() => router.push(`/gestionar-cita?id_cita=${cita.id_cita}`)}
                    >
                      <Icono nombre="chevron-right" familia="Feather" tamaño={20} color="cafe" />
                    </TouchableOpacity>
                  </View>
                </Card>
              ))}
            </View>
          </View>
        ) : (
          <View>
            <Typography variant="caption" className="text-atria-gris uppercase font-bold tracking-widest mb-4">
              HISTORIAL DE CITAS
            </Typography>
            {citasPasadas?.historial_citas?.map((cita: any) => (
              <Card key={cita.id_cita} className="p-4 mb-4 border-atria-gris" borde="izquierda">
                <Typography variant="h3" className="text-atria-oscuro">{cita.doctor_nombre}</Typography>
                <Typography variant="body" className="text-atria-gris">
                  {cita.fecha_corta || cita.fecha_frase}
                </Typography>
                <View className="mt-2 self-start bg-gray-100 px-3 py-1 rounded-full">
                  <Typography variant="caption" className="text-atria-gris font-medium">
                    {cita.estado_texto}
                  </Typography>
                </View>
              </Card>
            ))}
          </View>
        )}
        
        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}
