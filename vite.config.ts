import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vitejs.dev/config/
// @ts-ignore
export default defineConfig(config => {
  const isDev = config.mode === 'development';
  // const isProd = mode === 'production'

  const server = {
    port: '3030',
    cors: { origin: '*' },
  };
  const define = { 'process.env': {} };

  const plugins = [vue(), vueDevTools()];

  let optimizeDeps = {};
  if (isDev) {
    optimizeDeps = {
      include: ['vue', 'vue-router', 'pinia', 'lodash', 'dayjs'],
    };
  }

  return {
    server,
    build: {
      // reference: https://rollupjs.org/configuration-options/
      rollupOptions: {
        input: {
          main: resolve(__dirname, './index.html'),
          'main-mobile': resolve(__dirname, './index-mobile.html')
        },
        output: [
          {
            name: 'main',
            dir: 'app'
          },
          {
            name: 'main-mobile',
            dir: 'app',
          }
        ]
      },
    },
    define,
    plugins,
    optimizeDeps,
    resolve: {
      alias: {
        vue: 'vue/dist/vue.esm-bundler.js',
        '@': resolve(__dirname, './src')
      },
    },
  };
});
