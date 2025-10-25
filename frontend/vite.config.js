import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001', // Backend server URL
        changeOrigin: true, // Required for CORS
        rewrite: (path) => path.replace(/^\/api/, '') // Remove /api prefix before forwarding
      }
    }
  }
})