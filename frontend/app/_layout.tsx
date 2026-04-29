import '../global.css';
import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Desactiva los reintentos para que no se quede cargando si el backend está apagado
      refetchOnWindowFocus: false, // Evita recargar los datos cada vez que cambias de pestaña
      staleTime: 1000 * 60 * 5, // Mantiene los datos en caché por 5 minutos sin marcarlos como obsoletos
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Pantalla inicial */}
          <Stack.Screen name="index" />
          {/* El resto se maneja por grupos */}
        </Stack>
      </AuthProvider>
    </QueryClientProvider>
  );
}