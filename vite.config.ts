
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
import { componentTagger } from 'lovable-tagger'
import path from 'path'

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    federation({
      name: 'podcast-manager',
      remotes: {
        launchpad: {
          external: 'https://launchpad.skyrocketdigital.com/functions/v1/federation-auth/remote-entry',
          externalType: 'url',
        }
      },
      shared: {
        'react': { 
          requiredVersion: '^18.0.0',
        },
        'react-dom': { 
          requiredVersion: '^18.0.0',
        },
        'react-router-dom': { 
          requiredVersion: '^6.0.0',
        }
      }
    })
  ].filter(Boolean),
  // Federation requires these build settings
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  },
  // Server configuration
  server: {
    host: "::",
    port: 8080
  },
  // Add path aliases
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  }
}))
