import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons.svg', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Vasista Manpower Solutions',
        short_name: 'Vasista',
        description: 'Quality Manpower Solutions for Careers and Businesses',
        theme_color: '#062B67',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'vasista-logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'vasista-logo.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'vasista-logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 5000000, // Increase limit to 5MB
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ],
})
