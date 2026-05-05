import React from 'react';
import { Image } from 'react-native';

interface AvatarProps {
  url: string;
  tamaño?: number; // Usamos un número para definir el ancho y alto
}

export const Avatar = ({ url, tamaño = 48 }: AvatarProps) => {
  return (
    <Image
      source={{ uri: url }}
      style={{ width: tamaño, height: tamaño }}
      className="rounded-full bg-atria-gris"
    />
  );
};