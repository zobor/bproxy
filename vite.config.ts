import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  root: './',
  base: '/dist/',
  build: {
    outDir: './dist',
    emptyOutDir: false,
  },
  plugins: [react()]
})
