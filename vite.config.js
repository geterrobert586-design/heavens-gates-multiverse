import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

// Heavens Gates Multiverse - Standalone Vite Config
// Base44 plugin removed. This app now runs from local source code.

export default defineConfig({
  logLevel: "info",

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  plugins: [react()],

  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
  },
});
