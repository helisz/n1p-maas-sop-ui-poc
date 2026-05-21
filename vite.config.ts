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
        // 1. 先把末尾的 view 或 View 删掉
        let path = route.path.replace(/[Vv]iew$/, '');

        // 2. 将驼峰命名（如 SubscribedServices）转为连字符（subscribed-services）
        path = path
          .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
          .replace(/([a-z\d])([A-Z])/g, '$1-$2')
          .toLowerCase();

        // 3. 针对 services 目录下的特殊处理：将 -services 尾缀删掉
        // 这样 /services/subscribed-services 就会变成 /services/subscribed
        if (path.startsWith('/services/') && path.endsWith('-services')) {
          path = path.replace(/-services$/, '');
        }

        // 4. 修复根路径
        if (path === '') {
          path = '/';
        }

        // 将处理好的新路径赋值回去
        route.path = path;
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
