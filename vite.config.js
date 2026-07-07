// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],

// })

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/",
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      includeAssets: ["favicon.ico", "robots.txt"],

      manifest: {
        name: "Nepas Web",
        short_name: "Nepas",
        description: "Offline Medical Guidelines App",
        theme_color: "#205072",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        server: {
          proxy: {
            // Whenever our app requests /wp-content, Vite intercepts it
            "/wp-content": {
              target: "https://nepas.org.np",
              changeOrigin: true,
              secure: false,
            },
          },
        },
      },

      workbox: {
        // cache everything important
        globPatterns: ["**/*.{js,css,html,ico,png,svg,pdf}"],
        navigateFallback: "/index.html",
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.includes("pdf.worker"),
            handler: "NetworkOnly",
          },
          {
            urlPattern: ({ request }) => request.destination === "document",
            handler: "NetworkFirst",
          },
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
          },
          {
            urlPattern: ({ request }) => request.destination === "script",
            handler: "CacheFirst",
          },
          // {
          //   urlPattern: ({ url }) => url.pathname.startsWith("/pdfs/"),
          //   handler: "CacheFirst",
          //   options: {
          //     cacheName: "pdf-cache",
          //     expiration: {
          //       maxEntries: 100,
          //       maxAgeSeconds: 60 * 60 * 24 * 365,
          //     },
          //   },
          // }
        ],
      },
    }),
  ],
});
