import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  build: {
    target: 'esnext',
    cssCodeSplit: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        location: resolve(__dirname, 'location.html'),
        values: resolve(__dirname, 'values.html'),
        architecture: resolve(__dirname, 'architecture.html'),
        amenities: resolve(__dirname, 'amenities.html'),
        services: resolve(__dirname, 'services.html'),
        floorplans: resolve(__dirname, 'floorplans.html'),
        gallery: resolve(__dirname, 'gallery.html'),
        contact: resolve(__dirname, 'contact.html'),
        en_main: resolve(__dirname, 'en/index.html'),
        en_location: resolve(__dirname, 'en/location.html'),
        en_values: resolve(__dirname, 'en/values.html'),
        en_architecture: resolve(__dirname, 'en/architecture.html'),
        en_amenities: resolve(__dirname, 'en/amenities.html'),
        en_services: resolve(__dirname, 'en/services.html'),
        en_floorplans: resolve(__dirname, 'en/floorplans.html'),
        en_gallery: resolve(__dirname, 'en/gallery.html'),
        en_contact: resolve(__dirname, 'en/contact.html'),
      },
      output: {
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
})
