import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ActionTileProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

export const ActionTile = ({ title, icon, onPress }: ActionTileProps) => (
  <TouchableOpacity 
    onPress={onPress}
    className="bg-white p-4 rounded-2xl w-[48%] mb-4 items-center shadow-sm border border-gray-100"
  >
    <View className="bg-orange-50 p-3 rounded-full mb-2">
      <Ionicons name={icon} size={24} color="#aa8b58ff" />
    </View>
    <Text className="text-atria-oscuro font-medium text-center">{title}</Text>
  </TouchableOpacity>
);