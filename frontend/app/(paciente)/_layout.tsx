import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Expo ya lo incluye

export default function PatientTabsLayout() {
  return (
    // Contenedor Tabs: Define el comportamiento global de la barra inferior
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#8B5E3C', // Café Atria
      tabBarInactiveTintColor: '#9BA1A6',
      tabBarStyle: { backgroundColor: '#FFFFFF', borderTopWidth: 0, elevation: 5 },
      headerShown: false,
    }}>
      {/* --- PANTALLAS VISIBLES EN LA BARRA (TABS) --- */}
      {/* El atributo 'name' DEBE coincidir con el nombre del archivo .tsx en la misma carpeta */}
      <Tabs.Screen name="home" options={{title: 'Inicio',tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />}} />
      <Tabs.Screen name="citas" options={{ title: 'Citas', tabBarIcon: ({ color }) => <Ionicons name="calendar" size={24} color={color} /> }} />
      <Tabs.Screen name="expediente" options={{ title: 'Expediente', tabBarIcon: ({ color }) => <Ionicons name="document-text" size={24} color={color} /> }} />
      <Tabs.Screen name="pagos" options={{ title: 'Pagos', tabBarIcon: ({ color }) => <Ionicons name="card" size={24} color={color} /> }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil', tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} /> }} />
      
      {/* --- PANTALLAS OCULTAS DE LA BARRA --- */}
      {/* El atributo 'href: null' impide que aparezcan en la barra inferior */}
      <Tabs.Screen name="gestionar-cita" options={{href: null}} />
      <Tabs.Screen name="agendar" options={{ href: null }} />
    </Tabs>
  );
}