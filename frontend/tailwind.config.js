/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        atria: {
          crema: '#FCFAF6',     // Fondo claro general
          cafe: '#A87B51',      // Botones y acentos principales
          oscuro: '#1E2926',    // Títulos y textos principales
          gris: '#8B9491',      // Subtítulos y textos secundarios
          rojo: '#C53030',      // Textos de cancelación/error
          rojo_bg: '#FDF2F2',   // Fondo del cuadro de cancelación
          verde: '#2F855A',     // Confirmada / Pagado
          verde_bg: '#F0FDF4',  // Fondo etiqueta confirmada
          dorado: '#D69E2E',    // Premium / Estrellas
          coral: '#E28C6E',     // Iconos de especialidades
        }
      },
    },
  },
  plugins: [],
}