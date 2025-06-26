import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'scripts/main.js',
      formats: ['iife'],
      name: 'IntermexScript',
      fileName: () => 'bundle.min.js'
    },
    outDir: 'dist',
    minify: true,
    emptyOutDir: true
  }
})