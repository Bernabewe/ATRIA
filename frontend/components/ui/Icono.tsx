import React from 'react';
import { Feather } from '@expo/vector-icons'; 
import { paletaColores, ColorAtria } from '../../constants/theme';
import { View } from 'react-native';

interface IconoProps {
  // Extraemos todos los nombres válidos que existen dentro de Feather
  nombre: React.ComponentProps<typeof Feather>['name'];
  tamaño?: number;
  color?: ColorAtria;
  bgcolor?: ColorAtria;
}

export const Icono = ({ nombre, tamaño = 24, color = 'oscuro', bgcolor}: IconoProps) => {
  return (
   <View 
      className={`self-start items-center justify-center ${bgcolor ? 'p-1 rounded-lg' : ''}`}      
      style={{ 
        backgroundColor: bgcolor ? paletaColores[bgcolor] : 'transparent'
      }}
    >
      <Feather 
        name={nombre} 
        size={tamaño} 
        color={paletaColores[color]} 
      />
    </View>
  );
};