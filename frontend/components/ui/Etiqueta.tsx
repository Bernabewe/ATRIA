import React from 'react';
import { View } from 'react-native';
import { Typography } from './Typography';

// 1. Definimos los estados posibles en español
type EstadoEtiqueta = 'confirmada' | 'pendiente' | 'neutral';

interface EtiquetaProps {
  texto: string;
  estado?: EstadoEtiqueta;
}

export const Etiqueta = ({ texto, estado = 'neutral' }: EtiquetaProps) => {
  // 2. Mapeamos cada estado a los fondos que pusiste en tailwind.config.js
  const estilosFondo = {
    confirmada: 'bg-atria-verde_bg',
    pendiente: 'bg-atria-rojo_bg',
    neutral: 'bg-gray-100', // Un gris genérico para casos por defecto
  };

  // 3. Mapeamos cada estado al color de texto correspondiente
  const estilosTexto = {
    confirmada: 'text-atria-verde',
    pendiente: 'text-atria-rojo',
    neutral: 'text-atria-gris',
  };

  return (
    // self-start evita que la etiqueta se estire a todo el ancho de la pantalla
    <View className={`px-2 py-1 rounded-md self-start ${estilosFondo[estado]}`}>
      <Typography 
        variant="caption" 
        className={`uppercase font-bold ${estilosTexto[estado]}`}
      >
        {texto}
      </Typography>
    </View>
  );
};