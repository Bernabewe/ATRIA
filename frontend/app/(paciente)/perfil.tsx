import React from "react";
import { ActivityIndicator, ScrollView, View, Text, Button } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useObtenerPerfilPaciente } from "../../api/paciente-vistas/paciente-vistas";
import { router } from "expo-router";

export default function Perfil() {
  const { cerrarSesion } = useAuth();

  // 1. Consumimos los datos simulados por Prism
  const { data: perfil, isLoading, error } = useObtenerPerfilPaciente();

  // 🕵️‍♂️ Espiamos qué hay en las variables
  console.log("¿Hay error en la petición?:", error);
  console.log("Datos recibidos de Prism:", perfil);
  
  // 2. Manejo del estado de carga
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#8B5E3C" />
      </View>
    );
  }

  // 3. Renderizado puro de datos (Estructura logica)
  return (
    <ScrollView style={{ padding: 20 }}>

      <Text>--- CABECERA ---</Text>
      <Text>URL de Foto: {perfil?.foto_perfil_url || 'Sin foto'}</Text>
      <Text>Nombre Completo: {perfil?.nombre_completo} </Text>
      <Text>ID de Paciente: {perfil?.id_paciente}</Text>

      <Text>{'\n'}--- INFORMACIÓN PERSONAL ---</Text>
      <Text>Fecha de Nacimiento: {perfil?.fecha_nacimiento}</Text>
      {/* Nota: Asumimos que la API devuelve peso y altura. Si no están en el YAML, Prism no los devolverá */}
      <Text>Peso: {perfil?.peso} kg</Text> 
      <Text>Altura: {perfil?.altura} m</Text>
      <Text>Tipo de Sangre: {perfil?.tipo_sangre}</Text>

      <Text>{'\n'}--- DETALLES DE CONTACTO ---</Text>
      <Text>Teléfono: {perfil?.telefono}</Text>
      <Text>Dirección: {perfil?.direccion_completa}</Text>

      <Text>{'\n'}--- ACCIONES ---</Text>
      <View style={{ gap: 10, marginTop: 20 }}>
        <Button 
          title="Cerrar Sesión" 
          onPress={cerrarSesion} 
          color="#FF5252" 
        />
      </View>
    </ScrollView>
  )
}