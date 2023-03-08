import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      vue({
          template: { transformAssetUrls }
      }),
      vuetify({
          autoImport: true,
          styles: {
              configFile: 'src/styles/settings.scss',
          },
      }),
      VitePWA({ registerType: 'autoUpdate' })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
      extensions: [
          '.js',
          '.json',
          '.jsx',
          '.mjs',
          '.ts',
          '.tsx',
          '.vue',
      ],
  },
    server: {
        port: 3001,
    },
})
