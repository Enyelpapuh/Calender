import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Ruta absoluta donde se encuentra el proyecto de Django (proporcionada por el usuario)
// Ruta explícita al backend dentro del repo "Calender"
const DJANGO_ROOT = process.env.DJANGO_ROOT ??
  path.resolve(__dirname, '..', '..', 'backend');

// **AÑADE ESTO PARA DEBUGGING**
const BUILD_OUTPUT_PATH = path.resolve(DJANGO_ROOT, "static/dist");
console.log("Vite intentará escribir la salida en:", BUILD_OUTPUT_PATH);
// **FIN DEL DEBUGGING**

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // Configuración Esencial para Django/Producción
  build: {
    // 1. Directorio de Salida (Output Directory)
    // Usamos la ruta absoluta calculada arriba para escribir directamente en
    // /.../backend/static/dist
    outDir: BUILD_OUTPUT_PATH,

    // 2. Opciones de Build
    emptyOutDir: true,
    manifest: true, // Necesario para integrar con Django (django-vite, django-webpack-loader, etc.)
    assetsDir: "assets", // subcarpeta dentro de outDir para recursos (js/css/img)
    sourcemap: false, // true para debugging; en producción suele estar en false

    // Si necesitas entradas específicas (multi-page) descomenta/adapta:
    // rollupOptions: {
    //   input: {
    //     main: path.resolve(__dirname, "src/main.tsx"),
    //     // otra entrada: path.resolve(__dirname, "src/other.tsx"),
    //   },
    // },
  },

  // 3. Ruta Base (Base URL)
  // Debe coincidir con la URL donde Django/Apache servirán los estáticos.
  base: "/static/dist/",
})