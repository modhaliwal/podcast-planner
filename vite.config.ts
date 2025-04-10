
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
        launchpad: 'https://services.skyrocketdigital.com/functions/v1/federation-remote',
      },
      shared: {
        'react': { 
          requiredVersion: '^18.0.0',
          singleton: true,  // This is crucial!
        },
        'react-dom': { 
          requiredVersion: '^18.0.0',
          singleton: true,  // This is crucial!
        },
        'react-router-dom': { 
          requiredVersion: '^6.0.0',
          singleton: true,  // This is crucial!
        }
      }
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
