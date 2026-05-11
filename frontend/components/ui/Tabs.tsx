import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Typography } from './Typography';

interface TabsProps {
    opciones: string[];
    seleccionado: string;
    onChange: (opcion: string) => void;
}

export const Tabs = ({ opciones, seleccionado, onChange }: TabsProps) => {
    return (
        <View className="flex-row mb-4 bg-gray-200 rounded-full p-1">
            {opciones.map((opcion) => {
                const isSelected = seleccionado === opcion;
                return (
                    <TouchableOpacity
                        key={opcion}
                        onPress={() => onChange(opcion)}
                        className={`flex-1 py-2 rounded-full items-center ${isSelected ? 'bg-atria-cafe' : ''
                            }`}
                    >
                        <Typography
                            variant="button"
                            className={isSelected ? 'text-white' : 'text-atria-gris'}
                        >
                            {opcion}
                        </Typography>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};