import { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Typography } from '../../components/ui/Typography';
import { Card } from '../../components/ui/Card';
import { Icono } from '../../components/ui/Icono';

import { useObtenerHistorialMedicoPaciente } from '../../api/paciente-vistas/paciente-vistas';

export default function ExpedienteScreen() {
  const [pagina, setPagina] = useState(1);
  const [consultas, setConsultas] = useState<any[]>([]);
  const [refrescando, setRefrescando] = useState(false);

  const { data, isLoading, isFetching } = useObtenerHistorialMedicoPaciente({
    page: pagina,
    limit: 5
  });

  // useEffect(() => {
  //   if (data?.linea_tiempo_consultas) {
  //     if (pagina === 1) {
  //       setConsultas(data.linea_tiempo_consultas);
  //     } else {
  //       setConsultas(prev => [...prev, ...(data.linea_tiempo_consultas ?? [])]);
  //     }
  //   }
  // }, [data, pagina]);

  useEffect(() => {
    if (data?.linea_tiempo_consultas && data.linea_tiempo_consultas.length > 0) {
      
      // 🛠️ HACK TEMPORAL: Tomamos el primer registro y lo multiplicamos por 10
      const registroEjemplo = data.linea_tiempo_consultas[0];
      
      const mockMultiplicado = Array.from({ length: 3 }).map((_, index) => ({
        ...registroEjemplo,
        // Evitamos el error de "duplicate keys" asignando un ID único
        id_historial: `mock-${index}`, 
        // Opcional: Le agregamos un número al título para distinguir cada card visualmente
        diagnostico_titulo: `${registroEjemplo.diagnostico_titulo} #${index + 1}`
      }));

      if (pagina === 1) {
        // En lugar de guardar la data original, guardamos nuestro arreglo de 10
        setConsultas(mockMultiplicado);
      } else {
        setConsultas(prev => [...prev, ...mockMultiplicado]);
      }
    }
  }, [data, pagina]);

  const cargarMas = () => {
    const totalPaginas = data?.meta?.total_paginas ?? 0;
    if (!isFetching && pagina < totalPaginas) {
      setPagina(prev => prev + 1);
    }
  };

  const manejarRefresco = () => {
    setRefrescando(true);
    setPagina(1);
    setConsultas([]);
    setRefrescando(false);
  };

  if (isLoading && pagina === 1) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-atria-crema">
        <ActivityIndicator size="large" color="#8B5E3C" />
        <Typography variant="body" className="text-atria-gris mt-4">Cargando tu historial...</Typography>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-atria-crema">
      <View className="px-6 flex-1">
        <Typography variant="h1" className="text-atria-oscuro text-center mt-4 mb-8">
          Historial Médico
        </Typography>

        <FlatList
          data={consultas}
          refreshing={refrescando}
          onRefresh={manejarRefresco}
          keyExtractor={(item) => item.id_historial || Math.random().toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View style={{ flexDirection: 'row', paddingBottom: 24 }}> 
              
              {/* --- COLUMNA IZQUIERDA --- */}
              <View style={{ width: 32, alignItems: 'center', marginRight: 12 }}>
                
                {/* LÍNEA CONECTORA */}
                {index !== consultas.length - 1 && (
                  <View 
                    style={{ 
                      position: 'absolute',
                      top: 28, 
                      bottom: -52, // 👈 La magia matemática exacta para atravesar el hueco
                      width: 2, 
                      backgroundColor: '#8B9491', 
                      opacity: 0.3,
                      zIndex: 0 
                    }} 
                  />
                )}

                {/* EL PUNTO */}
                <View 
                  style={{ 
                    width: 16, 
                    height: 16, 
                    borderRadius: 8, 
                    backgroundColor: '#A87B51', 
                    marginTop: 20,
                    zIndex: 10 
                  }} 
                />
              </View>

              {/* --- COLUMNA DERECHA --- */}
              <View style={{ flex: 1 }}>
                <Card className="p-5">
                  <View className="flex-row items-center mb-3">
                    <Icono nombre="calendar-outline" familia="Ionicons" tamaño={16} color="cafe" />
                    <Typography variant="caption" className="text-atria-cafe font-bold uppercase tracking-wider ml-2 text-[10px]">
                      {item.fecha_formateada}
                    </Typography>
                  </View>
                  
                  <Typography variant="h2" className="text-atria-oscuro mb-2">
                    {item.diagnostico_titulo}
                  </Typography>
                  
                  <Typography variant="body" className="text-atria-gris leading-5" numberOfLines={2}>
                    {item.resumen_notas}
                  </Typography>
                </Card>
              </View>

            </View>
          )}
          onEndReached={cargarMas}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetching ? (
              <View className="py-4">
                <ActivityIndicator color="#A87B51" />
              </View>
            ) : (
              <View className="h-20" /> 
            )
          }
        />
      </View>
    </SafeAreaView>
  );
}
