import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    allowedHosts: ["myapp.local"],
    proxy: {
      "/api": {
        target: "https://3krgwsgr-3001.inc1.devtunnels.ms/", // base url
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    host: "0.0.0.0", // ✅ Required for Render production preview
    port: parseInt(process.env.PORT || "4173"), // ✅ Use Render PORT dynamically
    allowedHosts: [
      "attendence-system-grace.onrender.com", // ✅ Your Render domain
      "localhost", // optional: allow local testing too
    ],
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "esbuild",
    chunkSizeWarningLimit: 1000,
  },
});
