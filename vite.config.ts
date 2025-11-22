import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-query': ['@tanstack/react-query'],
          'react-router': ['react-router-dom'],
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
  },
})
