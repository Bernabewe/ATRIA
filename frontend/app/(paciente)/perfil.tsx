import { View } from 'react-native';
import { Typography } from '../../components/ui/Typography';

export default function PerfilScreen() {
  return (
    <View className="flex-1 bg-atria-crema justify-center items-center">
      <Typography variant="h1">Mi Perfil</Typography>
      <Typography variant="body" className="mt-2">Configuración de cuenta</Typography>
    </View>
  );
}
