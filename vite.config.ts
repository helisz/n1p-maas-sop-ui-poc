import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import VueRouter from 'unplugin-vue-router/vite';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';

export default defineConfig({
  plugins: [
    // 1. Automated file-based routing configuration
    VueRouter({
      routesFolder: 'src/views',
      extensions: ['.vue'],
      dts: 'src/types/typed-router.d.ts',

      // Ignore internal components from generating routes
      exclude: ['**/components/**'],

      // Normalize paths by removing trailing slashes for nested index routes
      extendRoute(route) {
        if (route.path !== '/' && route.path.endsWith('/')) {
          route.path = route.path.slice(0, -1);
        }
      },
    }),

    vue(),
    tailwindcss(),

    // 2. Auto-import registration engine for structural composables and scripts
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      dirs: ['src/apis/**', 'src/plugins'],
      dts: 'src/types/auto-imports.d.ts',
      eslintrc: {
        enabled: true,
        filepath: './src/types/.eslintrc-auto-import.json',
      },
    }),

    // 3. Selective auto-import component resolver to register UI widgets and page elements cleanly
    Components({
      dirs: [
        'src/components/**',
        'src/layouts',
        'src/views/**/components', // Scans only page-specific child components
      ],
      extensions: ['vue'],
      dts: 'src/types/components.d.ts',
      directoryAsNamespace: false,
      collapseSamePrefixes: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 3001,
  },
});
