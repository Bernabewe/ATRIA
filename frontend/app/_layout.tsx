import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Pantalla inicial */}
        <Stack.Screen name="index" />
        {/* El resto se maneja por grupos */}
      </Stack>
    </AuthProvider>
  );
}