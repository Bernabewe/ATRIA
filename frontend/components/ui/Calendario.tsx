import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Typography } from './Typography';

// Estructura esperada para cada día que le pasemos al componente
export interface DiaCalendario {
    fecha: string;      // ej. '2026-05-10' (Para usar en la API)
    diaSemana: string;  // ej. 'Lun', 'Mar', 'Mié'
    numeroDia: string;  // ej. '10', '11', '12'
}

interface CalendarioProps {
    dias: DiaCalendario[];
    fechaSeleccionada: string;
    onSelect: (fecha: string) => void;
}

export const Calendario = ({ dias, fechaSeleccionada, onSelect }: CalendarioProps) => {
    return (
        <View className="mb-4">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {dias.map((dia) => {
                    const isSelected = dia.fecha === fechaSeleccionada;
                    return (
                        <TouchableOpacity
                            key={dia.fecha}
                            onPress={() => onSelect(dia.fecha)}
                            className={`items-center justify-center rounded-2xl w-16 h-20 mr-3 ${isSelected
                                    ? 'bg-atria-cafe'
                                    : 'bg-white border border-gray-100 shadow-sm'
                                }`}
                        >
                            <Typography
                                variant="caption"
                                className={isSelected ? 'text-white opacity-80' : 'text-atria-gris'}
                            >
                                {dia.diaSemana}
                            </Typography>
                            <Typography
                                variant="h2"
                                className={`mt-1 ${isSelected ? 'text-white' : 'text-atria-oscuro'}`}
                            >
                                {dia.numeroDia}
                            </Typography>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};