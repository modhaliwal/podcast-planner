
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'your-module-name',
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
  ],
  // Federation requires these build settings
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  },
  // Added server configuration to use port 8080
  server: {
    port: 8080
  }
})
