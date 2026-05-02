import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
// Nota: Ajusta esta importación al nombre real de tu hook de login generado por Orval
import { usePostV1AuthLogin } from '../../api/autenticacion/autenticacion';

export default function Login(){
  const { iniciarSesion } = useAuth();

  // 1. Estado local para el formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 2. Hook de Orval para la petición POST

  // mutate: Es la función que "dispara" la petición al servidor. 
  // Le pusimos el alias loginMutation para que el código sea más descriptivo.
  // isPending: Es un booleano que vale true mientras la petición está en camino.
  const { mutate: loginMutation, isPending } = usePostV1AuthLogin();

  const manejarLogin = () => {
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
      },
      onError: () => {
        Alert.alert('Error', 'Credenciales incorrectas');
      }
    });
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', padding: 20}}>
      <TextInput
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{borderBottomWidth: 1, marginBottom: 20}}
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{borderBottomWidth: 1, marginBottom: 20}}
      />
      <Button
        title={isPending ? "Iniciando..." : "Iniciar Sesión"}
        onPress={manejarLogin}
        disabled={isPending}
      />
    </View>
  )
}

