import { View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { AuthRespuestaRol } from '../api/models/authRespuestaRol';
import { Avatar } from '@/components/ui/Avatar';
import { Typography } from '@/components/ui/Typography';
import { Boton } from '@/components/ui/Boton';

export default function Index() {
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
  if (usuario) {
    const rutaDestino = usuario.rol === AuthRespuestaRol.PACIENTE
      ? "/(paciente)/home"
      : "/(doctor)/home";

    // El componente Redirect hace el salto automáticamente
    return <Redirect href={rutaDestino} />
  }

  // 3. VISTA INICIAL: Si ya cargó y NO hay nadie logueado
  return (
    <SafeAreaView className="flex-1 bg-[#FDFCF8]"> {/* Usamos el color crema de tu paleta */}
      <View className="flex-1 justify-between px-6 py-10">

        {/* SECCIÓN SUPERIOR Y CENTRAL: Imagen y Textos */}
        <View className="flex-1 justify-center items-center">
          {/* Imagen de bienvenida estilo clínica */}
          <Avatar
            url="https://images.unsplash.com/photo-1638202993928-7267aad84c31?q=80&w=200&auto=format&fit=crop"
            tamaño={120}
          />

          <Typography variant="h1" className="text-center mb-3 text-atria-cafe text-4xl font-bold">
            Atria Médica
          </Typography>
          <Typography variant="body" className="text-center text-atria-gris px-4 leading-relaxed">
            Gestiona tus citas, recetas y tu historial médico en un solo lugar de forma segura y sencilla.
          </Typography>
        </View>

        {/* SECCIÓN INFERIOR: Botones */}
        <View className="w-full gap-y-4 pt-8">
          <Boton
            texto="Iniciar Sesión"
            variante="primario"
            onPress={() => router.push("/login")}
          />
          <Boton
            texto="Crear Cuenta Nueva"
            variante="secundario"
            onPress={() => router.push("/signup")}
          />
        </View>

      </View>
    </SafeAreaView>
  );
}