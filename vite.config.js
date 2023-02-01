import react from '@vitejs/plugin-react'
import reactRefresh from '@vitejs/plugin-react-refresh'
import path from 'path'
import { defineConfig } from 'vite'
import { esbuildCommonjs } from '@originjs/vite-plugin-commonjs'

export default defineConfig({

  plugins: [
    react(),
    reactRefresh(),
  ],

  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        esbuildCommonjs(['react-calendar', 'react-date-picker', 'react-clock', 'react-time-picker']),
      ],
    },
  },

  // config
  root: 'src',
  base: process.env.APP_ENV === 'development' ? '/' : '/dist/',

  build: {
    // output dir for production build
    outDir: '../public/dist',
    emptyOutDir: true,

    // emit manifest so PHP can find the hashed files
    manifest: true,

    target: 'es2015',

    // our main entry
    rollupOptions: { input: path.resolve(__dirname, 'src/index.jsx') },
    commonjsOptions: { transformMixedEsModules: true },
  },

  server: {
    origin: 'http://localhost:3000',
    // required to load scripts from custom host
    cors: true,

    // we need a strict port to match on PHP side
    strictPort: true,
    port: 3000,
    hmr: { host: 'localhost' },
    commonjsOptions: { transformMixedEsModules: true },
  },
})
