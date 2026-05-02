import { View, ActivityIndicator, Button } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { AuthRespuestaRol } from '../api/models/authRespuestaRol';

export default function Index(){
  const { usuario, isReady } = useAuth();
  const router = useRouter();

  // 1. ESTADO DE ESPERA: Mientras SecureStore lee el disco duro
  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* Circulo de carga mientras recuperamos la sesion */}
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    )
  }

  // 2. REDIRECCION AUTOMATICA: Si ya cargo y detectamos un usuario guardado
  if(usuario) {
    const rutaDestino = usuario.rol === AuthRespuestaRol.PACIENTE
      ? "/(paciente)/home"
      : "/(doctor)/home";

    // El componente Redirect hace el salto automáticamente
    return <Redirect href={rutaDestino}/>
  }

// 3. VISTA INICIAL: Si ya cargó y NO hay nadie logueado
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 }}>
      <Button
        title="Iniciar Sesión"
        onPress={() => router.push("/login")}  
      />
      <Button
        title="Registrarse"
        onPress={() => router.push("/signup")}  
      />  
    </View>
  )
}