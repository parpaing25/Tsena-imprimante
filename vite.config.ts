import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Audit 06/09/2026 (P0) : `base: './'` produisait des chemins RELATIFS
  // (./assets/…). Sur /blog/1 ou /faq/, le navigateur cherchait
  // /blog/assets/index-….js, o2switch renvoyait index.html en text/html et le
  // module échouait (« Strict MIME type checking ») : page figée, sans style.
  // Le site vit à la racine du sous-domaine : les chemins sont absolus.
  base: "/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'query': ['@tanstack/react-query'],
        },
      },
    },
  },
}));
