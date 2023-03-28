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
              name: 'My Spot App',
              short_name: 'My Spot App',
              description: 'App to help people manage booking on various events',
              theme_color: '#ffffff',
              background_color: "#ffffff",
              display: "standalone",
              orientation: "portrait",
              dir:"ltr",
              icons: [
                  {
                      src: 'android-chrome-192x192.png',
                      sizes: '192x192',
                      type: 'image/png'
                  },
                  {
                      src: 'android-chrome-256x256.png',
                      sizes: '256x256',
                      type: 'image/png'
                  },
                  {
                      src: 'android-chrome-512x512.png',
                      sizes: '512x512',
                      type: 'image/png'
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
