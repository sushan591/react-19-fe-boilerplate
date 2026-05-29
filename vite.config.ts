import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  const isAnalyze = mode === 'analyze';

  return {
    plugins: [
      react(),
      isAnalyze &&
        visualizer({
          filename: 'dist/stats.html',
          template: 'treemap',
          gzipSize: true,
          brotliSize: true,
          open: true,
        }),
    ],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // More granular chunk splitting for better optimization
            if (id.includes('node_modules')) {
              // React core - keep React minimal
              if (id.includes('react/') && !id.includes('react-dom') && !id.includes('react-router')) {
                return 'react-core';
              }
              // React DOM - separate from React core
              if (id.includes('react-dom')) {
                return 'react-dom';
              }
              // Router
              if (id.includes('react-router')) {
                return 'router-vendor';
              }
              // State management
              if (id.includes('@reduxjs/toolkit') || id.includes('react-redux') || id.includes('redux-persist')) {
                return 'redux-vendor';
              }
              // HTTP client
              if (id.includes('axios')) {
                return 'http-vendor';
              }
              // React Query core
              if (id.includes('@tanstack/react-query') && !id.includes('devtools')) {
                return 'query-vendor';
              }
              // React Query DevTools (separate chunk, only loaded in dev)
              if (id.includes('@tanstack/react-query-devtools')) {
                return 'query-devtools';
              }
              // Sentry core
              if (id.includes('@sentry/core') || id.includes('@sentry/browser')) {
                return 'sentry-core';
              }
              // Sentry internal (tracing, replay, etc. are bundled here in v8+)
              if (id.includes('@sentry-internal')) {
                return 'sentry-tracing';
              }
              // Sentry React integration
              if (id.includes('@sentry/react')) {
                return 'sentry-react';
              }
              // Other vendor libraries
              return 'vendor';
            }
            
            // App chunks - split by feature for better caching
            if (id.includes('/hooks/')) {
              return 'hooks';
            }
            if (id.includes('/components/')) {
              return 'components';
            }
            if (id.includes('/store/')) {
              return 'store';
            }
            if (id.includes('/core/')) {
              return 'core';
            }
            if (id.includes('/screens/')) {
              return 'screens';
            }
            if (id.includes('/router/')) {
              return 'router';
            }
          },
          // Optimize chunk file names
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
        // Externalize virtual modules in production
        external: isDev ? [] : ['virtual:*'],
      },
      // Optimize chunk size thresholds
      chunkSizeWarningLimit: 500, // Warn about chunks larger than 500kb
      target: 'esnext', // Use modern JS for smaller bundles
      minify: isDev ? false : 'terser', // Only minify in production
      sourcemap: isDev ? true : false, // Source maps only in dev
      cssCodeSplit: true, // Split CSS into separate files
    },
    // Enable gzip compression
    server: {
      host: true,
    },
  };
});
