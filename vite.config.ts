import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  root: './',
  base: '/static/',
  build: {
    outDir: './dist',
  },
  plugins: [react()]
})
