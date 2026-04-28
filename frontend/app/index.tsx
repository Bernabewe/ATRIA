import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a ATRIA</Text>
      <Text style={styles.subtitle}>Sistema de Gestión Médica</Text>
      
      {/* Botones temporales para probar la navegación más tarde */}
      <Link href="/(patient)/home" style={styles.link}>Entrar como Paciente</Link>
      <Link href="/(doctor)/home" style={styles.link}>Entrar como Doctor</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FDFCF8', // El tono crema que definimos
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1B',
  },
  subtitle: {
    fontSize: 16,
    color: '#8B5E3C', // El tono café de tu marca
    marginBottom: 20,
  },
  link: {
    marginTop: 10,
    color: '#007AFF',
    textDecorationLine: 'underline',
  }
});