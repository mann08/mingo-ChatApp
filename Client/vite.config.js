import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindPlugin from 'tailwindcss'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindPlugin()],
})
