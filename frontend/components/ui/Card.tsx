import React, { ReactNode } from 'react';
import { View, ViewProps } from 'react-native';

type PosicionBorde = 'arriba' | 'izquierda' | 'abajo' | 'derecha' | 'ninguno';

interface CardProps extends ViewProps {
  children: ReactNode; // Esto permite que el Card reciba otros componentes dentro
  className?: string;
  borde?: PosicionBorde;
}

export const Card = ({ children, className = '', borde = 'ninguno', ...rest }: CardProps) => {
  const estilosBorde = {
    arriba: 'border-t-4 border-atria-cafe',
    izquierda: 'border-l-4 border-atria-cafe',
    abajo: 'border-b-4 border-atria-cafe',
    derecha: 'border-r-4 border-atria-cafe',
    ninguno: '',
  };

  return (
    <View 
      className={`bg-white rounded-xl p-4 shadow-sm mb-4 ${estilosBorde[borde]} ${className}`}
      style={{ elevation: 3 }} 
      {...rest}
    >
      {children}
    </View>
  );
};