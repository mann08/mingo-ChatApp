import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindPlugin from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindPlugin()],
  server: {
    proxy: {
      // Forward /api/* requests to Express server
      '/api': {
        target: 'http://localhost:4500',
        changeOrigin: true,
        secure: false,
      },
      // Forward Socket.IO connections to Express server
      '/socket.io': {
        target: 'http://localhost:4500',
        ws: true,        // Enable WebSocket proxying
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
