import { Text, TextProps } from 'react-native';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'subtitle' | 'caption';
  className?: string;
  children: React.ReactNode;
}

export const Typography = ({ 
  variant = 'body', 
  className = '', 
  children, 
  ...props 
}: TypographyProps) => {
  
  // Definimos los estilos base para cada variante usando las clases de Atria
  const variants = {
    h1: 'text-3xl font-bold text-atria-oscuro',
    h2: 'text-xl font-bold text-atria-oscuro',
    h3: 'text-lg font-semibold text-atria-oscuro',
    subtitle: 'text-xs uppercase tracking-[2px] text-atria-gris font-medium',
    body: 'text-base text-atria-oscuro',
    caption: 'text-sm text-atria-gris italic',
  };

  return (
    <Text 
      className={`${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </Text>
  );
};