import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Secure cookie 전송 여부를 HTTP origin에서 비교하기 위한 설정
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "auth-playground.test",
    port: 5175,
    strictPort: true,
    allowedHosts: ["auth-playground.test"],
    proxy: {
      "/api": { target: "http://localhost:3000", changeOrigin: true },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
