import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // optional shortcut
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      // Proxy API calls to backend during development
      "/api": {
        target: "http://localhost:5000", // your backend dev URL
        changeOrigin: true,
        secure: false,
      },
      "/images": {
        target: "http://localhost:8000", // if you serve images locally
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
