import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
    host: true
  },

  build: {
    outDir: "dist",
    sourcemap: false,

    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        lrAi: resolve(__dirname, "lr-ai.html"),
        explore: resolve(__dirname, "explore.html")
      }
    }
  }
});
