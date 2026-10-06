import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
    host: true,
  },

  build: {
    outDir: "dist",
    sourcemap: false,

    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        lrAi: resolve(__dirname, "lr-ai.html"),
        explore: resolve(__dirname, "explore.html"),
      },
    },
  },
});
