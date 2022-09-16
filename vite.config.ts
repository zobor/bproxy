import { defineConfig } from 'vite';
const { getThemeVariables } = require('antd/dist/theme');
import react from '@vitejs/plugin-react';
import progress from 'vite-plugin-progress';
import svgr from 'vite-plugin-svgr';

const outDir = './web-build';

// for build weinre
const weinre = defineConfig({
  root: './',
  base: '/web/',
  build: {
    outDir: './src/web/libs',
    emptyOutDir: false,
    lib: {
      entry: './src/web/inspect.ts',
      name: 'BproxyInspect',
      fileName: 'inspect',
      formats: ['umd'],
    },
  },
});

// for build webpage
const page = defineConfig({
  root: './',
  base: '/web/',
  build: {
    outDir,
    emptyOutDir: true,
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
  plugins: [
    react(),
    progress(),
    svgr({
      exportAsDefault: true,
    }),
  ],
});

let config;
switch (process.env.NODE_ENV) {
  case 'weinre':
    config = weinre;
    break;
  default:
    config = page;
    break;
}

export default config;
