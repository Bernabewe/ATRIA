import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useObtenerCitasProximasPaciente, useObtenerCitasPasadasPaciente } from '../../api/paciente-vistas/paciente-vistas';

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
    <ScrollView style={{ flex: 1, backgroundColor: '#FDFCF8', padding: 20, paddingTop: 60 }}>
      {/* Header */}
      <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>Mis Citas</Text>
      
      {/* Selector de Pestañas (Tabs) */}
      <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: '#EAEAEA', marginBottom: 20 }}>
        <TouchableOpacity 
          style={{ flex: 1, paddingBottom: 15, alignItems: 'center', borderBottomWidth: activeTab === 'proximas' ? 2 : 0, borderColor: '#8B5E3C' }}
          onPress={() => setActiveTab('proximas')}
        >
          <Text style={{ fontSize: 16, fontWeight: activeTab === 'proximas' ? 'bold' : 'normal', color: activeTab === 'proximas' ? '#8B5E3C' : '#9BA1A6' }}>Próximas</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={{ flex: 1, paddingBottom: 15, alignItems: 'center', borderBottomWidth: activeTab === 'pasadas' ? 2 : 0, borderColor: '#8B5E3C' }}
          onPress={() => setActiveTab('pasadas')}
        >
          <Text style={{ fontSize: 16, fontWeight: activeTab === 'pasadas' ? 'bold' : 'normal', color: activeTab === 'pasadas' ? '#8B5E3C' : '#9BA1A6' }}>Pasadas</Text>
        </TouchableOpacity>
      </View>

      {/* Contenido Dinámico según la Pestaña Activa */}
      {activeTab === 'proximas' ? (
        <View>
          <Text style={{ fontSize: 16, marginTop: 5, fontWeight: 'bold' }}>PRÓXIMA PRIORIDAD</Text>
          {citasProximas?.proxima_prioridad ? (
            <View style={{ marginVertical: 10, padding: 10, borderWidth: 1, borderColor: '#eee', borderRadius: 8 }}>
              <Text>Doctor: {citasProximas.proxima_prioridad.doctor_nombre}</Text>
              <Text>Especialidad: {citasProximas.proxima_prioridad.especialidad_etiqueta}</Text>
              <Text>Fecha: {citasProximas.proxima_prioridad.fecha_frase} - {citasProximas.proxima_prioridad.hora_formateada}</Text>
              <Text>Estado: {citasProximas.proxima_prioridad.estado_badge}</Text>
              <TouchableOpacity onPress={() => router.push(`/gestionar-cita?id_cita=${citasProximas.proxima_prioridad?.id_cita}`)}>
                <Text style={{ color: 'blue', marginTop: 5 }}>[Botón: Gestionar]</Text>
              </TouchableOpacity>
            </View>
          ) : <Text style={{ marginTop: 5, marginBottom: 15 }}>No hay cita prioritaria</Text>}

          <Text style={{ fontSize: 16, marginTop: 15, fontWeight: 'bold' }}>VISITAS PRÓXIMAS</Text>
          {citasProximas?.visitas_proximas?.length ? citasProximas.visitas_proximas.map((cita: any) => (
            <View key={cita.id_cita || Math.random().toString()} style={{ marginVertical: 10, padding: 10, borderWidth: 1, borderColor: '#eee', borderRadius: 8 }}>
              <Text>Doctor: {cita.doctor_nombre}</Text>
              <Text>Motivo: {cita.motivo_consulta || cita.especialidad_etiqueta}</Text>
              <Text>Fecha: {cita.fecha_corta}</Text>
              <TouchableOpacity onPress={() => router.push(`/gestionar-cita?id_cita=${cita.id_cita}`)}>
                <Text style={{ color: 'blue', marginTop: 5 }}>[Botón: Gestionar]</Text>
              </TouchableOpacity>
            </View>
          )) : <Text style={{ marginTop: 5, marginBottom: 15 }}>No hay más visitas programadas</Text>}

          <Text style={{ fontSize: 16, marginTop: 15, fontWeight: 'bold' }}>COMPLETADAS RECIENTEMENTE</Text>
          {citasProximas?.completadas_recientemente?.length ? citasProximas.completadas_recientemente.map((cita: any) => (
            <View key={cita.id_cita || Math.random().toString()} style={{ marginVertical: 10, padding: 10, borderWidth: 1, borderColor: '#eee', borderRadius: 8 }}>
              <Text>Doctor: {cita.doctor_nombre}</Text>
              <Text>Motivo: {cita.motivo_consulta}</Text>
              <Text>Fecha: {cita.fecha_corta}</Text>
              <Text style={{ color: 'green', marginTop: 5 }}>[Icono: Listo]</Text>
            </View>
          )) : <Text style={{ marginTop: 5, marginBottom: 15 }}>No hay citas recientes</Text>}
        </View>
      ) : (
        <View>
          <Text style={{ fontSize: 16, marginTop: 5, fontWeight: 'bold' }}>HISTORIAL DE CITAS</Text>
          {citasPasadas?.historial_citas?.length ? citasPasadas.historial_citas.map((cita: any) => (
            <View key={cita.id_cita || Math.random().toString()} style={{ marginVertical: 10, padding: 10, borderWidth: 1, borderColor: '#eee', borderRadius: 8 }}>
              <Text>Doctor: {cita.doctor_nombre}</Text>
              <Text>Fecha: {cita.fecha_corta || cita.fecha_frase}</Text>
              <Text>Estado: {cita.estado_texto}</Text>
            </View>
          )) : <Text style={{ marginTop: 10 }}>No tienes historial de citas pasadas.</Text>}
        </View>
      )}
      
      <View style={{ height: 100 }} /> {/* Espacio para el Tab Bar inferior */}
    </ScrollView>
  );
}
