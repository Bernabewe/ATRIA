import React from 'react';
import { Feather, Ionicons} from '@expo/vector-icons'; 
import { paletaColores, ColorAtria } from '../../constants/theme';
import { View } from 'react-native';


type NombresFeather = React.ComponentProps<typeof Feather>['name'];
type NombresIonicons = React.ComponentProps<typeof Ionicons>['name'];

interface IconoProps {
  // Extraemos todos los nombres válidos que existen dentro de Feather
  nombre: NombresFeather | NombresIonicons;
  familia?: 'Feather' | 'Ionicons';
  tamaño?: number;
  color?: ColorAtria;
  bgcolor?: ColorAtria;
}

export const Icono = ({ nombre, familia = 'Feather', tamaño = 24, color = 'oscuro', bgcolor}: IconoProps) => {
  return (
   <View 
      className={`self-start items-center justify-center ${bgcolor ? 'p-1 rounded-lg' : ''}`}      
      style={{ 
        backgroundColor: bgcolor ? paletaColores[bgcolor] : 'transparent'
      }}
    >
      {familia === 'Ionicons' ? (
        <Ionicons 
          name={nombre as NombresIonicons} 
          size={tamaño} 
          color={paletaColores[color]} 
        />
      ) : (
        <Feather 
          name={nombre as NombresFeather} 
          size={tamaño} 
          color={paletaColores[color]} 
        />
      )}
    </View>
  );
};