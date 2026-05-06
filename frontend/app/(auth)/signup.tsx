import React, { useState } from 'react';
import { View, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { usePostV1AuthSignup } from '../../api/autenticacion/autenticacion';

import { Typography } from '../../components/ui/Typography';
import { Boton } from '../../components/ui/Boton';
import { CampoTexto } from '../../components/ui/CampoTexto';

export default function Signup() {
  const router = useRouter();
  const { iniciarSesion } = useAuth();

  // 1. Estados del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [altura, setAltura] = useState('');
  const [tipoSangre, setTipoSangre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');

  // 2. Estado dinámico para el Modal
  const [modal, setModal] = useState({
    visible: false,
    titulo: '',
    mensaje: '',
    esExito: false
  });

  const { mutate: registrosMutation, isPending } = usePostV1AuthSignup();

  const manejarRegistro = () => {
    registrosMutation({
      data: {
        email, password, nombre, apellido_paterno: apellidoPaterno,
        apellido_materno: apellidoMaterno, fecha_nacimiento: fechaNacimiento,
        altura: parseFloat(altura), tipo_sangre: tipoSangre, telefono, direccion
      }
    }, {
      onSuccess: (response) => {
        if (response.token && response.rol && response.usuario_id) {
          iniciarSesion({
            token: response.token,
            rol: response.rol,
            usuario_id: response.usuario_id
          });
        } else {
          // Configuramos el modal para mostrar ÉXITO
          setModal({
            visible: true,
            titulo: '¡Cuenta creada!',
            mensaje: 'Tu registro fue exitoso. Por favor, inicia sesión para continuar.',
            esExito: true
          });
        }
      },
      onError: () => {
        // Configuramos el modal para mostrar ERROR
        setModal({
          visible: true,
          titulo: 'Error en el registro',
          mensaje: 'No se pudo completar el registro. Revisa tus datos e intenta de nuevo.',
          esExito: false
        });
      }
    });
  };

  // Función para cerrar el modal y decidir qué hacer después
  const cerrarModal = () => {
    setModal(prev => ({ ...prev, visible: false }));
    
    // Si fue un registro exitoso, al darle "Entendido", lo mandamos al Login
    if (modal.esExito) {
      router.replace('/login');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* ScrollView permite deslizar si el contenido o el teclado tapan la pantalla */}
      <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
        
        {/* BOTÓN DE ATRÁS */}
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="mb-6 w-10 h-10 bg-atria-gris-claro rounded-full items-center justify-center"
        >
          <Feather name="arrow-left" size={24} color="#1A1A1B" />
        </TouchableOpacity>

        <View className="mb-8">
          <Typography variant="h1" className="text-atria-cafe mb-2">Crear Cuenta 📝</Typography>
          <Typography variant="body" className="text-atria-gris">Ingresa tus datos personales y médicos para unirte a Atria Médica.</Typography>
        </View>

        {/* FORMULARIO */}
        <View className="gap-y-1 mb-8">
          <Typography variant="h3" className="mb-2 mt-4 text-atria-cafe">Datos de la Cuenta</Typography>
          <CampoTexto icono="mail" placeholder="Correo electrónico" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
          <CampoTexto icono="lock" placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />

          <Typography variant="h3" className="mb-2 mt-4 text-atria-cafe">Datos Personales</Typography>
          <CampoTexto icono="user" placeholder="Nombre" value={nombre} onChangeText={setNombre} />
          <CampoTexto icono="user" placeholder="Apellido Paterno" value={apellidoPaterno} onChangeText={setApellidoPaterno} />
          <CampoTexto icono="user" placeholder="Apellido Materno" value={apellidoMaterno} onChangeText={setApellidoMaterno} />
          <CampoTexto icono="calendar" placeholder="Fecha Nacimiento (YYYY-MM-DD)" value={fechaNacimiento} onChangeText={setFechaNacimiento} />
          <CampoTexto icono="phone" placeholder="Teléfono" value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" />
          <CampoTexto icono="map-pin" placeholder="Dirección" value={direccion} onChangeText={setDireccion} />

          <Typography variant="h3" className="mb-2 mt-4 text-atria-cafe">Datos Médicos</Typography>
          <CampoTexto icono="activity" placeholder="Altura (ej. 1.75)" value={altura} onChangeText={setAltura} keyboardType="numeric" />
          <CampoTexto icono="droplet" placeholder="Tipo de Sangre (ej. O+)" value={tipoSangre} onChangeText={setTipoSangre} />
        </View>

        <View className="mb-12">
          <Boton
            texto={isPending ? "Registrando..." : "Crear Cuenta"}
            onPress={manejarRegistro}
            variante="primario"
            disabled={isPending}
          />
        </View>
      </ScrollView>

      {/* NUESTRO MODAL DINÁMICO */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modal.visible}
        onRequestClose={cerrarModal}
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-6">
          <View className="bg-white w-full rounded-2xl p-6 items-center">
            {/* El color del título cambia según si fue éxito (cafe) o error (rojo) */}
            <Typography variant="h2" className={`mb-2 ${modal.esExito ? 'text-atria-cafe' : 'text-atria-rojo'}`}>
              {modal.titulo}
            </Typography>
            <Typography variant="body" className="text-center text-atria-gris mb-6">
              {modal.mensaje}
            </Typography>
            
            <View className="w-full">
              <Boton 
                texto="Entendido" 
                variante="primario" 
                onPress={cerrarModal} 
              />
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}