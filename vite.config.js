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
      // Auto-update SW and register
      registerType: 'autoUpdate',

      // Enable SW in dev ONLY if you want to test PWA locally
      devOptions: {
        enabled: true,
        type: 'module',
      },

      // Use Workbox generateSW (default)
      manifest: {
        name: 'My React PWA',
        short_name: 'ReactPWA',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',

        // ✅ helps "Open App" launch/focus the installed app (Chromium)
        capture_links: 'existing-client-navigate',
        launch_handler: { client_mode: 'focus-existing' },

        icons: [
          { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },

      workbox: {
        // Precache typical static assets
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest,gif,jpg,jpeg,webp}'],

        // SPA fallback, but NEVER for API or file requests
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [
          /^\/api\//,
          /\/.*\.(?:js|css|json|png|jpg|jpeg|gif|svg|ico|webp|txt|map)$/i
        ],

        // Runtime caching rules
        runtimeCaching: [
          // Always go to the network for API (no cache)
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
            handler: 'NetworkOnly',
            method: 'GET',
            options: { cacheName: 'api-no-cache' }
          },
          // (optional) Google Fonts
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          }
        ],

        // Good defaults
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true
      }
    })
  ]
});
