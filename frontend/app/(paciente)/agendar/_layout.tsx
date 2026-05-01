import { Stack } from 'expo-router';
import { ProveedorReserva } from '../../../context/ContextoReserva';

export default function LayoutAgendar() {
  return (
    <ProveedorReserva>
      <Stack screenOptions={{ 
        headerShown: true, 
        headerTitle: "Nueva Cita",
        headerTintColor: '#8B5E3C', // Café Atria
        headerBackTitle: "Atrás",
      }}>
        <Stack.Screen name="especialidad" options={{ title: "1. Especialidad" }} />
        <Stack.Screen name="sucursal" options={{ title: "2. Sucursal" }} />
        <Stack.Screen name="doctor" options={{ title: "3. Especialista" }} />
        <Stack.Screen name="fecha-hora" options={{ title: "4. Horario" }} />
        <Stack.Screen name="resumen" options={{ title: "5. Confirmación" }} />
      </Stack>
    </ProveedorReserva>
  );
}