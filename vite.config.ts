
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
import path from 'path'
import { componentTagger } from 'lovable-tagger'

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    federation({
      name: 'podcast-manager',
      remotes: {
        launchpad: 'https://launchpad.skyrocketdigital.com/federation/remote.js',
      },
      shared: ['react', 'react-dom', 'react-router-dom']
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Federation requires these build settings
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  },
  server: {
    host: "::",
    port: 8080,
  }
}))
