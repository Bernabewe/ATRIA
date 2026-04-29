/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        atria: {
          crema: 'rgb(var(--color-atria-crema) / <alpha-value>)',
          cafe: 'rgb(var(--color-atria-cafe) / <alpha-value>)',
          oscuro: 'rgb(var(--color-atria-oscuro) / <alpha-value>)',
          gris: 'rgb(var(--color-atria-gris) / <alpha-value>)',
          rojo: 'rgb(var(--color-atria-rojo) / <alpha-value>)',
          'rojo-bg': 'rgb(var(--color-atria-rojo-bg) / <alpha-value>)',
        }
      },
    },
  },
  plugins: [],
}