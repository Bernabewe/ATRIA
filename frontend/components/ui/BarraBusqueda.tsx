import React from 'react';
import { View, Platform } from 'react-native';
import { Card } from './Card';
import { CampoTexto } from './CampoTexto';
import { Icono } from './Icono';

interface BarraBusquedaProps {
    valor: string;
    onChange: (texto: string) => void;
    placeholder?: string;
}

export const BarraBusqueda = ({ valor, onChange, placeholder = "Buscar por nombre..." }: BarraBusquedaProps) => {
    return (
        <View className="mb-6 px-4">
            {/* 1. EJE Y: h-11 (delgado) e items-center alinea la lupa y el input al centro exacto.
          2. EJE X: pr-2 (mínimo espacio al final) permite que el texto llegue casi al borde derecho. 
      */}
            <Card className="bg-white h-11 py-3 pl-4 pr-2 shadow-sm rounded-2xl flex-row items-center">

                <Icono
                    nombre="search"
                    familia="Feather"
                    color="cafe"
                    tamaño={18}
                />

                {/* EJE X: flex-1 expande el contenedor hasta el final. 
            EJE Y: h-full y p-0 eliminan los espacios internos (cajas naranja/verde de tu imagen).
        */}
                <View className="flex-1 h-full ml-2">
                    <CampoTexto
                        placeholder={placeholder}
                        value={valor}
                        onChangeText={onChange}
                        // h-full y p-0 son vitales para bajar el texto al centro
                        className="bg-transparent h-full p-0 m-0 text-atria-oscuro text-sm"
                        // Propiedades específicas para forzar el centrado vertical en Android e iOS
                        style={{
                            textAlignVertical: 'center', // Android
                            paddingVertical: 0,           // iOS/Android
                            includeFontPadding: false     // Elimina espacio extra de la fuente
                        }}
                    />
                </View>

            </Card>
        </View>
    );
};