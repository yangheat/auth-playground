import fs from "node:fs"
import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 5174,
    strictPort: true,
    https: {
      key: fs.readFileSync('../certs/local-key.pem'),
      cert: fs.readFileSync('../certs/local-cert.pem'),
    },
    allowedHosts: ["external-test.test"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
})
