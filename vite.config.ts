// [AI_START TIMESTAMP=2025-06-15 12:00:00]
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';

export default defineConfig({
  plugins: [
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
