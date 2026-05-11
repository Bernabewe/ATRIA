import React from 'react';
import { TouchableOpacity, View } from 'react-native';

interface ToggleProps {
    activo: boolean;
    onToggle: (valor: boolean) => void;
}

export const Toggle = ({ activo, onToggle }: ToggleProps) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onToggle(!activo)}
            // Cambia el color de fondo dependiendo de si está activo o no
            className={`w-14 h-7 rounded-full justify-center px-1 transition-all ${activo ? 'bg-atria-cafe' : 'bg-gray-300'
                }`}
        >
            <View
                // Mueve el círculo blanco a la izquierda o derecha
                className={`w-5 h-5 rounded-full bg-white shadow-sm ${activo ? 'self-end' : 'self-start'
                    }`}
            />
        </TouchableOpacity>
    );
};