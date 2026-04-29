module.exports = {
  atriaApi: {
    input: {
      // Ajusta esta ruta a donde tengas tu archivo raíz de OpenAPI
      target: '../openapi/index.yaml', 
    },
    output: {
      mode: 'tags-split', // Separa los archivos por etiquetas (Doctor/Paciente)
      target: './api/atria.ts',
      schemas: './api/models',
      client: 'react-query', // Genera Hooks de TanStack Query
      httpClient: 'axios',
      mock: false,
      override: {
        mutator: {
          path: './api/axios-instance.ts', // Para inyectar el token de AuthContext
          name: 'customInstance',
        },
      },
    },
  },
};