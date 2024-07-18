import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: "public",
  build: {
    outDir: "build",
  },
  server: {
    port: 7777,
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: resolve(__dirname, "src"),
      },
    ],
  },
});
