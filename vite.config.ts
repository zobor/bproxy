import { defineConfig } from "vite";
const { getThemeVariables } = require("antd/dist/theme");
import react from "@vitejs/plugin-react";

const isDev = process.env.NODE_ENV === 'development';
console.log('process.env.NODE_ENV', process.env.NODE_ENV);

// https://vitejs.dev/config/
const libBuild = defineConfig({
  root: "./",
  base: "/dist/",
  build: {
    outDir: "./dist",
    emptyOutDir: false,
    lib: {
      entry: './src/web/inspect.ts',
      name: 'BproxyInspect',
      fileName: 'inspect',
      formats: ['umd'],
    }
  },
});

const pageBuild = defineConfig({
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
})

const config = isDev ? libBuild : pageBuild;

export default config;
