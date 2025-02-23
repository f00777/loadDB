import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://loaddbapi.vercel.app/api', // Servidor al que redirigir las solicitudes
        changeOrigin: true, // Cambiar el origen de la solicitud para evitar problemas de CORS
        rewrite: (path) => path.replace(/^\/api/, ''), // Eliminar el prefijo "/api" en la solicitud
      },
    },
  },
});