import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'   // ✅ ye line add karo

export default defineConfig({
  plugins: [react(), tailwindcss()],   // ✅ yahan tailwindcss() add karo
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      }
    }
  }
})