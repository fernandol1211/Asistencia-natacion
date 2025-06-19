import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "https://fernandol1211.github.io/Asistencia-natacion", // Base path para GitHub Pages
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Configuración para variables de entorno en producción
  build: {
    sourcemap: false, // Desactiva sourcemaps para reducir tamaño
    minify: "terser", // Minificación más agresiva
    terserOptions: {
      compress: {
        drop_console: true, // Elimina console.logs en producción
      },
    },
  },
});
