// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
    https: true,
    port: 5173,
    proxy: {
      '/chatHub': {
        target: 'https://localhost:7033', // ASP.NET Core backend
        changeOrigin: true,
        secure: false, // skip SSL validation for dev cert
        ws: true
      },
    },
  },
});
