import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Typography } from './Typography';
import { Icono } from './Icono';
import { Feather } from '@expo/vector-icons';

type VarianteBoton = 'primario' | 'secundario' | 'inactivo';

interface BotonProps {
  texto: string;
  onPress: () => void;
  variante?: VarianteBoton;
  icono?: React.ComponentProps<typeof Feather>['name'];
}

export const Boton = ({ texto, onPress, variante = 'primario', icono }: BotonProps) => {
  const estilosFondo = {
    primario: 'bg-atria-cafe',
    secundario: 'bg-white border-2 border-atria-cafe',
    inactivo: 'bg-atria-gris-claro',
  };

  // 3. Mapeamos los colores del texto
  const estilosTexto = {
    primario: 'text-white',
    secundario: 'text-atria-cafe',
    inactivo: 'text-atria-gris',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={variante === 'inactivo'} 
      className={`py-3 px-6 flex-row rounded-full items-center justify-center w-full ${estilosFondo[variante]}`}
    >
      {icono && (
        <View className="mr-2">
          {/* Le pasamos un color que contraste con el fondo del botón */}
          <Icono 
            nombre={icono} 
            tamaño={20} 
            color={variante === 'primario' ? 'crema' : 'cafe'} 
          />
        </View>
      )}

      <Typography 
        variant="body" 
        className={`font-bold ${estilosTexto[variante]}`}
      >
        {texto}
      </Typography>
    </TouchableOpacity>
  );
};