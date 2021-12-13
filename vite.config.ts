import { defineConfig } from "vite";
import { resolve } from "path";
const { getThemeVariables } = require("antd/dist/theme");
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  root: "./",
  base: "/dist/",
  build: {
    outDir: "./dist",
    emptyOutDir: false,
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: getThemeVariables({
          dark: true,
          compact: true,
        }),
        javascriptEnabled: true,
      },
    },
  },
  server: {
    port: 8889,
  },
  plugins: [react()],
});
