export const paletaColores = {
  crema: '#FCFAF6',
  cafe: '#A87B51',
  oscuro: '#1E2926',
  gris: '#8B9491',
  gris_claro: '#E5E7EB',
  rojo: '#C53030',
  rojo_bg: '#FDF2F2',
  verde: '#2F855A',
  verde_bg: '#F0FDF4',
  dorado: '#D69E2E',
  coral: '#E28C6E',
};

// Exportamos los nombres de los colores para usarlos en nuestros tipos
export type ColorAtria = keyof typeof paletaColores;