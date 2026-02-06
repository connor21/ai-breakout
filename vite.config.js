import { defineConfig } from 'vite'

export default defineConfig({
  base: '/breakout/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true
  }
})
