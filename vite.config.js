import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/admin': {
        target: 'http://localhost:8080', // Assuming backend is running on port 8080
        changeOrigin: true,
      },
    },
  },
})
