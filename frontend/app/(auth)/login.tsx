import React, { useState } from 'react';
import { View, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { usePostV1AuthLogin } from '../../api/autenticacion/autenticacion';
import { Typography } from '@/components/ui/Typography';
import { Boton } from '@/components/ui/Boton';
import { CampoTexto } from '@/components/ui/CampoTexto';
import { AuthRespuestaRol } from '../../api/models/authRespuestaRol';
import { Feather } from '@expo/vector-icons';

export default function Login(){
  const router = useRouter();
  const { iniciarSesion } = useAuth();

  // 1. Estado local para el formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  // 2. Hook de Orval para la petición POST

  // mutate: Es la función que "dispara" la petición al servidor. 
  // Le pusimos el alias loginMutation para que el código sea más descriptivo.
  // isPending: Es un booleano que vale true mientras la petición está en camino.
  const { mutate: loginMutation, isPending } = usePostV1AuthLogin();

  const manejarLogin = async () => {
    loginMutation({
      data: {
        correo: email,
        password: password,
      }
    }, {
      onSuccess: (response) => {
        // 3. Si es exitoso, extraemos los datos que pide nuestro contexto
        if(response.token && response.rol && response.usuario_id){
          iniciarSesion({
            token: response.token,
            rol: response.rol,
            usuario_id: response.usuario_id
          })
        }

        if (response.rol === AuthRespuestaRol.PACIENTE) {
          router.replace('/(paciente)/home');
        } else {
          router.replace('/(doctor)/home');
        }
      },
      onError: () => {
        setModalVisible(true);
      }
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-4"> {/* Ajustamos el padding superior */}
        
        {/* BOTÓN DE ATRÁS */}
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="mb-6 w-10 h-10 bg-atria-gris-claro rounded-full items-center justify-center"
        >
          <Feather name="arrow-left" size={24} color="#1A1A1B" />
        </TouchableOpacity>

        {/* Cabecera de la pantalla */}
        <View className="mb-10">
          <Typography variant="h1" className="text-atria-cafe mb-2">
            Bienvenido de nuevo 👋
          </Typography>
          <Typography variant="body" className="text-atria-gris">
            Ingresa tus datos para acceder a tu cuenta.
          </Typography>
        </View>

        {/* Formulario */}
        <View className="gap-y-2 mb-8">
          <CampoTexto
            icono="mail"
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <CampoTexto
            icono="lock"
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <Boton
          texto={isPending ? "Verificando..." : "Iniciar Sesión"}
          onPress={manejarLogin}
          variante="primario"
          disabled={isPending} 
        />

        {/* Componente Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)} 
        >
          <View className="flex-1 justify-center items-center bg-black/50 px-6">
            <View className="bg-white w-full rounded-2xl p-6 items-center">
              <Typography variant="h2" className="text-atria-rojo mb-2">
                Error de acceso
              </Typography>
              <Typography variant="body" className="text-center text-atria-gris mb-6">
                El correo o la contraseña son incorrectos. Por favor, revisa tus datos e intenta de nuevo.
              </Typography>
              
              <View className="w-full">
                <Boton 
                  texto="Entendido" 
                  variante="primario" 
                  onPress={() => setModalVisible(false)} 
                />
              </View>
            </View>
          </View>
        </Modal>

      </View>
    </SafeAreaView>
  );
}

