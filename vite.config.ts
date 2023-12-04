import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import progress from 'vite-plugin-progress';
import svgr from 'vite-plugin-svgr';
import { viteExternalsPlugin } from 'vite-plugin-externals';
import GlobPlugin from 'vite-plugin-glob';
// import { createFilter } from '@rollup/pluginutils';

const outDir = resolve(__dirname, './web-build');
const __BASE_ORIGIN__ = process.env.NODE_ENV === 'dev-web' ? 'http://127.0.0.1:8888' : '';

// for build weinre
const weinre = defineConfig({
  root: './',
  base: '/web/',
  build: {
    target: 'chrome61',
    outDir: './static/dist',
    emptyOutDir: false,
    minify: true,
    lib: {
      entry: './src/web/inspect.ts',
      name: 'BproxyInspect',
      fileName: 'inspect',
      formats: ['iife'],
    },
  },
});

// for build webpage
const page = defineConfig({
  root: './src/web/',
  base: '/web/',
  build: {
    outDir,
    emptyOutDir: true,
  },
  server: {
    port: 8889,
    open: 'http://localhost:8889',
  },
  define: {
    BUILD_VERSION: JSON.stringify(
      new Date()
        .toLocaleDateString()
        .split('/')
        .map((item) => item.padStart(2, '0'))
        .join('-'),
    ),
  },
  optimizeDeps: {
    exclude: ['__BASE_ORIGIN__'],
  },
  plugins: [
    progress(),
    react(),
    GlobPlugin({}),
    svgr({
      exportAsDefault: true,
    }),
    viteExternalsPlugin({
      react: 'React',
      'react-dom': 'ReactDOM',
      'react-dom/client': 'ReactDOM',
      lazy: ['React', 'lazy'],
      antd: 'antd',
      qrcode: 'QRCode',
    }),
    htmlTransform({ include: '**/*.html' }),
  ],
});

function htmlTransform(opts: any = {}) : any{
  return {
    name: 'html-transform',
    transformIndexHtml(html, { server }) {
      return transformHtmlVars(html);
    }
  }
}

function transformHtmlVars(code) {
  return code.replace(/__BASE_ORIGIN__/g, __BASE_ORIGIN__);
}

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
