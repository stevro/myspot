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
      VitePWA({
          registerType: 'autoUpdate',
          devOptions: {
              // enabled: process.env.NODE_ENV === 'development'
              enabled: false
          },
          workbox: {
              globPatterns: ['**/*.{js,css,html,ico,png,svg}']
          },
          includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
          manifest: {
              name: 'Yale EMBA \'23',
              short_name: 'Yale EMBA \'23',
              description: 'App to help Yale EMBA \'23 alumni gather on various events',
              theme_color: '#ffffff',
              background_color: "#ffffff",
              display: "standalone",
              orientation: "portrait",
              dir:"ltr",
              icons: [
                  {
                      "src": "android-chrome-36x36.png",
                      "sizes": "36x36",
                      "type": "image/png",
                      "density": "0.75"
                  },
                  {
                      "src": "android-chrome-48x48.png",
                      "sizes": "48x48",
                      "type": "image/png",
                      "density": "1.0"
                  },
                  {
                      "src": "android-chrome-72x72.png",
                      "sizes": "72x72",
                      "type": "image/png",
                      "density": "1.5"
                  },
                  {
                      "src": "android-chrome-96x96.png",
                      "sizes": "96x96",
                      "type": "image/png",
                      "density": "2.0"
                  },
                  {
                      "src": "android-chrome-144x144.png",
                      "sizes": "144x144",
                      "type": "image/png",
                      "density": "3.0"
                  },
                  {
                      "src": "android-chrome-192x192.png",
                      "sizes": "192x192",
                      "type": "image/png",
                      "density": "4.0"
                  }
              ]
          }
      })
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
