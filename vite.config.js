import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        internships: resolve(__dirname, 'internships.html'),
        internship: resolve(__dirname, 'internship.html')
      }
    }
  },
  server: {
    port: 3000,
    host: true
  }
})
