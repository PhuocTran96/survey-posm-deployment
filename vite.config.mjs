import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [
    react({
      include: /\.(js|jsx|ts|tsx)$/
    }),
  ],
  define: {
    'process.env': {}
  },
  build: {
    outDir: 'build',
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx'
      }
    }
  }
});
