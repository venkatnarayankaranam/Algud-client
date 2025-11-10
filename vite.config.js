import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://algud-server.onrender.com/api',
        changeOrigin: true,
      }
    }
    ,
    // Ensure dev server responses include COOP header so GSI popup can communicate via postMessage
    // Set COOP_ALLOW_POPUPS=false to disable this header in development if needed.
    headers: process.env.COOP_ALLOW_POPUPS === 'false' ? undefined : {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups'
    }
  }
})
