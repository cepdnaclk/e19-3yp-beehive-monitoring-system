import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Bind on all interfaces so the dashboard can be opened from another laptop
  // on the hotspot. Vite listens on localhost only by default.
  server: {
    host: true,
    port: 5173,
  },
})
