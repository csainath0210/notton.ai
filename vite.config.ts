// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
// })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      // Proxy API calls to Express server
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/categories': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/tasks': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/today': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})