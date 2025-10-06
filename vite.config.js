// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  build: {
    outDir: 'dist',
  },
  plugins: [
    react(),
    VitePWA({
      // auto-update the SW and claim clients quickly
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,      // enable SW in dev only if you need to test PWA
        type: 'module',
      },

      // We are using the default "generateSW" strategy.
      // (Remove injectManifest; it only applies to the "injectManifest" strategy.)

      manifest: {
        name: 'My React PWA',
        short_name: 'ReactPWA',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
          { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },

      workbox: {
        // Precache these static asset types
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],

        // IMPORTANT: don't let SPA fallback hijack API routes
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [
          /^\/api\//, // never treat /api/* navigations as SPA pages
          /\/.*\.(?:js|css|json|png|jpg|jpeg|gif|svg|ico|webp)$/i
        ],

        // Runtime caching rules
        runtimeCaching: [
          // Always hit network for any API (no cache, no fallback)
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
            handler: 'NetworkOnly',
            method: 'GET',
            options: {
              cacheName: 'api-no-cache'
            }
          },

          // Example: Google Fonts (keep if you actually use them)
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          }
        ],

        // Nice-to-haves
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true
      }
    })
  ]
});
