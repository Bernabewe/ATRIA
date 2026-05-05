import React from 'react';
import { TextInput, View, TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Icono } from './Icono';

interface CampoTextoProps extends TextInputProps {
  icono?: React.ComponentProps<typeof Feather>['name'];
}

export const CampoTexto = ({ icono, ...rest }: CampoTextoProps) => {
  return (
    <View 
      className="w-full mb-4 bg-atria-gris-claro rounded-xl flex-row items-center px-4"
    >
      {icono && (
        <View className="mr-2">
          <Icono nombre={icono} tamaño={20} color="gris" />
        </View>
      )}

      <TextInput
        className="text-atria-oscuro py-3 flex-1"
        placeholderTextColor="#8B9491" 
        {...rest}
      />
    </View>
  );
};