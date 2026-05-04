import { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Typography } from '../../components/ui/Typography';
import { useObtenerHistorialPagos } from '../../api/paciente-vistas/paciente-vistas';

export default function PagosScreen() {
  const [estatus, setEstatus] = useState<'PENDIENTE' | 'PAGADO'>('PENDIENTE');
  const [pagina, setPagina] = useState(1);
  const [pagos, setPagos] = useState<any[]>([]);
  const [refrescando, setRefrescando] = useState(false);

  const { data, isLoading, isFetching } = useObtenerHistorialPagos({
    page: pagina,
    limit: 5,
    estatus: estatus
  });

  useEffect(() => {
    if (data?.pagos) {
      if (pagina === 1) {
        setPagos(data.pagos);
      } else {
        setPagos(prev => [...prev, ...(data.pagos ?? [])]);
      }
    }
  }, [data, pagina]);

  const cambiarPestana = (nuevoEstatus: 'PENDIENTE' | 'PAGADO') => {
    if (estatus !== nuevoEstatus) {
      setEstatus(nuevoEstatus);
      setPagina(1);
      setPagos([]);
    }
  };

  const cargarMas = () => {
    const totalPaginas = data?.meta?.total_paginas ?? 0;

    if (!isFetching && pagina < totalPaginas) {
      setPagina(prev => prev + 1);
    }
  };

  const manejarRefresco = () => {
    setRefrescando(true);
    setPagina(1);
    setPagos([]);
    setRefrescando(false);
  };

  return (
    <View className="flex-1 bg-atria-crema p-4">
      <Typography variant="h1" className="mb-4 mt-10">Historial de Pagos</Typography>

      {/* 💳 Tarjeta de Resumen Superior */}
      <View className="bg-white p-6 rounded-3xl shadow-sm mb-6 items-center">
        <Typography variant="caption" className="text-atria-gris tracking-widest">PENDIENTE</Typography>
        <Typography variant="h1" className="text-red-500 mt-2">
          {/* Usamos el nuevo campo de nuestro esquema OpenAPI */}
          ${data?.resumen?.monto_total_pendiente?.toFixed(2) ?? '0.00'}
        </Typography>
        <TouchableOpacity className="bg-atria-cafe py-3 px-10 rounded-full mt-4">
          <Typography variant="button" className="text-white">Pagar Ahora</Typography>
        </TouchableOpacity>
      </View>

      {/* 🗂️ Botones de Pestañas */}
      <View className="flex-row mb-4 bg-gray-200 rounded-full p-1">
        <TouchableOpacity
          className={`flex-1 py-2 rounded-full items-center ${estatus === 'PENDIENTE' ? 'bg-atria-cafe' : ''}`}
          onPress={() => cambiarPestana('PENDIENTE')}
        >
          <Typography className={estatus === 'PENDIENTE' ? 'text-white' : 'text-atria-gris'}>Pendientes</Typography>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-2 rounded-full items-center ${estatus === 'PAGADO' ? 'bg-atria-cafe' : ''}`}
          onPress={() => cambiarPestana('PAGADO')}
        >
          <Typography className={estatus === 'PAGADO' ? 'text-white' : 'text-atria-gris'}>Pagados</Typography>
        </TouchableOpacity>
      </View>

      <FlatList
        data={pagos}
        keyExtractor={(item) => item.id_pago} // Usamos el ID único del pago
        renderItem={({ item }) => (
          <View className="bg-white p-4 rounded-2xl mb-4 border-l-4 border-atria-cafe shadow-sm flex-row justify-between items-center">
            <View className="flex-1">
              <Typography variant="caption" className="text-atria-gris">{item.fecha_formateada}</Typography>
              <Typography variant="h3" className="my-1">{item.motivo_consulta}</Typography>
              <Typography variant="body">{item.doctor}</Typography>
            </View>

            <View className="items-end">
              <Typography variant="h3" className="text-atria-cafe">${item.monto.toFixed(2)}</Typography>
              <Typography
                variant="caption"
                className={item.estatus === 'PAGADO' ? 'text-green-600' : 'text-red-500'}
              >
                ● {item.estatus}
              </Typography>
            </View>
          </View>
        )}
        onEndReached={cargarMas}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isFetching ? <ActivityIndicator color="#8B5E3C" /> : null}
        refreshing={refrescando}
        onRefresh={manejarRefresco}
      />
    </View>
  );
}
