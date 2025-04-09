
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import federation from "@originjs/vite-plugin-federation";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    federation({
      name: 'podcast-manager-app',
      remotes: {
        auth: 'https://admin.skyrocketdigital.com/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom'],
    }),
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
