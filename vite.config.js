import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isGhPages = process.env.GH_PAGES === 'true'

export default defineConfig({
  plugins: [react()],
  base: isGhPages ? '/smart-campus/' : '/',
  server: {
    port: 3000,
    host: true
  }
})
