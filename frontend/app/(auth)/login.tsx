import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ATRIA - Login</Text>
      
      <Button 
        title="Entrar como Paciente" 
        onPress={() => login('patient', 'fake-jwt-token-123')} 
      />
      
      <View style={{ marginVertical: 10 }} />

      <Button 
        title="Entrar como Doctor" 
        color="#8B5E3C" // Color café de tu identidad visual
        onPress={() => login('doctor', 'fake-jwt-token-456')} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#FDFCF8' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 40 }
});