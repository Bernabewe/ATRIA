import React from "react";
import { ActivityIndicator, ScrollView, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from "../../context/AuthContext";
import { useObtenerPerfilPaciente } from "../../api/paciente-vistas/paciente-vistas";

import { Typography } from "../../components/ui/Typography";
import { Card } from "../../components/ui/Card";
import { Avatar } from "../../components/ui/Avatar";
import { Icono } from "../../components/ui/Icono";
import { Boton } from "../../components/ui/Boton";

export default function Perfil() {
  const { cerrarSesion } = useAuth();

  // 1. Consumimos los datos simulados por Prism
  const { data: perfil, isLoading } = useObtenerPerfilPaciente();

  const renderDataRow = (iconName: any, label: string, value: string | number | null | undefined, isLast = false, iconFamily: any = "Ionicons") => {
    if (!value && value !== 0) return null; 

    return (
      <View 
        style={{ 
          flexDirection: 'row', 
          alignItems: 'center', // Centra verticalmente el icono, la etiqueta y el valor
          paddingVertical: 16,  // Le da espacio de "respiro" arriba y abajo (py-4)
          borderBottomWidth: isLast ? 0 : 1, // Agrega la línea separadora
          borderBottomColor: '#F3F4F6' // Un gris muy tenue
        }}
      >
        {/* Contenedor del Icono con Ancho Fijo y Margen */}
        <View style={{ width: 15, alignItems: 'center', marginRight: 16 }}>
          <Icono familia={iconFamily} nombre={iconName} color="cafe" tamaño={20} />
        </View>
        
        {/* Etiqueta (Ej. "Fecha de Nacimiento") */}
        <View style={{ flex: 1, paddingRight: 8 }}>
          <Typography variant="body" className="text-atria-oscuro">
            {label}
          </Typography>
        </View>
        
        {/* Valor (Ej. "15 Oct 1990") */}
        <View style={{ flex: 1, alignItems: 'flex-end', paddingLeft: 8 }}>
          <Typography variant="body" className="text-atria-oscuro font-bold text-right">
            {value}
          </Typography>
        </View>
      </View>
    );
  };
  
  // 2. Manejo del estado de carga
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-atria-crema">
        <ActivityIndicator size="large" color="#A87B51" />
        <Typography className="text-atria-gris mt-4">Cargando perfil...</Typography>
      </SafeAreaView>
    );
  }

  // 3. Renderizado puro de datos (Estructura logica)
  return (
    <SafeAreaView className="flex-1 bg-atria-crema">
      <ScrollView 
        className="flex-1 px-6 pt-4" 
        showsVerticalScrollIndicator={false}
      >
        
        {/* --- HEADER (Título + Icono Ajustes) --- */}
        <View className="flex-row justify-between items-center mb-10">
          {/* Typography h3 para título de pantalla central, margin left para compensar icono */}
          <Typography variant="h3" className="text-atria-oscuro flex-1 text-center ml-8">
            Mi Perfil
          </Typography>
          <TouchableOpacity onPress={() => console.log("Ajustes press")}>
            <Icono familia="Ionicons" nombre="settings-outline" color="oscuro" tamaño={24} />
          </TouchableOpacity>
        </View>

        {/* --- CABECERA DE PERFIL (Avatar + Nombre + ID) --- */}
        <View className="items-center mb-10">
          <View className="mb-6">
            <Avatar 
              url={perfil?.foto_perfil_url || ""} 
              tamaño={110} 
            />
          </View>
          {/* Typography h1 para el nombre (más grande y negrita) */}
          <Typography variant="h1" className="text-atria-oscuro mb-1 text-center">
            {perfil?.nombre_completo || 'Cargando...'}
          </Typography>
          {/* Typography caption en mayúsculas para el ID */}
          <Typography variant="caption" className="text-atria-gris font-mono uppercase text-center">
             ID: {perfil?.id_paciente || 'AS-XXXXX'}
          </Typography>
        </View>

        {/* --- BLOQUE 1: INFORMACIÓN PERSONAL --- */}
        {/* Card con borde superior dorado, padding Atria */}
        <Card borde="arriba" className="p-6 mb-6">
          {/* Typography h2 para títulos de sección */}
          <Typography variant="h2" className="text-atria-oscuro mb-2">
            Información Personal
          </Typography>
          
          {renderDataRow("calendar-outline", "Fecha de Nacimiento", perfil?.fecha_nacimiento)}
          
          {/* Manejo de Peso y Altura con unidades */}
          {renderDataRow("scale-outline", "Peso", perfil?.peso ? `${perfil.peso} kg` : null)}
          
          {/* Usamos MaterialIcons para 'ruler' (regla) que se parece a la imagen */}
          {renderDataRow("swap-vertical-outline", "Altura", perfil?.altura ? `${perfil.altura} m` : null)}
          {renderDataRow("water-outline", "Tipo de Sangre", perfil?.tipo_sangre, true)}
        </Card>

        {/* --- BLOQUE 2: DETALLES DE CONTACTO --- */}
        <Card borde="arriba" className="p-6 mb-10">
          <Typography variant="h2" className="text-atria-oscuro mb-2">
            Detalles de Contacto
          </Typography>
          
          {renderDataRow("call-outline", "Teléfono", perfil?.telefono)}
          
          {/* Valor de dirección puede ocupar 2 líneas según imagen, renderDataRow lo maneja */}
          {renderDataRow("location-outline", "Dirección", perfil?.direccion_completa, true)}
        </Card>

        {/* --- ACCIONES PRINCIPALES --- */}
        {/* Botón primario café lleno con icono de edición a la izquierda */}
        <Boton 
          texto="Cerrar Sesión" 
          variante="primario" // Fondo café, texto blanco
          icono="log-out" // Icono de Feather
          onPress={cerrarSesion}
          className="mb-6"
        />
      </ScrollView>
    </SafeAreaView>
  );
}