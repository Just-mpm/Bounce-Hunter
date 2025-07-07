import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        }
      }
    }
  },
  define: {
    // Add environment variables here if needed
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  },
  esbuild: {
    loader: 'tsx',
    include: /\.[jt]sx?$/,
    exclude: []
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
        '.ts': 'tsx',
        '.jsx': 'jsx',
        '.tsx': 'tsx'
      }
    }
  }
});