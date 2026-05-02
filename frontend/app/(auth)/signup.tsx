import React, { useState } from 'react';
import { Alert, Button, ScrollView, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { usePostV1AuthSignup } from '../../api/autenticacion/autenticacion';

export default function Signup(){
    const router = useRouter();
    const { iniciarSesion } = useAuth();

    // 1. Estados para los 10 campos requeridos
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

    // 2. Hook generado por Orval
    const { mutate: registrosMutation, isPending } = usePostV1AuthSignup();

    const manejarRegistro = () => {
        registrosMutation({
            data: {
                email: email,
                password: password,
                nombre: nombre,
                apellido_paterno: apellidoPaterno,
                apellido_materno: apellidoMaterno,
                fecha_nacimiento: fechaNacimiento,
                // Convertimos altura a numero por si la API lo requiere
                altura: parseFloat(altura),
                tipo_sangre: tipoSangre,
                telefono: telefono,
                direccion: direccion,
            }
        }, {
            onSuccess: (response) => {
                // Opcion A: Si la API devuelve el token inmediatamente al registrarse
                if (response.token && response.rol && response.usuario_id){
                    iniciarSesion({
                        token: response.token,
                        rol: response.rol,
                        usuario_id: response.usuario_id
                    });
                }else {
                // Opcion B: Si la API no devuelve token, lo mandamos a que haga login
                    Alert.alert("Éxito", "Cuenta creada. Por favor inicia sesión.");
                    router.replace('/login');
                }
            },
            onError: () => {
                Alert.alert("Error", "No se pudo completar el registro");
            }
        });
    };

    // Usamos ScrollView en lugar de View por si el teclado oculta los ultimos campos
    return (
        <ScrollView>
            <TextInput placeholder="Correo electrónico" value={email} onChangeText={setEmail} autoCapitalize='none' />
            <TextInput placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
            <TextInput placeholder="Nombre" value={nombre} onChangeText={setNombre} />
            <TextInput placeholder="Apellido Paterno" value={apellidoPaterno} onChangeText={setApellidoPaterno} />
            <TextInput placeholder="Apellido Materno" value={apellidoMaterno} onChangeText={setApellidoMaterno} />
            <TextInput placeholder="Fecha de Nacimiento (YYYY-MM-DD)" value={fechaNacimiento} onChangeText={setFechaNacimiento} />
            <TextInput placeholder="Altura (ej. 1.75)" value={altura} onChangeText={setAltura} keyboardType='numeric'/>
            <TextInput placeholder="Tipo de Sangre (ej. O+)" value={tipoSangre} onChangeText={setTipoSangre} />
            <TextInput placeholder="Telefono" value={telefono} onChangeText={setTelefono} keyboardType='phone-pad' />
            <TextInput placeholder="Direccion" value={direccion} onChangeText={setDireccion} />
            <Button 
                title={isPending ? "Registrando..." : "Crear Cuenta"}
                onPress={manejarRegistro}
                disabled={isPending}
            />
        </ScrollView>
    )
}