import { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { Typography } from '../../components/ui/Typography';
import { useObtenerHistorialMedicoPaciente } from '../../api/paciente-vistas/paciente-vistas';

export default function ExpedienteScreen() {
  const [pagina, setPagina] = useState(1);
  const [consultas, setConsultas] = useState<any[]>([]);
  const [refrescando, setRefrescando] = useState(false);

  const { data, error, isLoading, isFetching } = useObtenerHistorialMedicoPaciente({
    page: pagina,
    limit: 5
  });

  useEffect(() => {
    if (data?.linea_tiempo_consultas) {
      if (pagina === 1) {
        setConsultas(data.linea_tiempo_consultas);
      } else {
        setConsultas(prev => [...prev, ...(data.linea_tiempo_consultas ?? [])]);
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
      <View className="flex-1 justify-center items-center bg-atria-crema">
        <ActivityIndicator size="large" color="#8B5E3C" />
        <Typography>Cargando tu historial...</Typography>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-atria-crema p-4">
      <Typography variant="h1" className="mb-6 mt-10">Historial Médico</Typography>

      <FlatList
        data={consultas}
        refreshing={refrescando}
        onRefresh={manejarRefresco}
        keyExtractor={(item) => item.id_historial}
        renderItem={({ item }) => (
          <View className="bg-white p-4 rounded-2xl mb-4 border-l-4 border-atria-cafe shadow-sm">
            <Typography variant="caption" className="text-atria-gris">{item.fecha_formateada}</Typography>
            <Typography variant="h3" className="my-1">{item.diagnostico_titulo}</Typography>
            <Typography variant="body" numberOfLines={2}>{item.resumen_notas}</Typography>
          </View>
        )}
        onEndReached={cargarMas}
        onEndReachedThreshold={0.5} // Dispara cuando falta el 50% para llegar al final
        ListFooterComponent={isFetching ? <ActivityIndicator color="#8B5E3C" /> : null}
      />
    </View>
  );
}
