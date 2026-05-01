import { View, Button } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { AuthRespuestaRol } from '../api/models/authRespuestaRol';

export default function Index(){
  const { usuario } = useAuth();
  const router = useRouter();

  // 1. Lógica de Redirección Automática
  if(usuario) {
    const rutaDestino = usuario.rol === AuthRespuestaRol.PACIENTE
      ? "/(paciente)/home"
      : "/(doctor)/home";

    // El componente Redirect hace el salto automáticamente[cite: 2]
    return <Redirect href={rutaDestino}/>
  }

  // 2. Vista Inicial para usuarios sin sesión (Estado null)
  return (
    <View>
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