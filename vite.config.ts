// [AI_START TIMESTAMP=2025-06-15 12:00:00]
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';
import VueRouter from 'unplugin-vue-router/vite';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';

export default defineConfig({
  plugins: [
    VueRouter({
      routesFolder: 'src/views',
      extensions: ['.vue'],
      dts: false,

      // 1. 修改路由名称 (Name)
      routeNameTransformer: (name) => {
        return name.replace(/View$/, '');
      },

      // 2. 修改路由路径 (Path)
      extendRoute(route) {
        // 将末尾的 View 或 view 删掉（例如 /homeview 变为 /home）
        if (route.path.toLowerCase().endsWith('view')) {
          route.path = route.path.replace(/[Vv]iew$/, '');
        }
        // 如果处理后变成空字符串（比如旧的是 /View），则修复为根路径 /
        if (route.path === '') {
          route.path = '/';
        }
      },
    }),
    vue(),
    tailwindcss(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      dirs: ['src/apis/**', 'src/plugins'],
      // dts: 'src/auto-imports.d.ts'
      dts: false,
      eslintrc: {
        enabled: false,
      },
    }),

    Components({
      dirs: ['src/components'],
      extensions: ['vue'],
      deep: true,
      // dts: 'src/components.d.ts',
      dts: false,
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
// [AI_END LINES=15 TIMESTAMP=2025-06-15 12:00:00]
