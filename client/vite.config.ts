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
    port: 5173,
    https: {
      key: fs.readFileSync('../certs/local-key.pem'),
      cert: fs.readFileSync('../certs/local-cert.pem'),
    },
    strictPort: true,
    allowedHosts: ["auth-playground.test"],
    proxy: {
      // 로컬 환경 테스트에서 CORS 정책 문제 해결을 위해 프록시 설정
      // api 요청은 3000번 포트로 전달
      "/api": { target: "http://localhost:3000", changeOrigin: true },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
